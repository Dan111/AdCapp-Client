define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/session",
    "models/personalagenda",
    "views/event",
    "views/comment",
    "views/aboutevent",
    "views/sessionpapers"
], function ($, Backbone, _, Handlebars, SessionModel, PersonalAgendaModel, EventView, CommentsView, AboutView, SessionPapersView) {

	return EventView.extend({

		el 				: "div[data-role=content]",

		id 				: "session-page",
		pageName		: "Sessão",

		descName		: "Descrição",
		speakersTitle	: "Moderador",

		papersTabId		: "papers-tab",
		papersTabName 	: "Papers",

		paperIds: null,


		events: function(){

			return _.extend({
				"click #add-remove-event" : "addRemoveEvents",
				"click #papers-tab"	: "renderPapersTab"
			}, EventView.prototype.events);
		},


		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			var self = this;

			this.personalAgenda = new PersonalAgendaModel({id: 0, Personal: true});

			this.personalAgenda.fetch({
				success: function () {
					console.log("Personal Events loaded");
				},
				error: function (){
					console.log("Fail to get events or don't have any");
				}
			});

			this.model = new SessionModel({id: modelId});
			this.model.fetch({
				success: function () {
					EventView.prototype.initialize.apply(self);
				}
			});


		},


		renderPapersTab: function () {

			console.log("papers tab");

			this.renderTab(this.papers);

			return this;
		},


		/**
		Faz o rendering do layout base das páginas de sessão e verficia
		se a agenda pessoal contém todos os eventos referentes a esta sessão,
		se não tiver remove o check que a view EventView adiciona, porque a 
		agenda contém um evento da sessão,se for o caso

		@method render
		@protected
		@chainable
		**/
		render: function (){
			//Apenas para desfazer o check adicionado na view event, caso já tenha um dos papers na agenda

			//chamada do método render da superclasse
			EventView.prototype.render.apply(this);

			this.paperIds = this.arrayOfPaperIds();

			var hasEvents = this.personalAgenda.hasEvents(this.paperIds);

			if(!hasEvents)
			{	
				$('#add-remove-event').next().remove();

			}

		},


		createTabs: function (){

			this.about = new AboutView({
				descName		: this.descName,
				description 	: this.model.get('description'),

				speakersTitle	: this.speakersTitle,
				speakers 		: this.model.get('speakers')
			});
			this.addTab(this.about,{id: this.aboutTabId, name: this.aboutTabName});


			this.papers = new SessionPapersView({
				papers 			: this.model.get('papers')
			});
			this.addTab(this.papers,{id: this.papersTabId, name: this.papersTabName});

			//chamada do método createTabs da superclasse
			EventView.prototype.createTabs.apply(this);

		},

		
		/**
		Coloca todos os id's dos eventos de uma sessão num array

		@method arrayOfPaperIds
		@private
		**/
		arrayOfPaperIds: function(){
			return  _.map(this.model.get('papers'), function(paper){
				return paper.id;
			});
		},

		/**
		Adiciona ou remove os eventos da sessão à agenda pessoal, consoante estes estejam
		presentes na agenda pessoal. No caso de ter não ter todos os eventos da sessão
		na agenda pessoal adicona os que faltam

		@method addRemoveEvent
		@protected
		**/
		addRemoveEvent: function (){
			var personalAgenda = this.personalAgenda;

			var hasEvents = personalAgenda.hasEvents(this.paperIds);

			if(hasEvents)
			{	
				_.each(this.paperIds, function(paperId){
					personalAgenda.removeEvent(paperId)
				});
				personalAgenda.save();
				$('#add-remove-event').next().remove();
			}
			else
			{
				_.each(this.paperIds, function(paperId){
					personalAgenda.addEvent(paperId)
				});
				personalAgenda.save();
                $('#add-remove-event').parent().append('<i id="check-event" class="icon-check-sign pull-right"></i>');
			}
		}
		


	});


});