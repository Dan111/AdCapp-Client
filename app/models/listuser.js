define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		//url: "http://danielmagro.apiary.io/users/",

		defaults: {
			id: 0,
    		name: null, 
    		institution: null, 
    		area: null, 
    		image: "None"

		},

		initialize: function (){

		}

	});

});

