define([
    "jquery",
    "backbone",

    "backbone.localStorage"
], 

function ($, Backbone) {

	/**
    Guarda as configurações da aplicação definidas pelo utilizador.

    @class Account
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        LocalStorage usado para guardar.

        @property localStorage
        @type Backbone.LocalStorage
        @static
        @final
        @default new Backbone.LocalStorage('contacts-backbone')
        **/
		localStorage: new Backbone.LocalStorage('account-backbone'),


		/**
        Atributos predefinidos do modelo .

        @property defaults
        @type Object
        @static
        @final
        @private
        **/
		defaults: {

			alert_notifs: true,
			notif_timeout: 15,

			logged: false,
			publish_schedule: false

		},


		/**
        Informa se o utilizador optou por receber alertas de novas notificações.

        @method alertNotif
        @return {Boolean} Retorna true se o utilizador ativou os alertas.
        **/
		alertNotif: function () {
			return this.get('alert_notifs');
		},


		/**
        Devolve de quanto em quanto tempo a aplicação deve verificar a 
        existência de novas notificações.

        @method getNotifTimeout
        @return {Number} Período de verificação.
        **/
		getNotifTimeout: function () {
			return this.get('notif_timeout');
		},


		/**
        Verifica se o utilizador registou o dispositivo com sucesso.

        @method isLogged
        @return {Boolean} Retorna true se o dispositivo foi registado com 
        					sucesso.
        **/
		isLogged: function () {
			return this.get('logged');
		}

	});

});