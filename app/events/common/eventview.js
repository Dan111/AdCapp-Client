define("events/common/eventview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "models/personalagenda",

    "views/basicview",
    "./commentsview",
    "./abouteventview",

    "text!../templates/event.html",
    "app.config"
], function ($, Backbone, _, Handlebars, PersonalAgenda, BasicView, CommentsView, AboutView, EventTemplate, App) {

	/**
	View abstracta das páginas de informações de cada evento

	@class EventView
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
		Elemento que contém os conteúdos das tabs

		@property tabContainer 
		@type String
		@final
		@protected
		@default "#tab-content"
		**/
		tabContainer: "#tab-content",


		/**
		Template base de todas as páginas de informação

		@property template 
		@type String
		@final
		@protected
		@default "event-template"
		**/
		template: EventTemplate,


		/**
		Id usado pelo elemento HTML da tab 'Sobre'

		@property aboutTabId 
		@type String
		@final
		@protected
		@default "about-tab"
		**/
		aboutTabId: "about-tab",

		/**
		Nome a ser inserido na tab 'Sobre'

		@property aboutTabName 
		@type String
		@final
		@protected
		@default "Sobre"
		**/
		aboutTabName: "Sobre",


		/**
		Id usado pelo elemento HTML da tab 'Comentários'

		@property commentsTabId 
		@type String
		@final
		@protected
		@default "comments-tab"
		**/
		commentsTabId: "comments-tab",

		/**
		Nome a ser inserido na tab 'Comentários'

		@property commentsTabName 
		@type String
		@final
		@protected
		@default "Comentários"
		**/
		commentsTabName: "Comentários",

		/**
		Modelo do evento ao qual corresponde esta página

		@property model 
		@type Backbone.Model
		@final
		@protected
		@default null
		**/
		model: null,

		/**
		Vector com as views de todas as tabs incluídas na página

		@property tabs 
		@type Array
		@private
		@default null
		**/
		tabs: null,

		/**
		Vector de objectos com os campos id e name. Usado para gerar a navbar.

		@property tabNames 
		@type Array
		@private
		@default null
		@example
			[
				{
					id 		: "questions-tab",
					name 	: "Perguntas"
				}
			]
		**/
		tabNames: null,


		/**
		Eventos lançados pela transição entre tabs
		e ainda eventos de adição e remoção do evento 
		da agenda pessoal

		@property events
		@type Object
		@protected
		**/
		events: {

			"click #about-tab"			: "renderAboutTab",
			"click #comments-tab"		: "renderCommentsTab",
			"click #add-remove-event" 	: "addRemoveEvent"

		},


		/**
		Ícone apresentado quando o utilizador tem o evento na agenda pessoal

		@property checkIcon 
		@type String
		@private
		@default '<i id="check-event" class="icon-check-sign pull-right"></i>'
		**/
		checkIcon: '<i id="check-event" class="icon-check-sign pull-right"></i>',


		/**
		Construtor da classe abstracta. Inicializa os vectores e as views das 
		tabs, faz fetch da agenda pessoal e faz o rendering da página

		@constructor
		@protected
		@class EventView
		**/
		initialize: function ()
		{
			_.bindAll(this);

			this.tabs = [];
			this.tabNames = [];
			if(App.account.isLogged())
            {

    			this.personalAgenda = new PersonalAgenda({id: App.account.getUserId(), Personal: true});

    			this.personalAgenda.fetch({
    				success: function () {
    					console.log("Personal Events loaded");
    				},
    				error: function (){
    					console.log("Fail to get events or don't have any");
    				}
    			});
            }
            else
		      this.personalAgenda = new PersonalAgenda({id: 0, Personal: true});

			this.renderLayout();
			this.setElement($("[data-role=content]"));

			this.createTabs();
			this.render();
			this.renderAboutTab();

		},


		/**
		Devolve o contexto a ser usado no rendering

		@method getContext
		@protected
		@return {Object} Contexto do rendering
		**/
		getContext: function () {
			var model = this.model.attributes;

			var context = {
				title 		: model.name,
				datetime 	: model.hour,
				room_name 	: model.local.name,
				room_id 	: model.local.id,
				tabs 		: this.tabNames

			};

			return context;
		},


		/**
		Faz o rendering do layout base das páginas de informações

		@method render
		@protected
		@chainable
		**/
		render: function () {

			var context = this.getContext();
			var html = this.compileTextTemplate(this.template, context);

			this.$el.append(html);
			this.enhanceJQMComponentsAPI();

			this.$tabContent = $("#tab-content");

			//Coloca a tab 'Sobre' como a seleccionada por predefinição
			//TODO: arranjar uma solução mais elegante
			this.$("[data-role=navbar] a:first").addClass("ui-btn-active");

			if(this.personalAgenda.hasEvent(this.model.get("event_id")))
                $('#add-remove-event').parent().append(this.checkIcon);
			
			return this;

		},


		/**
		Faz o rendering da tab 'Sobre'

		@method renderAboutTab
		@protected
		@chainable
		**/
		renderAboutTab: function () {

			console.log("about tab");

			this.renderTab(this.about);

			return this;
		},


		/**
		Faz o rendering da tab 'Comentários'

		@method renderCommentsTab
		@protected
		@chainable
		**/
		renderCommentsTab: function () {

			console.log("comments tab");

			this.renderTab(this.comments);

			return this;
		},


		/**
		Inicializa as tabs comuns a todas as páginas.
		As subclasses devem fazer override dete método e definir que
		tabs a página deve ter.

		@method createTabs
		@protected
		**/
		createTabs: function (){
			//Fazer override nas subclasses
		},


		/**
		Cria a tab 'Sobre' e adiciona-a ao vetor de tabs

		@method createAboutTab
		@protected
		**/
		createAboutTab: function () {

			this.about = new AboutView({
				descName		: this.descName,
				description 	: this.model.get('description'),

				speakersTitle	: this.speakersTitle,
				speakers 		: this.model.get('speakers')
			});
			this.addTab(this.about,{id: this.aboutTabId, name: this.aboutTabName});

		},


		/**
		Cria a tab 'Comentários' e adiciona-a ao vetor de tabs

		@method createCommentsTab
		@protected
		**/
		createCommentsTab: function () {

			var model = this.model;
			var comments = this.model.get('comments');

			this.comments = new CommentsView({
				title 		: "Novo Comentário",
				comments 	: comments,
				model 		: model,
				url			: 'comments'
			});
			this.addTab(this.comments, {id: this.commentsTabId, name: this.commentsTabName});

		},


		/**
		Adiciona uma tab ao vector de tabs

		@method addTab
		@protected
		@param {BasicView} view View da tab
		@param {Object} name Id e nome da tab
			@param {String} name.id Id da tab
			@param {String} name.name Nome a ser apresentado pela tab
		@param {pos} [pos=length do vector tabs] Posição que a tab deve ocupar na navbar
		**/
		addTab: function (view, name, pos) { //TODO: colocar o pos a funcionar

			var index = pos;

			if(index == null)
				index = this.tabs.length;


			this.tabs[index] = view;
			this.tabNames[index] = name;

		},


		/**
		Faz o rendering da tab especificada

		@method renderTab
		@protected
		@param {BasicView} view View da tab
		@chainable
		**/
		renderTab: function (view) {

			this.disableTabEvents();

			view.delegateEvents();
			view.render();

			this.refreshJQM();

			return this;
		},


		/**
		Desactiva a delegação de eventos de todas as tabs, evitando assim
		tratar várias vezes o mesmo evento, por várias tabs distintas.

		@method disableTabEvents
		@private
		**/
		disableTabEvents: function () {

			_.each(this.tabs, function (view){
				view.undelegateEvents();
			})
		},

		/**
		Adiciona ou remove o evento à agenda pessoal, consoante este esteja
		presente na agenda pessoal

		@method addRemoveEvent
		@protected
		**/
		addRemoveEvent: function () {
			var model = this.model.attributes;
			if(App.account.isLogged())
            {
				var hasEvent = this.personalAgenda.hasEvent(model.event_id);

				if(hasEvent)
				{
					//retira o evento da agenda pessoal
	                this.personalAgenda.removeEvent(model.event_id);
	                this.personalAgenda.save();
	                this.personalAgenda.sendPersonalAgenda();
	                $('#add-remove-event').next().remove();
				}
				else
				{
					 
	            	this.personalAgenda.addEvent(model.event_id);
	            	this.personalAgenda.save();
	            	this.personalAgenda.sendPersonalAgenda();
	                $('#add-remove-event').parent().append(this.checkIcon);
				}
			}
			else
			{
                this.showErrorOverlay({text:"Por favor registe-se nas opções"});
            }
		}

	});

});