define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/paper",
    "views/basicview",
    "views/comment",
    "views/aboutevent"
], function ($, Backbone, _, Handlebars, PaperModel, BasicView, CommentsView, AboutView) {

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
		template: "event-template",


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

		@property events
		@type Object
		@protected
		**/
		events: {

			"click #about-tab"		: "renderAboutTab",
			"click #comments-tab"	: "renderCommentsTab"

		},


		/**
		Construtor da classe abstracta. Inicializa os vectores e as views das 
		tabs, e faz o rendering da página

		@constructor
		@protected
		@class EventView
		**/
		initialize: function ()
		{
			_.bindAll(this);

			this.tabs = [];
			this.tabNames = [];

			this.renderLayout();
			this.setElement($("[data-role=content]"));

			this.createTabs();
			this.render();
			this.renderAboutTab();

		},


		/**
		Faz o rendering do layout base das páginas de informações

		@method render
		@protected
		@chainable
		**/
		render: function () {
			var model = this.model.attributes;

			var context = {
				title 		: model.name,
				datetime 	: model.hour,
				room_name 	: model.local.name,
				room_id 	: model.local.id,
				tabs 		: this.tabNames

			};

			var html = this.compileTemplate(this.template, context);

			this.$el.append(html);
			this.enhanceJQMComponentsAPI();

			this.$tabContent = $("#tab-content");

			//Coloca a tab 'Sobre' como a seleccionada por predefinição
			//TODO: arranjar uma solução mais elegante
			this.$("[data-role=navbar] a:first").addClass("ui-btn-active");
			
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
		Inicializa as tabs comuns a todas as páginas

		@method createTabs
		@protected
		**/
		createTabs: function (){

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
		}

	});

});