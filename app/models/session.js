define([
    "jquery",
    "backbone",
    "views/basicview"
], 

function ($, Backbone, BasicView) {

	/**
    Modelo de uma sessão

    @class Session
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		@default "/sessions/"
		**/
		url: "http://adcapp.apiary.io/sessions/",


		/**
        Atributos predefinidos do modelo.

        @property defaults
        @type Object
        @static
        @final
        @private
        **/
		defaults: {

			name: null,
			hour:0,
			duration:0,
			is_scheduled: false,
			session_id: 0,
			local: null,
			speakers:null,
			papers: null,
			description: "Sem descrição",
			themes: null,
			comments: null

		},


		/**
        Construtor do modelo. Adiciona ao URL o id da instância.

        @constructor
        @protected
        @class Session
        **/
		initialize: function (){
			this.url += this.id;
		},


		/**
		Coloca todos os ids dos eventos da sessão num vetor

		@method arrayOfPaperIds
		@protected
		@return {Array} Vetor de inteiros com os ids das palestras da sessão
		**/
		arrayOfPaperIds: function(){
			return  _.map(this.get('papers'), function(paper){
				return paper.id;
			});
		},

		
		/**
		Submete um novo comentário na página do evento

		@method submitComment
		@protected
		@async
		@param {Object} options Configuração do comentário
			@param {String} options.url Onde o comentário deve ser colocado.
			@param {Integer} options.text Conteúdo do comentário.
			@param {Function()} options.success Função de callbak em caso de 
												sucesso.
		@example
			submitComment(	'comments',
							'Isto é um comentário',
							function () { 
								console.log("Comentário submetido");
							})
		**/
		submitComment: function (options){ //TODO: factorizar método

			var self = this;

			$.ajax({
				method: "POST",

				async: false,

				timeout: 5000,

				url: this.url + "/" + options.url,

				data: { "email":"toni@mail.com", "password": "123456", "content": options.text, 
						"id": this.id, type: 'Paper' },

				beforeSend: function () {
					$.mobile.loading( 'show', {
				            text: "A enviar",
				            textVisible: true
				    });
				},

				complete: function () {
					//override do ajaxsetup para nao fazer hide do load spinner
				},

				success: function () {
					$.mobile.loading( 'hide' );
					options.success();
				},

				error: function (){
					BasicView.prototype.showErrorOverlay({text: "Erro no envio"});
				}
			});


		}

	});

});