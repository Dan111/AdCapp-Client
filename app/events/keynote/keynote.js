define("events/keynote/keynote",
[
    "jquery",
    "backbone",
    "../common/event",
    "app.config"
], 

function ($, Backbone, Event, App) {

	/**
    Modelo de um keynote

    @class events.keynote.Keynote
    @alternateClassName Keynote
    @extends Event
    **/
	return Event.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		**/
		url: App.URL + "keynotes/",


		/**
		Alteração do método sync para utilizar o localStorage como cache

		@property sync
		@type Function
		**/
		sync: Backbone.cachingSync(Backbone.sync, 'adcapp-keynote'),
		

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
			speakers:null,
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
			this.type = window.app.TYPES.KEYNOTE;
		}

	});

});
