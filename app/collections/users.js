define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/listuser"
], 

function ($, Backbone, LocalStorage, listUser) {

	return Backbone.Collection.extend({

		model: listUser,

		url: "",

		//localStorage: new Backbone.LocalStorage('users-backbone'),

		initialize: function (args){

			if(args.isSpeakers)
				this.url = "http://danielmagro.apiary.io/speakers";
			else
				this.url = "http://danielmagro.apiary.io/participants";

			console.log('UserS');
		},
		comparator: function( user ) {
	      return user.get('name');
	    }


	});

});