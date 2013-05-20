define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/contact"
], 

function ($, Backbone, LocalStorage, Contact) {

	return Backbone.Collection.extend({

		model: Contact,

		localStorage: new Backbone.LocalStorage('contacts-backbone'),

		defaults: { a: 1 },

		initialize: function (){
			console.log('ContactS');
		},
		comparator: function( contact ) {
	      return contact.get('order');
	    },
	    //Verifica se o contacto esta na collection
	    hasContact: function(id){
            
            return  this.find( function(user_m){ return user_m.get("user_id") === id; });
        }


	});

});