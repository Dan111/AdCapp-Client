define([
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview"
], function ($, Backbone, Handlebars, BasicView) {

	return BasicView.extend({

		el: "#tab-content", //para inserir os elementso na página
		id: "tab-content", //para fazer refresh do jqm


		template: 		"comments-tab-template",
		commentPartial: "comment-partial",

		events: {
			"click #new-comment"	: "newComment",
			"click #cancel-comment"	: "cancelComment",
			"click #submit-comment"	: "submitComment"
		},

		comments: null,

		initialize: function (args) {

			this.title = args.title;
			this.comments = args.comments;
			this.model = args.model;
			this.url = args.url;
			
		},

		render: function (){
			var html = this.compileTemplate(this.template, {title: this.title,
															comments: this.model.get(this.url)});

			this.$el.html(html);

			this.$newComment = $("#new-comment");
			this.$input = $("#comment-input");
			this.$submit = $("#submit-comment");
			this.$cancel = $("#cancel-comment");
			this.$commentForm = $("#comment-form").hide();

			return this;
		},

		newComment: function (){

			console.log("new comment clicked");

			//o botao esta envolvido num div gerado pelo jqm
			this.$newComment.parent().hide();
			this.$commentForm.show();

		},

		cancelComment: function (){

			console.log("cancel clicked" + this.title);

			//o botao esta envolvido num div gerado pelo jqm
			this.$newComment.parent().show();
			this.$commentForm.hide();

		},

		submitComment: function (){

			console.log("submit clicked");

			var text = this.$input.val();
			this.model.submitComment({text: text, url: this.url});
			this.model.fetch();

			var newComment = this.compileTemplate(this.commentPartial, {author_name: "ze manel", 
																		content: text, new_comment: true});
			this.$("#comments").prepend(newComment);
			
			this.cancelComment();
			this.refreshJQM();
			// $(".comment:first").css('background-color', 'transparent');

		},

		close: function (){
			this.remove();
			this.unbind();
		}

	});

});

