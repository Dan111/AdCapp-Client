define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "moment",
    "views/basicview",
    "collections/events",
    "collections/listusers",
    "collections/locals"
], function ($, Backbone, _, Handlebars, Moment, BasicView, EventCollection, ListUserCollection, LocalsCollection) {

	return BasicView.extend({

		el: $("[data-role=content]"),

		id: "search-page",
		pageName: "Pesquisa Geral",

		template: "search-page-template",
		partial: "general-results-partial",
		
		searchable: {"paper": {url: '#paper/'}, "workshop": {url: '#workshop/'}, 
					"socialevent": {url: '#social/'}, "keynote": {url: '#keynote/'},
					"session": {url: '#session/'}, "speaker": {url: '#user/'}, 
					"participant":{url: '#user/'}, "local": {url: '#local/'}},

		events: {

			"click #search" : "search",

		},

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





		render: function () {

			
			var context = {
	  				results : null
	  			};

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			return this;

		},

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


		search: function() {
  				console.log(this.listSpeakers);
				console.log("search");
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
	  			var html = this.compileTemplate(this.partial, context);

				$("#search-results").append(html);
				this.enhanceJQMComponentsAPI();
				
			

  		},

	});


});