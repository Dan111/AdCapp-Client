define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		url: "http://adcapp.apiary.io/notifications/",

		defaults: {
			title: '',
			content: ''
		},

		initialize: function () {
			this.url += this.id;
		}

	});

});