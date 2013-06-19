define("events/common/sessionpapersview",
[
    "jquery",
    "backbone",
    "handlebars",
    "common/basicview",

    "text!../templates/sessionpapers.html"
], function ($, Backbone, Handlebars, BasicView, SessionPapersTemplate) {

	/**
	View da tab 'Papers' presente na página de sessão

	@class SessionPapersView
	@extends BasicView
	**/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados as tabs

		@property el 
		@type String
		@static
		@final
		@default "#tab-content"
		**/
		el: "#tab-content",


		/**
		Id do elemento que contém a página, utilizado para o refresh dos
		componentes do jQuery Mobile

		@property id 
		@type String
		@static
		@final
		@default "tab-content"
		**/
		id: "tab-content",


		/**
		Template usado pela tab 'Papers'

		@property template 
		@type String
		@static
		@final
		@default "session-papers-tab-template"
		**/
		template: SessionPapersTemplate,


		/**
		Vetor com as informações dos papers

		@attribute papers
		@type {Array}
		@private
		@required
		@example
			[
			    {
			        "id": 1,
			        "name": "Data Management"
			    },
			    {
			        "id": 2,
			        "name": "Data Warehousing"
			    }
			]
		**/


		/**
		Inicializa o vetor com as informações das palestras da sessão.

		@constructor
		@class SessionPapersView
		@protected
		@param {Object} args Configuração da tab
			@param {Array} args.papers Vetor com as informações dos papers
		**/
		initialize: function (args) {
			this.papers = args.papers;
		},


		/**
		Faz o rendering da tab 'Papers'

		@method render
		@protected
		@chainable
		**/
		render: function () {

			if(!this.el)
				this.setElement($("#tab-content"));

			var context = {
				papers 		: this.papers
			};

			var html = this.compileTextTemplate(this.template, context);

			this.$el.html(html);

			return this;

		}

	});

});