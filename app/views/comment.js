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

			this.title = args.title; //Nome a ser usado do botao do formulario (por exemplo, Novo Comentario)
			this.comments = args.comments; //vetor com todos os cmentarios
			this.model = args.model; //modelo do evento ao qual os comentarios pertencem
			this.url = args.url; //uri dos comentarios, a partir do url do modelo
			
		},

		render: function (){

			if(!this.el)
				this.setElement($("#tab-content"));

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

			var self = this;

			var text = this.$input.val();
			this.model.submitComment({
				text: text, 

				url: this.url,

				success: function () {

					self.model.fetch();

					var newComment = self.compileTemplate(self.commentPartial, {author_name: "ze manel", 
																				content: text, new_comment: true});
					self.$("#comments").prepend(newComment);
					
					self.cancelComment();
					self.refreshJQM();

				}

			});
			
			// $(".comment:first").css('background-color', 'transparent');

		},

		close: function (){
			this.remove();
			this.unbind();
		}

	});

});

