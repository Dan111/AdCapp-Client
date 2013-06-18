define("events/workshop/workshop",
[
    "jquery",
    "backbone",

    "../common/event",
    "app.config"
], 

function ($, Backbone, Event, App) {

	/**
    Modelo de um workshop

    @class Workshop
    @extends Event
    **/
	return Event.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		@default "/workshops/"
		**/
		url: App.URL + "workshops/",
		

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
        @class Workshop
        **/
		initialize: function (){
			this.url += this.id;
			this.type = window.app.TYPES.WORKSHOP;
		}

	});

});
