define("events/common/abouteventview",
[
    "jquery",
    "backbone",
    "handlebars",

    "views/basicview",
    "text!../templates/aboutevent.html"
], function ($, Backbone, Handlebars, BasicView, AboutEventTemplate) {

	/**
	View da tab 'Sobre' presente nas páginas dos eventos

	@class AboutEventView
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
		Template usado pela tab 'Sobre'

		@property template 
		@type String
		@static
		@final
		@default "event-about-tab-template"
		**/
		template: AboutEventTemplate,


		/**
		Título da descrição ('Abstract', 'Sobre', 'Resumo', ...)

		@attribute descName
		@type {String}
		@private
		@required
		**/


		/**
		Conteúdo da descrição

		@attribute description
		@type {String}
		@private
		@required
		**/


		/**
		Título dos envolvidos ('Autor', 'Professor', 'Tutor', 'Orador', 'Anfitrião', ...)

		@attribute speakersTitle
		@type {String}
		@private
		@required
		**/


		/**
		Vetor com as informações dos oradores

		@attribute speakers
		@type {Array}
		@private
		@required
		@example
			[
				{
					id: 1,
					name: "António Mendes",
					institution: "FCT",
					area: "Software Architecture",
					image: "http://example.com/avatar.jpg"
				}
			]
		**/


		/**
		Inicializa os atributos da tab, tais como o conteúdo da descrição ou
		o título dos envolvidos (se é autor, ou tutor, ou orador, etc).

		@constructor
		@class AboutEventView
		@protected
		@param {Object} args Configuração da tab
			@param {String} args.descName Título da descrição ('Abstract', 'Sobre', 'Resumo', ...)
			@param {String} args.description Conteúdo da descrição
			@param {String} args.speakersTitle Título dos envolvidos ('Autor', 'Professor', 
												'Tutor', 'Orador', 'Anfitrião', ...)
			@param {Array} args.speakers Vetor com as informações dos oradores
		@example
			var args = {};

			args.descName = 'Abstract';
			args.description = 'Isto é um abstract';

			args.speakersTitle = 'Autores';
			args.speakers = [
				{
					id: 1,
					name: "António Mendes",
					institution: "FCT",
					area: "Software Architecture",
					image: "http://example.com/avatar.jpg"
				}
			];

			var tab = new AboutEventView(args);
		**/
		initialize: function (args) {

			//nome a ser dado à descrição (por exemplo, 'Abstract')
			this.descName = args.descName; 
			this.description = args.description;

			//nome a ser dado aos oradores (por exemplo, 'Autores', 'Moderador', 'Tutores')
			this.speakersTitle = args.speakersTitle; 
			this.speakers = args.speakers;

		},


		/**
		Faz o rendering da tab 'Sobre'

		@method render
		@protected
		@chainable
		**/
		render: function () {

			if(!this.el)
				this.setElement($("#tab-content"));

			var context = {
				descName		: this.descName,
				description 	: this.description,

				speakersTitle	: this.speakersTitle,
				speakers 		: this.speakers
			};

			var html = this.compileTextTemplate(this.template, context);

			this.$el.html(html);

			return this;

		}

	});

});