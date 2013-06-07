define([
    "jquery",
    "backbone",
    "underscore",
    "models/notification"
], 

function ($, Backbone, _, Notification) {

	return Backbone.Collection.extend({

		model: Notification,

		url: "http://adcapp.apiary.io/notifications",

		LocalStorageId: 'notif-read',
		read: null,
		prevLength: 0,

		initialize: function () {
			_.bindAll(this);

			this.loadRead();

			this.listenTo(this, 'sync', this.newNotif);
		},

		loadRead: function () {

			console.log("read loaded");

			var readJson = localStorage.getItem(this.LocalStorageId);
			var readArray = JSON.parse(readJson);

			readArray = readArray || [];
			this.read = readArray;
		},

		saveRead: function () {

			console.log("read saved");

			var readJson = JSON.stringify(this.read);
			localStorage.setItem(this.LocalStorageId, readJson);
		},


		markAsRead: function (notifId) {
			this.read = _.union(this.read, parseInt(notifId, 10));
			this.saveRead();
		},


		isRead: function (notifId) {
			return _.contains(this.read, parseInt(notifId, 10));
		},


		newNotif: function (collection, resp, options) {

			var show = window.app.account.alertNotif();
			var newNotifs = this.length - this.read.length;

			if(show && newNotifs > 0)
			{
				var message = "";

            	if(newNotifs == 1)
            		message = "Tem uma notificação não lida.";
            	else
            		message = "Tem " + newNotifs + " notificações não lidas.";

            	this.showDeviceNotification("Notificações", message);
            }
        },


        showDeviceNotification: function (title, message) { //TODO: colocar num sítio mais apropriado

        	navigator.notification.confirm(
		        message,
		        function (buttonIndex) {
		        	if(buttonIndex == 2) { //botão 'Ver'
		        		window.location.hash = "#notifications";
		        	}
		        },
		        title,            
		        ['Fechar','Ver']              
    		);


        }

	});

});