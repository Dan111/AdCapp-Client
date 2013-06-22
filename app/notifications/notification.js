define([
    "jquery",
    "backbone",

    "backbone.cachingsync"
], 

function ($, Backbone) {

	/**
    Modelo de uma notificação

    @class notifications.Notification
    @alternateClassName Notification
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		**/
		url: window.app.URL + "notifications/",


		/**
		Alteração do método sync para utilizar o localStorage como cache

		@property sync
		@type Function
		**/
		sync: Backbone.cachingSync(Backbone.sync, 'adcapp-notification'),


		/**
        Atributos predefinidos do modelo.

        @property defaults
        @type Object
        @static
        @readonly
        @private
        **/
		defaults: {
			title: '',
			content: ''
		},


		/**
        Construtor do modelo. Adiciona ao URL o id da instância.

        @constructor
        **/
		initialize: function () {
			this.url += this.id;
		}

	});

});