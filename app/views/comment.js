define([
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview"
], function ($, Backbone, Handlebars, BasicView) {

	return Backbone.View.extend({

		el: "#tab-content",

		template: "comments-tab-template",

		events: {
			"click #new-comment"	: "newComment",
			"click #cancel-comment"	: "cancelComment",
			"click #submit-comment"	: "submitComment"
		},

		comments: null,

		initialize: function (args) {

			this.args = args;
			this.render();

			this.$newComment = $("#new-comment");
			this.$input = $("#comment-input");
			this.$submit = $("#submit-comment");
			this.$cancel = $("#cancel-comment");
			this.$commentForm = $("#comment-form").hide();

		},

		render: function (){
			var html = this.compileTemplate(this.template, this.args);

			this.$el.html(html);

			return this;
		},

		compileTemplate: function (templateName, context) {

			var source   = $("#" + templateName).html();
			var template = Handlebars.compile(source);
			var html = template(context);

			return html;

		},

		newComment: function (){

			console.log("comment clicked");

			//o botao esta envolvido num div gerado pelo jqm
			this.$newComment.parent().hide();
			this.$commentForm.show();

		},

		cancelComment: function (){

			console.log("cancel clicked");

			//o botao esta envolvido num div gerado pelo jqm
			this.$newComment.parent().show();
			this.$commentForm.hide();

		},

		submitComment: function (){

			console.log("submit clicked");

			var text = this.$input.val();

			$.ajax({
				method: "POST",

				async: false,

				url: "http://adcapp.apiary.io/papers/1/comments",

				data: { "username":"ze", "password": "secret", "content": text },

				beforeSend: function() {
					$.mobile.loading( 'show', {
				            text: "A enviar",
				            textVisible: true
				    });
				},

				complete: function() {
					$.mobile.loading( 'hide' );
				}
			});

			this.cancelComment();

		}

	});

});

