define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/contact"
], 

function ($, Backbone, LocalStorage, Contact) {

	/**
    Coleção de contactos

    @class Contacts
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default Contact
        **/
		model: Contact,

		/**
        LocalStorage para fazer fecth da collection

        @property localStorage
        @type new Backbone.LocalStorage('contacts-backbone')
        @static
        @final
        @default new Backbone.LocalStorage('contacts-backbone')
        **/
		localStorage: new new Backbone.LocalStorage('contacts-backbone'),


		initialize: function (){
		},

		/**
        Comparador de modelos

        @method comparator
        @protected
        @param {Contact} contact modelo de um contacto
        **/
		comparator: function ( contact ) {
	      return contact.get('order');
	    },


	    /**
        Verifica se um contacto está na collection

        @method hasContact
        @protected
        @param {integer} id id de um contacto
        **/
	    hasContact: function (id){
            return  this.find( function(user){ return user.get("user_id") === id; });
        },


        exportContacts: function (){

        	console.log("exporting");

        	this.each(function (contact){

        		this.addPhoneContact(contact)
        	
        	}, this);

        },


        addPhoneContact: function (contact){

        	var exported = false;

        	var email = contact.get('email');

        	var options = new ContactFindOptions();
			options.filter = email;
			options.multiple = false;

			var self = this;

			var success = function (contacts){  

				if(contacts.length === 0) {
					self.createPhoneContact(contact);
					success = true;
				}
			}

			var error = function (){
				console.log("contact search error");
			}

			navigator.contacts.find(["emails", "displayName"], success, error, options);

        },


        createPhoneContact: function (contact){ //TODO: Adicionar social contacts e outras infos

        	var phoneContact = navigator.contacts.create();

			phoneContact.displayName = contact.get('user_name');
			phoneContact.emails = [new ContactField('work', contact.get('email'), false)];
			phoneContact.note = "AdCapp";

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