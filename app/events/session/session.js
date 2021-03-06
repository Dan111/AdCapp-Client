define("events/session/session",
[
    "jquery",
    "backbone",
    "../common/event",
    "app.config"
], 

function ($, Backbone, Event, App) {

	/**
    Modelo de uma sessão

    @class events.session.Session
    @alternateClassName Session
    @extends Backbone.Model
    **/
	return Event.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		**/
		url: App.URL + "sessions/",


		/**
		Alteração do método sync para utilizar o localStorage como cache

		@property sync
		@type Function
		**/
		sync: Backbone.cachingSync(Backbone.sync, 'adcapp-session'),


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
			speakers:null,
			papers: null,
			description: "Sem descrição",
			themes: null,
			comments: null

		},


		/**
        Construtor do modelo. Adiciona ao URL o id da instância.

        @constructor
        **/
		initialize: function (){
			this.url += this.id;
			this.type = window.app.TYPES.SESSION;
		},


		/**
		Coloca todos os ids dos eventos da sessão num vetor

		@method arrayOfEventIds
		@return {Array} Vetor de inteiros com os ids de evento das palestras da sessão
		**/
		arrayOfEventIds: function(){
			return  _.map(this.get('papers'), function(paper){
				return paper["event_id"];
			});
		}

	});

});