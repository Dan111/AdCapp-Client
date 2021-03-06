define("events/session/sessionview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "./session",
    "agenda/personalagenda",
    "../common/eventview",
    "../common/sessionpapersview",
    "app.config"
], function ($, Backbone, _, Handlebars, SessionModel, PersonalAgenda, EventView, SessionPapersView, App) {

	/**
	View da página de sessão

	@class events.session.SessionView
	@alternateClassName SessionView
	@extends EventView
	**/
	return EventView.extend({

		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@private
		**/
		el: "div[data-role=content]",


		/**
		ID usado pelo div que contém a página

		@property id 
		@type String
		@private
		**/
		id: "session-page-",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@readonly
		@private
		**/
		pageName: "Sessão",


		/**
		Título da descrição

		@property descName 
		@type String
		@static
		@readonly
		@private
		**/
		descName: "Descrição",


		/**
		Título dos envolvidos

		@property speakersTitle 
		@type String
		@static
		@readonly
		@private
		**/
		speakersTitle: "Moderador",


		/**
		Id da tab de palestras que compõem a sessão

		@property papersTabId 
		@type String
		@static
		@readonly
		@private
		**/
		papersTabId: "papers-tab",


		/**
		Nome da tab de palestras

		@property id 
		@type String
		@static
		@readonly
		@private
		**/
		papersTabName: "Papers",


		/**
		Id's de evento dos papers da sessão

		@property eventIds
		@type Array
		@private
		**/
		eventIds: null,


		/**
		Eventos aos quais a página responde. Para além dos herdados pela EventView,
		há ainda o rendering da tab de palestras e o override da adição à agenda
		pessoal

		@property events
		@type Object
		@static
		@readonly
		@private
		**/
		events: function(){
			return _.extend({
				"click #add-remove-event" : "addRemoveEvents",
				"click #papers-tab"	: "renderPapersTab"
			}, EventView.prototype.events);
		},


		/**
		Carrega a informação da sessão com o id passado como parâmetro,
		e chama o construtor da superclasse.

		@constructor
		@param {Object} args Parâmetros da view
		@param {String} args.modelId ID da sessão a ser associada à view
		**/
		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			this.id += args.modelId;
			
			var self = this;

			this.model = new SessionModel({id: modelId});
			this.model.fetch().done(
				function () {
					EventView.prototype.initialize.apply(self);
				}
			);


		},


		/**
		Faz o rendering da tab 'Papers'

		@method renderQuestionsTab
		@chainable
		**/
		renderPapersTab: function () {

			console.log("papers tab");

			this.renderTab(this.papers);

			return this;
		},


		/**
		Faz o rendering do layout base das páginas de sessão e verifica
		se a agenda pessoal contém todos os eventos referentes a esta sessão,
		se não tiver remove o check que a view EventView adiciona, porque a 
		agenda contém um evento da sessão,se for o caso

		@method render
		**/
		render: function (){
			//Apenas para desfazer o check adicionado na view event, caso já tenha um dos papers na agenda

			//chamada do método render da superclasse
			EventView.prototype.render.apply(this);

			this.eventIds = this.model.arrayOfEventIds();

			var hasEvents = this.personalAgenda.hasEvents(this.eventIds);
			
			if(!hasEvents)
			{	
				$('#add-remove-event').next().remove();

			}
			else
				$('#add-remove-event').parent().append('<i id="check-event" class="icon-check-sign pull-right"></i>');

		},


		/**
		Inicializa as tabs 'Sobre', 'Papers' e 'Comentários' e adiciona-as ao vetor de tabs

		@method createTabs
		@protected
		**/
		createTabs: function (){

			this.createAboutTab();

			this.papers = new SessionPapersView({
				papers 			: this.model.get('papers')
			});
			this.addTab(this.papers,{id: this.papersTabId, name: this.papersTabName});

			this.createCommentsTab();

		},


		/**
		Adiciona ou remove os eventos da sessão à agenda pessoal, consoante estes estejam
		presentes na agenda pessoal. No caso de não ter todos os eventos da sessão
		na agenda pessoal, adicona os que faltam.

		@method addRemoveEvent
		**/
		addRemoveEvent: function (){
			if(App.account.isLogged())
            {
				var personalAgenda = this.personalAgenda;

				var hasEvents = personalAgenda.hasEvents(this.eventIds);

				if(hasEvents)
				{	
					_.each(this.eventIds, function(paperId){
						personalAgenda.removeEvent(paperId)
					});
					personalAgenda.save();
					personalAgenda.sendPersonalAgenda();
					$('#add-remove-event').next().remove();
				}
				else
				{
					_.each(this.eventIds, function(paperId){
						personalAgenda.addEvent(paperId)
					});
					personalAgenda.save();
					personalAgenda.sendPersonalAgenda();
	                $('#add-remove-event').parent().append('<i id="check-event" class="icon-check-sign pull-right"></i>');
				}
			}
			else
			{
                this.showErrorOverlay({text:App.MSG.REGISTRATION_NEEDED});
            }
		}
		


	});


});