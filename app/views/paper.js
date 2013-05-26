define([
    "jquery",
    "backbone",
    "handlebars",
    "models/paper",
    "views/basicview",
    "views/comment"
], function ($, Backbone, Handlebars, PaperModel, BasicView, CommentsView) {

	return BasicView.extend({

		el: "div[data-role=content]",

		id: "paper-page",
		pageName: "Palestra",

		template: "paper-template",
		aboutTabTemplate: "paper-about-tab-template",
		commentsTabTemplate: "comments-tab-template",

		paper: null,

		events: {

			"click #about-tab"		: "renderAboutTab",
			"click #comments-tab"	: "renderCommentsTab",
			"click #questions-tab"	: "renderQuestionsTab"

		},

		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			var self = this;

			this.paper = new PaperModel({id: modelId});
			this.paper.fetch({
				success: function () {
					self.renderLayout();
					self.setElement($("[data-role=content]"));
					self.render();
				}
			});



		},

		render: function () {
			var paper = this.paper.attributes;

			var context = {
				title : paper.name,
				datetime : paper.hour,
				room_name : paper.local.name,
				room_id : paper.local.id
			};

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			this.renderAboutTab();
			

			return this;

		},


		renderAboutTab: function () {
			console.log("about tab");

			var paper = this.paper.attributes;

			var context = {
				description : paper.description,
				speakers : paper.speakers
			};

			var html = this.compileTemplate(this.aboutTabTemplate, context);

			$("#tab-content").html(html);
			this.refreshJQM();

			return this;
		},



		renderCommentsTab: function () {

			console.log("comments tab");

			var paper = this.paper;
			var comments = this.paper.get('comments');

			if(this.questions)
				this.questions.undelegateEvents();


			this.comments = this.comments || new CommentsView({
													title: "Novo Comentário",
													comments: comments,
													model: paper,
													url: 'comments'
												});
			this.comments.delegateEvents();
			this.comments.render();


			this.refreshJQM();

			return this;
		},


		renderQuestionsTab: function () {

			console.log("questions tab");

			var paper = this.paper;
			var questions = this.paper.get('questions');

			if(this.comments)
				this.comments.undelegateEvents();

			this.questions = this.questions || new CommentsView({
												title: "Nova Pergunta",
												comments: questions,
												model: paper,
												url: 'questions'
											});
			this.questions.delegateEvents();
			this.questions.render();


			this.refreshJQM();

			return this;
		}


		


	});


});