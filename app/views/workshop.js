define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "models/workshop",
    "views/event",
], function ($, Backbone, _, Handlebars, WorkshopModel, EventView) {

	/**
	View da página de workshop

	@class WorkshopView
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
		@default "workshop-page"
		**/
		id: "workshop-page-",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Workshop"
		**/
		pageName: "Workshop",


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
		@default "Tutores"
		**/
		speakersTitle: "Tutores",


		/**
		Carrega a informação do workshop com o id passado como parâmetro,
		e chama o construtor da superclasse.

		@constructor
		@class WorkshopView
		@param {Object} args Parâmetros da view
			@param {String} args.modelId ID da sessão a ser associada à view
		**/
		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			this.id += args.modelId;
			
			var self = this;

			this.model = new WorkshopModel({id: modelId});
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