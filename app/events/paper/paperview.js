define("events/paper/paperview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "./paper",
    "../common/eventview",
    "../common/commentsview"
], function ($, Backbone, _, Handlebars, PaperModel, EventView, CommentsView) {

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
		há ainda o rendering da tab de perguntas e o voto nestas

		@property events
		@type Object
		@extends EventView.events
		@protected
		**/
		events: function(){
			return _.extend({
				"click #questions-tab"	: "renderQuestionsTab",
				"click .vote-question"	: "voteQuestion"
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
			this.model.fetch().done(
				function () {
					EventView.prototype.initialize.apply(self);
				}
			);
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
		Vota na questão correspondente.

		@method voteQuestion
		@protected
		@param {Event} Evento lançado quando se clicou no botão
		**/
		voteQuestion: function (e) {

            var $this = $(e.target);
            var id = $this.attr('question-id');

            window.x = $this;

            //se o utilizador já votou na questão, não é preciso reenviar o voto
            if($this.attr('user-voted') === "true")
            	return;

            var self = this;

            var success = function () {
            	$this.attr('user-voted', "true"); //assinala que a questão foi votada pelo utilizador

            	//muda o ícone do botão de voto
            	$(".like-button[question-id=\'" + id + "\']").html('<i class="icon-ok icon-2x"></i>');

            	//altera o número de votos
            	var numVotes = $this.find(".question-votes").html();
            	numVotes = parseInt(numVotes, 10);
            	$(".question-votes[question-id=\'" + id + "\']").html('+' + (numVotes + 1));

            	self.refreshJQM();
            };

            this.model.voteQuestion(id, success);
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