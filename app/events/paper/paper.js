define("events/paper/paper",
[
    "jquery",
    "backbone",
    "../common/event",
    "app.config"
], 

function ($, Backbone, Event, App) {

	/**
    Modelo de uma palestra

    @class events.paper.Paper
    @alternateClassName Paper
    @extends Event
    **/
	return Event.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		**/
		url: App.URL + "papers/",


		/**
		Alteração do método sync para utilizar o localStorage como cache

		@property sync
		@type Function
		**/
		sync: Backbone.cachingSync(Backbone.sync, 'adcapp-paper'),


		/**
        Atributos predefinidos do modelo.

        @property defaults
        @type Object
        @static
        @readonly
        @private
        **/
		defaults: {

			name: null,
			hour:0,
			duration:0,
			is_scheduled: false,
			session_id: 0,
			local: null,
			ranking:null,
			speakers:null,
			description: "Sem descrição",
			themes: null,
			comments: null,
			questions: null

		},


		/**
        Construtor do modelo. Adiciona ao URL o id da instância.

        @constructor
        **/
		initialize: function (){
			this.url += this.id;
			this.type = window.app.TYPES.PAPER;
		},


		/**
		Submete um voto na questão com o id passado como parâmetro

		@method voteQuestion
		@param {Number} questionId Id da questão
		@param {Function} success Callback em caso de sucesso
		**/
		voteQuestion: function (questionId, success) {

			$.ajax({
                method: "POST",

                url: App.URL + "votes/",

                data: {               
                    vote: {
                        "votable_id"	: questionId,
                        "votable_type"	: App.TYPES.QUESTION
                    }
                },

                success: success
			});

		}




	});

});