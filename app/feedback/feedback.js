define([
    "jquery",
    "backbone",
    "app.config",

    "backbone.cachingsync"
], 

function ($, Backbone, App) {

	/**
    Modelo de um keynote

    @class feedback.Feedback
    @alternateClassName Feedback
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@static
        @readonly
        @private
		**/
		url: App.URL + "feedbacks/",


		/**
		Alteração do método sync para utilizar o localStorage como cache

		@property sync
		@type Function
		**/
		sync: Backbone.cachingSync(Backbone.sync, 'adcapp-feedback'),
		

		/**
        Atributos predefinidos do modelo.

        @property defaults
        @type Object
        @static
        @readonly
        @private
        **/
		defaults: {

			forms: null //Vetor com objectos {name: "nome do form", link: "url do form"}
		}

	});

});
