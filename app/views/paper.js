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

		el 				: "div[data-role=content]",

		id 				: "paper-page",
		pageName		: "Palestra",

		descName		: "Abstract",
		speakersTitle	: "Autores",

		questionsTabId 	: "questions-tab",
		questionsTabName: "Perguntas",

		events: function(){

			return _.extend({
				"click #questions-tab"	: "renderQuestionsTab"
			}, EventView.prototype.events);
		},


		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			var self = this;

			this.model = new PaperModel({id: modelId});
			this.model.fetch({
				success: function () {
					EventView.prototype.initialize.apply(self);
				}
			});
		},

		renderQuestionsTab: function () {

			console.log("papers tab");

			this.renderTab(this.questions);

			return this;
		},



		createTabs: function (){

			this.about = new AboutView({
				descName		: this.descName,
				description 	: this.model.get('description'),

				speakersTitle	: this.speakersTitle,
				speakers 		: this.model.get('speakers')
			});
			this.addTab(this.about,{id: this.aboutTabId, name: this.aboutTabName});

			//chamada do método createTabs da superclasse
			EventView.prototype.createTabs.apply(this);

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