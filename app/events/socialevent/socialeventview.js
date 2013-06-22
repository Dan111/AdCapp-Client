define("events/socialevent/socialeventview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "./socialevent",
    "../common/eventview",
], function ($, Backbone, _, Handlebars, SocialEventModel, EventView) {

	/**
	View da página do evento social

	@class events.socialevent.SocialEventView
	@alternateClassName SocialEventView
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
		id: "social-page-",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@readonly
		@private
		**/
		pageName: "Evento Social",


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
		Título dos envolvidos. O evento social não tem este atributo.

		@property speakersTitle 
		@type String
		@private
		**/
		speakersTitle: null,


		/**
		Carrega a informação do evento social com o id passado como parâmetro,
		e chama o construtor da superclasse.

		@constructor
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
			this.model.fetch().done(
				function () {
					EventView.prototype.initialize.apply(self);
				}
			);


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