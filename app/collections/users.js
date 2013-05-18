define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/user"
], 

function ($, Backbone, LocalStorage, User) {

	return Backbone.Collection.extend({

		model: User,

		url: "http://danielmagro.apiary.io/users",

		//localStorage: new Backbone.LocalStorage('users-backbone'),

		initialize: function (){
			console.log('UserS');
		},
		comparator: function( user ) {
	      return user.get('name');
	    }


	});

});