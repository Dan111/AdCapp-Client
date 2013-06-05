define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		defaults: {
			title: '',
			content: ''
		}

	});

});