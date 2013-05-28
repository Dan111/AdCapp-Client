define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		idAttribute: 'user_id',

		defaults: {

			user_name: 'Unknown',
			user_id: -1,
			email: 'Unknown',
			image: 'None'

		},

		initialize: function (){
			//
		}

	});

});