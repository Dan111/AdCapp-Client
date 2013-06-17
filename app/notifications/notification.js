define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	/**
    Modelo de uma notificação

    @class Notification
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		@default "/notifications/"
		**/
		url: "http://adcapp.apiary.io/notifications/",


		/**
        Atributos predefinidos do modelo.

        @property defaults
        @type Object
        @static
        @final
        @private
        **/
		defaults: {
			title: '',
			content: ''
		},


		/**
        Construtor do modelo. Adiciona ao URL o id da instância.

        @constructor
        @protected
        @class Notification
        **/
		initialize: function () {
			this.url += this.id;
		}

	});

});