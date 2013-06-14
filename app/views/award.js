define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/event",
    "views/basicview",
    "app.config"
], function ($, Backbone, _, Handlebars, EventModel, BasicView, App) {

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

		voted: null,

		typesInfo: app.TYPESINFO,

		/**
		Eventos lançados pela transição entre tabs
		

		@property events
		@type Object
		@protected
		**/
		events: {

			"click #awards-tab"			: "renderAwardsTab",
			"click #users-votes-tab"	: "renderUsersVotesTab",
			"click #vote-button" 		: "vote"
		},



		initialize: function ()
		{
			_.bindAll(this);

			this.renderLayout();
			this.setElement($("[data-role=content]"));
			this.render();
		},

		getStarted: function(AwardView, self, isEvent, eventsType, collection){

			var attrs = this.ranksInfo.attributes;

			this.isEvent = isEvent;

			this.eventsType = eventsType;

			this.votesArray = attrs.competitors;

			this.prizesArray = attrs.awards;

			this.modelCollection = collection;

			this.voted = attrs.voted;

			this.modelId = this.votesArray[0].id;

			this.modelCollection.fetch({
				success: function () {
					self.model = self.modelCollection.get(self.modelId);
					AwardView.prototype.initialize.apply(self);
				},
				error: function (){
					console.log("Fail ");
				}
			});	
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
						id 			: attrs.id.toString(),
						url 		: that.typesInfo[that.eventsType.toLowerCase()].url + attrs.id.toString(),
						title 		: attrs.name,
						datetime 	: attrs.hour,
						room_name 	: attrs.local.name,
					};
				});
			else
				return _.map(elementsArray, function(element){
					var attrs = element.attributes;
					return {
						id 			: attrs.id.toString(),
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
										isvoted  	: that.voted === attrs.id,
										id 			: attrs.id.toString(),
										url 		: that.typesInfo[that.eventsType.toLowerCase()].url + attrs.id.toString(),
										title 		: attrs.name,
										votes 		: that.getVotes(attrs.id)
									}
								else
									return {
										isvoted  	: that.voted === attrs.id,
										id 			: attrs.id.toString(),
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
					isvoted  	: this.voted === model.id,
					id 			: model.id.toString(),
					url 		: this.typesInfo[this.eventsType.toLowerCase()].url + model.id.toString(),
					title 		: model.name,
					datetime 	: model.hour,
					room_name 	: model.local.name,
					votes 		: this.getVotes(model.id),
					others		: others
				};
			else
				return {
					isEvent		: this.isEvent,
					isvoted  	: this.voted === model.id,
					id 			: model.id.toString(),
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
		},

		incrementVote: function(){
			var votes = $('#votes[value='+ this.voted+'] span').text();
           	console.log(votes);

           	$('#votes[value='+ this.voted+'] span').empty();
    		var newVotes = parseInt(votes) + 1;
    		$('#votes[value='+ this.voted+'] span').text(newVotes);

           	$('#vote-button[value='+ this.voted+'] i').remove();
           	$('#vote-button[value='+ this.voted+'] .ui-btn-text').append('<i class="icon-check-sign"></i>');
		},

		decrementVote: function(){
			var votes = $('#votes[value='+ this.voted+'] span').text();

        	$('#votes[value='+ this.voted+'] span').empty();
        	var newVotes = parseInt(votes) - 1;
        	$('#votes[value='+ this.voted+'] span').text(newVotes);

        	$('#vote-button[value='+ this.voted+'] i').remove();
        	$('#vote-button[value='+ this.voted+'] .ui-btn-text').append('<i class="icon-plus-sign"></i>');
		},

		vote: function(e){

			if(this.voted !== null)
	        {
	        	this.decrementVote();
	        }

			var that = this;

			var url = "http://localhost:3000/" + "votes";

			e.preventDefault();
   			var id = parseInt($(e.currentTarget).attr("value"));


   			var votable_type = this.eventsType;

   			if(votable_type  === null)
   				votable_type = "User";

   			$.ajax({
                method: "POST",

                async: false,

                timeout: 5000,

                url: url,

                //MUDAR O USER ID PARA O ID DO UTILIZADOR DO DISPOSITIVO
                data: { 
                	vote: {
	                    "user_id": 1,
	                    "votable_id": id,
	                    "votable_type": votable_type
	                }
                },

                beforeSend: function () {
                    $.mobile.loading( 'show', {
                            text: "A enviar",
                            textVisible: true
                    });
                },

                complete: function () {
                    //override do ajaxsetup para nao fazer hide do load spinner
                },

                success: function () {
                    $.mobile.loading( 'hide' );
                   	// options.success();
                  	that.showErrorOverlay({text:"Voto atribuído"});
                   	that.voted = id;

                   	that.incrementVote();
                },

                error: function (){
                    that.showErrorOverlay({text: "Erro no envio"});
                    //Para tirar o efeito do decrement
                   	that.incrementVote();
                }
            });
	        
	        
		}

	});

});