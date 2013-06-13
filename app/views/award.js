define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/event",
    "views/basicview"
], function ($, Backbone, _, Handlebars, EventModel, BasicView) {

	/**
	View abstracta das páginas de prémios

	@class AwardView
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
		el: "div[data-role=content]",


		/**
		Template base de todas as páginas de prémio

		@property template 
		@type String
		@final
		@protected
		@default "award-template"
		**/
		template: "award-template",

		awardsTemplate: "awards-template",

		usersVotesTemplate: "users-votes-template",

		/**
		Modelo do evento ao qual corresponde esta página

		@property model 
		@type Backbone.Model
		@final
		@protected
		@default null
		**/
		model: null,

		isEvent: null,

		eventsType: null,

		modelCollection: null,

		votesArray: null,

		prizesArray: null,

		ranksInfo: null,

		typesInfo: {"paper": {color: '#2c3e50', url: '#paper/'}, "workshop": {color: '#16a085', url: '#workshop/'}, 
					"social": {color: '#8e44ad', url: '#social/'}, "keynote": {color: '#2ecc71', url: '#keynote/'},
					"session": {url: '#sessions/'}},

		/**
		Eventos lançados pela transição entre tabs
		e ainda eventos de adição e remoção do evento 
		da agenda pessoal

		@property events
		@type Object
		@protected
		**/
		events: {

			"click #awards-tab"			: "renderAwardsTab",
			"click #users-votes-tab"		: "renderUsersVotesTab"
		},



		initialize: function ()
		{
			_.bindAll(this);

			this.renderLayout();
			this.setElement($("[data-role=content]"));
			this.render();
		},


		/**
		Faz o rendering das páginas de prémios

		@method render
		@protected
		@chainable
		**/
		render: function () {

			var context = null;

			var html = this.compileTemplate(this.template, context);

			this.$el.append(html);
			this.enhanceJQMComponentsAPI();

			this.renderAwardsTab();

			return this;

		},

		refresher: function(html){
			//adição do html pretendido e "refresh" para jquey mobile funcionar 
            $("#prize-tab-placeholder").html(html);
            $("#" + this.id).trigger("create");
		},

		treatPrizesArray: function(){
			var that = this;
			//Obtém os modelos correspondetes aos id's passados
			var elementsArray = this.modelCollection.getByIds(this.prizesArray);

			//Construção dos contextos dos premiados, dependendo do seu tipo,
			//ou seja, se estamos a falar de eventos ou oradores
			if(this.isEvent)
				return _.map(elementsArray, function(element){
					var attrs = element.attributes;
					return {
						url 		: that.typesInfo[that.eventsType].url + attrs.id.toString(),
						title 		: attrs.name,
						datetime 	: attrs.hour,
						room_name 	: attrs.local.name,
					};
				});
			else
				return _.map(elementsArray, function(element){
					var attrs = element.attributes;
					return {
						url 		: "#/users"+attrs.id.toString(),
						name 		: attrs.name,
						institution : attrs.institution,
						area 		: attrs.area,
					};
				});
		},

		renderAwardsTab: function() {
			var awards = [];
			if(this.prizesArray === null)
				awards = null;
			else
				awards = this.treatPrizesArray();

			var context = {
					isEvent	: this.isEvent,
					awards	: awards
			};

			//compilação do template com a sua informação
            var html = this.compileTemplate(this.awardsTemplate, context);

            this.refresher(html);
		},

		getVotes: function(id){
			//Obtém o elemento com um dado id no array de votos
			var element = _.find(this.votesArray, function(obj){
				return obj.id === id;
			});
			return element.votes;
		},

		treatOthers: function(array){
			that = this;
			//Percorre array de modelos construindo o contexto de cada modelo,
			//ou seja, obtendo só a informação necessária
			return _.map(array, function(element){
								var attrs = element.attributes;
								if(that.isEvent)
									return {
										url 		: that.typesInfo[that.eventsType].url + attrs.id.toString(),
										title 		: attrs.name,
										votes 		: that.getVotes(attrs.id)
									}
								else
									return {
										url 		: "#/users"+attrs.id.toString(),
										name 		: attrs.name,
										votes 		: that.getVotes(attrs.id)
									}
							});
		},

		getMostVotedContext: function(){
			var that = this;
			var model = this.model.attributes;
			var context = {};

			
			//Trata do arra votes array, retirando apenas os id's
			var array = _.map(_.rest(this.votesArray), function(obj){
				return obj.id;
			});

			//Vai buscar os modelos necessários, passando os seus id's
			var elementsArray = this.modelCollection.getByIds(array);

			//Trata dos modelos para termos apenas a informação necessária
			var others = this.treatOthers(elementsArray);

			//Construção dos contextos para os eventos ou para o oradores
			if(this.isEvent)
				return {
					isEvent		: this.isEvent,
					url 		: this.typesInfo[this.eventsType].url + model.id.toString(),
					title 		: model.name,
					datetime 	: model.hour,
					room_name 	: model.local.name,
					votes 		: this.getVotes(model.id),
					others		: others
				};
			else
				return {
					isEvent		: this.isEvent,
					url 		: "#/users"+model.id.toString(),
					user        : model,
					votes 		: this.getVotes(model.id),
					others		: others
				};

		},

		renderUsersVotesTab: function() {
			
			var context = this.getMostVotedContext();
			
			//compilação do template com a sua informação
            var html = this.compileTemplate(this.usersVotesTemplate, context);

            this.refresher(html);
		}

	});

});