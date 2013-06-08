define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		localStorage: new Backbone.LocalStorage('account-backbone'),

		defaults: {

			alert_notifs: true,
			notif_timeout: 10,

			logged: false,
			publish_schedule: false

		},

		alertNotif: function () {
			return this.get('alert_notifs');
		},

		getNotifTimeout: function () {
			return this.get('notif_timeout');
		},

		isLogged: function () {
			return this.get('logged');
		}

	});

});