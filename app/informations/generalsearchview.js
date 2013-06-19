define("informations/generalsearchview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "moment",
    "common/basicview",
    "events/common/events",
    "informations/userslist/listusers",
    "collections/locals",

	"text!./searchpage.html",
	"text!./_generalresults.html"
], function ($, Backbone, _, Handlebars, Moment, BasicView, EventCollection, ListUserCollection, LocalsCollection, SearchPageTemplate, GeneralResultsPartial) {

	/**
	View abstracta das páginas de prémios

	@class GeneralSearchView
	@extends BasicView
	**/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@final
		@default "div[data-role=content]"
		**/
		el: $("[data-role=content]"),

		/**
		Id da página

		@property id 
		@type String
		@static
		@final
		@default "search-page"
		**/
		id: "search-page",

		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Pesquisa Geral"
		**/
		pageName: "Pesquisa Geral",

		/**
		Template da página

		@property template 
		@type template
		@final
		@protected
		@default SearchPageTemplate
		**/
		template: SearchPageTemplate,

		/**
		Partial dos resultados da pesquisa

		@property partial 
		@type String
		@final
		@protected
		@default GeneralResultsPartial
		**/
		partial: GeneralResultsPartial,
		
		/**
        Dicionário que guarda informações relativas aos tipos de
        resultados possíveis

        @property searchable
        @type Object
        @static
        @final
        @protected
        @default {"paper": {url: '#paper/'}, "workshop": {url: '#workshop/'}, 
					"socialevent": {url: '#social/'}, "keynote": {url: '#keynote/'},
					"session": {url: '#session/'}, "speaker": {url: '#user/'}, 
					"participant":{url: '#user/'}, "local": {url: '#local/'}},
        **/
		searchable: {"paper": {url: '#paper/'}, "workshop": {url: '#workshop/'}, 
					"socialevent": {url: '#social/'}, "keynote": {url: '#keynote/'},
					"session": {url: '#session/'}, "speaker": {url: '#user/'}, 
					"participant":{url: '#user/'}, "local": {url: '#local/'}},

		/**
		Eventos lançados pela interacção coma página

		@property events
		@type Object
		@protected
		**/
		events: {

			"click #search" : "search",

		},

		/**
        Construtor da classe. Vai buscar a informação necessária paras as pesquisas e faz o render da página

        @constructor
        @protected
        @class GeneralSearchView
        **/
		initialize: function ()
		{
			
			_.bindAll(this);

			var self = this;
			this.listLocals = new LocalsCollection();
			this.listParticipants = new ListUserCollection({isSpeakers: false});
			this.listSpeakers = new ListUserCollection({isSpeakers: true});
			this.listEvents = new EventCollection();

			this.listLocals.fetch({
				success: function () {
					console.log("localsloaded");
				},
				error: function () {
					console.log("localsNOTloaded");
				}
			});

			this.listParticipants.fetch({
				success: function () {
					console.log("participantsloaded");
				},
				error: function (){
					console.log("participantsNOTloaded");
				}
			});

			this.listSpeakers.fetch({
				success: function () {
					console.log("speakersloaded");
				},
				error: function (){
					console.log("speakersNOTloaded");
				}
			});
			
			this.listEvents.fetch().done(function () {
			    self.renderLayout();
				self.render();
			    
			 });
			
		},


		/**
		Faz o rendering da página sem resultados, ou seja, estado inicial

		@method render
		@protected
		@chainable
		**/
		render: function () {

			
			var context = {
	  				results : null
	  			};

			var html = this.compileTextTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			return this;

		},

		/**
        Método que trata da informação a ser apresentada na parte de resultados

        @method treatResults
        @protected
        @param {Array} conferenceEvents eventos resultantes da pesquisa
        @param {Array} participants participantes  resultantes da pesquisa
        @param {Array} speakers oradores resultantes da pesquisa
        @param {Array} locals locais  resultantes da pesquisa
        @return {Object} objecto que contem as listas de resultados de cada tipo pesquisável
        @example {
				"participants" 	: [],
				"speakers" 	  	: [],
				"papers"		: [],
				"keynotes" 		: [],
				"workshops" 	: [],
				"sessions" 		: [],
				"socialevents" 	: [],
				"locals" 		: [], 
			} 
        **/
		treatResults: function(conferenceEvents, participants, speakers, locals) {
			
			var that = this;
			var results = {
				"participants" 	: null,
				"speakers" 	  	: null,
				"papers"		: [],
				"keynotes" 		: [],
				"workshops" 	: [],
				"sessions" 		: [],
				"socialevents" 	: [],
				"locals" 		: null, 
			}

			if(conferenceEvents)
			{
				var dateFormat = "YYYY-MM-DD HH:mm";

				_.each(conferenceEvents, function (obj) {
					var eventAttrs = obj.attributes;

					var date = eventAttrs.hours.toString();
            		var startDate = Moment(date);
		   			var duration = eventAttrs.duration;

					var type = eventAttrs.type.toLowerCase();
					var types = type +"s";

					attrs = {
						url 	: that.searchable[type].url + eventAttrs.type_id,
						name 	: eventAttrs.name,
						start 	: startDate.utc().format(dateFormat), 
						end 	: startDate.add('minutes',duration).utc().format(dateFormat) 
					}
					results[types].push(attrs);
				})
			}

			if(participants)
			{
				results["participants"] = _.map(participants, function (obj) {
					var attrs = obj.attributes;
					return {
						url 		: that.searchable["participant"].url + attrs.id,
						name 		: attrs.name,
						institution : attrs.institution,
						area		: attrs.area
					}
				}); 
			}

			if(speakers)
			{
				results["speakers"] =  _.map(speakers, function (obj) {
					var attrs = obj.attributes;
					return {
						url 		: that.searchable["speaker"].url + attrs.id,
						name 		: attrs.name,
						institution : attrs.institution,
						area		: attrs.area
					}
				}); 
			}

			if(locals)
			{
				results["locals"] = _.map(locals, function (obj) {
					var attrs = obj.attributes;
					return {
						url 		: that.searchable["local"].url + attrs.id,
						name 		: attrs.name,
					}
				}); 
			}

			
			return results;
		},

		/**
        Método que trata de recolher os termos de pesquisa e faz a pesquisa em si, 
        seguidamente invoca o treatResults para recolher a informação dos resultados
        e por fim apresenta-os

        @method search
        @protected
        **/
		search: function() {
  				
	  			var terms = $("#general-search-basic").val().trim();

	  			var counter = 0;
				var eventTypes = {};
				var speakers = false;
				var participants = false;
				var locals = false;


				_.chain(this.searchable)
				 .pairs(this.searchable)
	  			 .each(function (pair){
	  				var idString = "#"+pair[0];
	  				var checkValue = $('fieldset').find(idString).is(':checked');

	  				if(pair[0] === "participant")
						participants = checkValue;
	  				else if(pair[0] === "speaker")
	  					speakers = checkValue;
	  				else if(pair[0] === "local")
	  			 		locals = checkValue;
	  				else
	  				{
	  					eventTypes[pair[0]] = checkValue;
	  					if(checkValue)
	  						counter+=1;
	  				}

	  				
	  			});

	  			
	  			
	  			var eventsResults = [];
	  			var participantsResults = [];
	  			var speakersResults = [];
	  			var localsResults = [];


	  			if(counter === 0 && !speakers && !participants && !locals)
	  			{ //Apenas os resultados por string
	  				speakersResults = this.listSpeakers.getUsersWithString(terms);
	  				participantsResults = this.listParticipants.getUsersWithString(terms);
	  				eventsResults = this.listEvents.getEventsWithString(terms);
	  				localsResults = this.listLocals.getLocalsWithString(terms);

	  			}
	  			else
	  			{	
		  			if(counter>0)
		  			{	
		  				var eventsStringResults = this.listEvents.getEventsWithString(terms);
		  				var typeResults = this.listEvents.getEventsOfType(eventTypes);		
		  			  	eventsResults = _.intersection(eventsStringResults, typeResults);
		  			}
		  			
		  			if(speakers)
		  			{
		  				speakersResults = this.listSpeakers.getUsersWithString(terms);
		  			}

		  			if(participants)
		  			{
		  				participantsResults = this.listParticipants.getUsersWithString(terms);
		  			}

		  			if(locals)
		  			{
		  				localsResults = this.listLocals.getLocalsWithString(terms);
		  			}
	  			}

	  			$("#search-results").empty();
	  			var results = this.treatResults(eventsResults, participantsResults, speakersResults, localsResults);

	  			var context = results;
	  			var html = this.compileTextTemplate(this.partial, context);

				$("#search-results").append(html);
				this.enhanceJQMComponentsAPI();
  		},

	});


});