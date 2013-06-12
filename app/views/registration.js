define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "views/basicview",
    "app.config"
], function ($, Backbone, _, Handlebars, BasicView, App) {

	/**
	Página de registo do dispositivo

	@class RegistrationView
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
        ID usado pelo div que contém a página

        @property id 
        @type String
        @static
        @final
        @default "notification-page"
        **/
        id: "registration-page",


        /**
        Nome da página, apresentado no header

        @property pageName 
        @type String
        @static
        @final
        @default "Notificações"
        **/
        pageName: "Registo",


		/**
		Template base de todas as páginas de informação

		@property template 
		@type String
		@final
		@protected
		@default "event-template"
		**/
		template: "registration-template",



		/**
		Listeners dos botões do formulário de registo

		@property events
		@type Object
		@protected
		**/
		events: {

		},


		/**
		Construtor da classe abstracta.

		@constructor
		@protected
		@class RegistrationView
		**/
		initialize: function ()
		{
			_.bindAll(this);

			this.account = App.account;

			
			console.log("event binding");

			// $(document).on("onresize", function () {
			// 	console.log("event triggered");
			// 	$('#popupMenu').popup('reposition', {positionTo: "window"});
			// });

			// $(document).on("pageinit", function () {
			// 	console.log("event triggered 2");
				
			// });


			this.renderLayout();
			this.setElement($("[data-role=content]"));
			this.render();

			$('#popupMenu').popup('open', { positionTo: "window" });

			//$(document).trigger("onresize");
		},


		/**
		Faz o rendering do layout base das páginas de informações

		@method render
		@protected
		@chainable
		**/
		render: function () {

			var html = this.compileTemplate(this.template, null);

			this.$el.append(html);
			this.enhanceJQMComponentsAPI();
			
			return this;
		}


	});


});