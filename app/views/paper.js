define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/paper",
    "views/event",
    "views/comment",
    "views/aboutevent"
], function ($, Backbone, _, Handlebars, PaperModel, EventView, CommentsView, AboutView) {

	/**
	View da página de palestra

	@class PaperView
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
		@default "paper-page"
		**/
		id: "paper-page-",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Palestra"
		**/
		pageName: "Palestra",


		/**
		Título da descrição

		@property descName 
		@type String
		@static
		@final
		@default "Abstract"
		**/
		descName: "Abstract",


		/**
		Título dos envolvidos

		@property speakersTitle 
		@type String
		@static
		@final
		@default "Autores"
		**/
		speakersTitle: "Autores",


		/**
		Id da tab de perguntas

		@property questionsTabId 
		@type String
		@static
		@final
		@default "questions-tab"
		**/
		questionsTabId: "questions-tab",


		/**
		Nome da tab de perguntas

		@property questionsTabName 
		@type String
		@static
		@final
		@default "Perguntas"
		**/
		questionsTabName: "Perguntas",


		/**
		Eventos aos quais a página responde. Para além dos herdados pela EventView,
		há ainda o rendering da tab de perguntas

		@property events
		@type Object
		@extends EventView.events
		@protected
		**/
		events: function(){
			return _.extend({
				"click #questions-tab"	: "renderQuestionsTab"
			}, EventView.prototype.events);
		},


		/**
		Carrega a informação da palestra com o id passado como parâmetro,
		e chama o construtor da superclasse.

		@constructor
		@class PaperView
		@param {Object} args Parâmetros da view
			@param {String} args.modelId ID da palestra a ser associada à view
		**/
		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			this.id += args.modelId;

			var self = this;

			this.model = new PaperModel({id: modelId});
			this.model.fetch({
				success: function () {
					EventView.prototype.initialize.apply(self);
				}
			});
		},


		/**
		Faz o rendering da tab 'Perguntas'

		@method renderQuestionsTab
		@protected
		@chainable
		**/
		renderQuestionsTab: function () {

			console.log("papers tab");

			this.renderTab(this.questions);

			return this;
		},


		/**
		Inicializa as tabs 'Sobre', 'Comentários' e 'Perguntas' e adiciona-as ao vetor de tabs

		@method createTabs
		@protected
		**/
		createTabs: function (){

			this.createAboutTab();
			this.createCommentsTab();

			var paper = this.model;
			var questions = paper.get('questions');

			this.questions = new CommentsView({
				title 		: "Nova Pergunta",
				comments 	: questions,
				model 		: paper,
				url 		: 'questions'
			});
			this.addTab(this.questions, {id: this.questionsTabId, name: this.questionsTabName});

		}

	});

});