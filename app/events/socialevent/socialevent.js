define("events/socialevent/socialevent",
[
    "jquery",
    "backbone",
    "../common/event",
    "app.config"
], 

function ($, Backbone, Event, App) {

	/**
    Modelo de um evento social

    @class events.socialevent.SocialEvent
    @alternateClassName SocialEvent
    @extends Event
    **/
	return Event.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		**/
		url: App.URL + "social_events/",


		/**
		Alteração do método sync para utilizar o localStorage como cache

		@property sync
		@type Function
		**/
		sync: Backbone.cachingSync(Backbone.sync, 'adcapp-social-event'),
		

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
			local: null,
			social_type: null,
			description: "Sem descrição"
		},


		/**
        Construtor do modelo. Adiciona ao URL o id da instância.

        @constructor
        **/
		initialize: function (){
			this.url += this.id;
			this.type = window.app.TYPES.SOCIAL;
		}

	});

});
