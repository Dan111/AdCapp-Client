define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "models/socialevent",
    "views/event",
    "views/aboutevent"
], function ($, Backbone, _, Handlebars, SocialEventModel, EventView, CommentsView, AboutView) {

	/**
	View da página do evento social

	@class SocialEventView
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
		@default "social-page"
		**/
		id: "social-page-",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Evento Social"
		**/
		pageName: "Evento Social",


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
		Título dos envolvidos. O evento social não tem este atributo.

		@property speakersTitle 
		@type String
		@static
		@final
		@default null
		**/
		speakersTitle: null,


		/**
		Carrega a informação do evento social com o id passado como parâmetro,
		e chama o construtor da superclasse.

		@constructor
		@class SocialEventView
		@param {Object} args Parâmetros da view
			@param {String} args.modelId ID do evento social a ser associado à view
		**/
		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			this.id += args.modelId;
			
			var self = this;

			this.model = new SocialEventModel({id: modelId});
			this.model.fetch({
				success: function () {
					EventView.prototype.initialize.apply(self);
				}
			});


		},


		/**
		Inicializa as tabs 'Sobre' e adiciona-a ao vetor de tabs

		@method createTabs
		@protected
		**/
		createTabs: function (){

			this.createAboutTab();

		}
		


	});


});