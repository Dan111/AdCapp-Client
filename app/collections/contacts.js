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


		initialize: function (){
			//
		},


		comparator: function ( contact ) {
	      return contact.get('order');
	    },


	    //Verifica se o contacto esta na collection
	    hasContact: function (id){
            return  this.find( function(user){ return user.get("user_id") === id; });
        },


        exportContacts: function (){

        	console.log("exporting");
        	var numExports = 0;

        	this.each(function (contact){

        		this.createPhoneContact(contact);
        		numExports++;

        	}, this);

        	console.log(numExports);

        	return numExports;

        },


        hasPhoneContact: function (contact){ //TODO: Sincronizar adição com find

        	var email = contact.get('email');
        	var results = [];

        	var options = new ContactFindOptions();
			options.filter = email;
			options.multiple = false;

			var success = function (contacts){ 
				console.log( contacts ); 

				results = contacts;
				console.log(results);
			}

			var error = function (){
				console.log("contact search error");
			}

			navigator.contacts.find(["emails", "displayName"], success, error, options);

			return results.length !== 0;

        },


        createPhoneContact: function (contact){

        	var phoneContact = navigator.contacts.create();

			phoneContact.displayName = contact.get('user_name');
			phoneContact.emails = [new ContactField('work', contact.get('email'), false)];
			// phoneContact.note = "AdCapp";

			// var org = new ContactOrganization(false, '', 'FCT', 'IA', '');
			// phoneContact.organizations = [org];


			var success = function (contacts){ 
				console.log("contact created"); 
			}

			var error = function (){
				console.log("contact creation error");
			}

			phoneContact.save(success, error);

        }

	});

});