define("events/common/commentsview",
[
    "jquery",
    "backbone",
    "handlebars",
    "common/basicview",
    "app.config",

    "text!../templates/comments.html",
    "text!../templates/_comment.html"
], function ($, Backbone, Handlebars, BasicView, App, CommentsTemplate, CommentPartialTemplate) {

	/**
	View da tab 'Comentários' presente nas páginas dos eventos

	@class events.common.CommentsView
	@alternateClassName CommentsView
	@extends BasicView
	**/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados as tabs

		@property el 
		@type String
		@private
		**/
		el: "#tab-content",


		/**
		Id do elemento que contém a página, utilizado para o refresh dos
		componentes do jQuery Mobile

		@property id 
		@type String
		@static
		@readonly
		@private
		**/
		id: "tab-content",


		/**
		Template usado para gerar todos os comentários e o formulário
		de submissão de um novo comentário

		@property template 
		@type String
		@static
		@readonly
		@private
		**/
		template: CommentsTemplate,


		/**
		Partial de um único comentário

		@property commentPartial
		@type String
		@static
		@readonly
		@private
		**/
		commentPartial: CommentPartialTemplate,


		/**
		Event listeners dos botões do formulário de novos comentários

		@property events
		@type Object
		@static
		@readonly
		@private
		**/
		events: {
			"click #new-comment"	: "newComment",
			"click #cancel-comment"	: "cancelComment",
			"click #submit-comment"	: "submitComment"
		},


		/**
		Nome a ser usado no botão do formulário (por exemplo, Novo Comentário)

		@property title
		@type {String}
		@private
		**/
		title: null,


		/**
		Vetor com os comentários

		@property comments
		@type String
		@private
		**/
		comments: null,


		/**
		Modelo do evento ao qual os comentários pertencem

		@property model
		@type String
		@private
		**/
		model: null,


		/**
		URI dos comentários, a partir do URL do modelo

		@property url
		@type String
		@private
		**/
		url: null,


		/**
		Inicializa os atributos da tab, tais como a lista de comentários ou o modelo
		ao qual estes pertencem.

		@constructor
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
		@deprecated
		**/
		close: function (){
			this.remove();
			this.unbind();
		}

	});

});

