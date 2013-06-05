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

		initialize: function (){
			//
		},