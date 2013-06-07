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

		initialize: function (){
			_.bindAll(this);

			this.loadRead();
		},

		loadRead: function (){
			var read = localStorage.getItem(this.LocalStorageId);
			read = read || [];
			this.read = read;
		}

	});

});