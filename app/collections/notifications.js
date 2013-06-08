define([
    "jquery",
    "backbone",
    "underscore",
    "models/notification",
    "storagewrapper"
], 

function ($, Backbone, _, Notification, StorageWrapper) {

	return Backbone.Collection.extend({

		model: Notification,

		url: "http://adcapp.apiary.io/notifications",

		readStorageID: 'notif-read',
		read: [],

		prevLengthStorageID: 'notif-prev-length',

		initialize: function () {
			//_.bindAll(this); //FUCK YOU!!!

			this.loadRead();

			this.listenTo(this, 'sync', this.newNotif);
		},

		loadRead: function () {

			var readJson = window.localStorage.getItem(this.readStorageID);
			var readArray = window.JSON.parse(readJson);

			readArray = readArray || [];
			this.read = readArray;
		},

		saveRead: function () {

			var readJson = window.JSON.stringify(this.read);
			window.localStorage.setItem(this.readStorageID, readJson);
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


			var prevLength = StorageWrapper.load(this.prevLengthStorageID, 0);
			var newNotifs = this.length - prevLength;
			StorageWrapper.save(this.prevLengthStorageID, this.length);

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

        	var notifHash = "#notifications";

        	if(window.location.hash === notifHash)
        		return;

        	navigator.notification.confirm(
		        message,
		        function (buttonIndex) {
		        	if(buttonIndex == 2) { //botão 'Ver'
		        		window.location.hash = notifHash;
		        	}
		        },
		        title,            
		        'Fechar,Ver'
    		);
        }


	});

});