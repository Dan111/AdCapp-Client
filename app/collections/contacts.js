define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/contact"
], 

function ($, Backbone, LocalStorage, Contact) {

	/**
    Coleção de contactos

    @class ContactCollection
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
        @type Backbone.LocalStorage
        @static
        @final
        @default new Backbone.LocalStorage('contacts-backbone')
        **/
		localStorage: new Backbone.LocalStorage('contacts-backbone'),


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
        @return {Contact} modelo com o id passado
        **/
	    hasContact: function (id){
            return  this.find( function(user){ return user.get("user_id") === id; });
        },


        /**
        Exporta os contactos da aplicação para o dispositivo

        @method exportContacts
        @protected
        **/
        exportContacts: function (){

        	console.log("exporting");

        	this.each(function (contact){

        		this.addPhoneContact(contact)
        	
        	}, this);

        },


        /**
        Adiciona o contacto passado como parâmetro ao dispositivo, caso ainda 
        não exista um outro contacto com o mesmo email

        @method addPhoneContact
        @param {Contact} contacto a ser adicionado
        **/
        addPhoneContact: function (contact){

        	var exported = false;

        	var email = contact.get('email');

        	var options = new ContactFindOptions(); //objecto de pesquisa
			options.filter = email; //filtro a ser usado na pesquisa
			options.multiple = false; //retorna apenas um contacto

			var self = this;

			var success = function (contacts){  //função chamada caso a pesquisa
                                                //seja bem sucedida

				if(contacts.length === 0) {
					self.createPhoneContact(contact);
					success = true;
				}
			}

			var error = function (){ //callback em caso de erro
				console.log("contact search error");
			}

			navigator.contacts.find(["emails", "displayName"], success, error, options);

        },


        /**
        Cria um novo contacto do Phonegap e adiciona-o à lista de contactos do 
        dispositivo

        @method createPhoneContact
        @param {Contact} contacto a ser criado
        **/
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