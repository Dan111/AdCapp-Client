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

    @class Keynote
    @extends Event
    **/
	return Event.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		@default "/keynotes/"
		**/
		url: App.URL + "keynotes/",
		

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
			local: null,
			speakers:null,
			description: "Sem descrição",
			themes: null,
			comments: null
		},


		/**
        Construtor do modelo. Adiciona ao URL o id da instância.

        @constructor
        @protected
        @class Keynote
        **/
		initialize: function (){
			this.url += this.id;
			this.type = window.app.TYPES.KEYNOTE;
		}

	});

});
