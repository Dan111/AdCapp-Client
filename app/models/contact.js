define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		

		defaults: {

			user_name: 'Unknown',
			user_id: -1,
			email: 'Unknown',
			image: 'None'

		},

		initialize: function (){
			console.log('Contact created');
		}

	});

});