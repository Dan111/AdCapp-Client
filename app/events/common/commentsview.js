define("events/common/commentsview",
[
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview",
    "app.config",

    "text!../templates/comments.html",
    "text!../templates/_comment.html"
], function ($, Backbone, Handlebars, BasicView, App, CommentsTemplate, CommentPartialTemplate) {

	/**
	View da tab 'Comentários' presente nas páginas dos eventos

	@class CommentsView
	@extends BasicView
	**/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados as tabs

		@property el 
		@type String
		@static
		@final
		@default "#tab-content"
		**/
		el: "#tab-content",


		/**
		Id do elemento que contém a página, utilizado para o refresh dos
		componentes do jQuery Mobile

		@property id 
		@type String
		@static
		@final
		@default "tab-content"
		**/
		id: "tab-content",


		/**
		Template usado para gerar todos os comentários e o formulário
		de submissão de um novo comentário

		@property template 
		@type String
		@static
		@final
		@default "comments-tab-template"
		**/
		template: CommentsTemplate,


		/**
		Partial de um único comentário

		@property commentPartial
		@type String
		@static
		@final
		@default "comment-partial"
		**/
		commentPartial: CommentPartialTemplate,


		/**
		Event listeners dos botões do formulário de novos comentários

		@property events
		@type Object
		@static
		@final
		@private
		**/
		events: {
			"click #new-comment"	: "newComment",
			"click #cancel-comment"	: "cancelComment",
			"click #submit-comment"	: "submitComment"
		},


		/**
		Nome a ser usado no botão do formulário (por exemplo, Novo Comentário)

		@attribute title
		@type {String}
		@private
		@required
		**/


		/**
		Vetor com os comentários

		@attribute comments
		@type {String}
		@private
		@required
		**/


		/**
		Modelo do evento ao qual os comentários pertencem

		@attribute model
		@type {String}
		@private
		@required
		**/


		/**
		URI dos comentários, a partir do URL do modelo

		@attribute url
		@type {String}
		@private
		@required
		**/


		/**
		Inicializa os atributos da tab, tais como a lista de comentários ou o modelo
		ao qual estes pertencem.

		@constructor
		@class CommentsView
		@protected
		@param {Object} args Configuração da tab
			@param {String} args.title Nome a ser usado no botão do formulário (por exemplo, Novo Comentário)
			@param {String} args.comments Vetor com os comentários
			@param {String} args.model Modelo do evento ao qual os comentários pertencem
			@param {Array} args.url URI dos comentários, a partir do URL do modelo
		@example
			var args = {};

			args.title = 'Nova Pergunta';
			args.comments = paper.get('questions');
			args.model = paper; //modelo da classe Paper
			args.url = 'questions';

			var tab = new CommentsView(args);
		**/
		initialize: function (args) {

			this.title = args.title; //Nome a ser usado do botao do formulario (por exemplo, Novo Comentario)
			this.comments = args.comments; //vetor com todos os comentarios
			this.model = args.model; //modelo do evento ao qual os comentarios pertencem
			this.url = args.url; //uri dos comentarios, a partir do url do modelo
			
		},


		/**
		Faz o rendering da tab e guarda referências para os wrappers do jQuery de vários
		elementos do formulário de submissão de novos comentários

		@method render
		@protected
		@chainable
		**/
		render: function (){

			if(!this.el)
				this.setElement($("#tab-content"));

			var html = this.compileTextTemplate(this.template, {title: this.title,
															comments: this.model.get(this.url)});

			this.$el.html(html);

			this.$newComment = $("#new-comment");
			this.$input = $("#comment-input");
			this.$submit = $("#submit-comment");
			this.$cancel = $("#cancel-comment");
			this.$commentForm = $("#comment-form").hide();

			return this;
		},


		/**
		Função chamada quando se clica no botão de novo comentário, 
		fazendo aparecer o formulário de submissão de novos comentários

		@method newComment
		@protected
		**/
		newComment: function (){

			console.log("new comment clicked");

			//o botão está envolvido num div gerado pelo jQM
			this.$newComment.parent().hide();
			this.$commentForm.show();

		},


		/**
		Função chamada quando se clica no botão de cancelar um novo comentário, 
		escondendo o formulário de submissão de novos comentários

		@method cancelComment
		@protected
		**/
		cancelComment: function (){

			console.log("cancel clicked" + this.title);

			//o botão está envolvido num div gerado pelo jQM
			this.$newComment.parent().show();
			this.$commentForm.hide();

		},


		/**
		Função chamada quando se clica no botão de submissão de um novo comentário, 
		delegando o envio para o modelo passado no construtor.
		Adiciona o comentário à lista casoo envio seja bem sucedido

		@method submitComment
		@protected
		**/
		submitComment: function (){

			console.log("submit clicked");

			var self = this;

			var text = this.$input.val();
			this.model.submitComment({
				text: text, 

				url: this.url,

				success: function () {

					self.model.fetch();

					var newComment = self.compileTextTemplate(self.commentPartial, {author_name: App.account.getName(), 
																				content: text, new_comment: true});
					self.$("#comments").prepend(newComment);
					
					self.cancelComment();
					self.refreshJQM();

				}

			});

		},


		/**
		Remove a view e faz unbind de todos os eventos a ela associados

		@method close
		@protected
		@deprecated
		**/
		close: function (){
			this.remove();
			this.unbind();
		}

	});

});

