define("events/keynote/keynoteview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "./keynote",
    "../common/eventview"
], function ($, Backbone, _, Handlebars, KeynoteModel, EventView) {

	/**
	View da página de keynote

	@class KeynoteView
	@extends EventView
	**/
	return EventView.extend({

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
		@default "keynote-page"
		**/
		id: "keynote-page-",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Keynote"
		**/
		pageName: "Keynote",


		/**
		Título da descrição

		@property descName 
		@type String
		@static
		@final
		@default "Descrição"
		**/
		descName: "Descrição",


		/**
		Título dos envolvidos

		@property speakersTitle 
		@type String
		@static
		@final
		@default "Orador"
		**/
		speakersTitle: "Orador",


		/**
		Carrega a informação do keynote com o id passado como parâmetro,
		e chama o construtor da superclasse.

		@constructor
		@class KeynoteView
		@param {Object} args Parâmetros da view
			@param {String} args.modelId ID do keynote a ser associado à view
		**/
		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			this.id += args.modelId;
			
			var self = this;

			this.model = new KeynoteModel({id: modelId});
			this.model.fetch({
				success: function () {
					EventView.prototype.initialize.apply(self);
				}
			});


		},


		/**
		Inicializa as tabs 'Sobre' e 'Comentários' e adiciona-as ao vetor de tabs

		@method createTabs
		@protected
		**/
		createTabs: function (){

			this.createAboutTab();
			this.createCommentsTab();

		},
		


	});


});