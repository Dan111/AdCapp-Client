define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {
	
	/**
    Modelo de utilizadores/participantes da conferência

    @class UserModel
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        Url do servidor para fazer fecth do modelo

        @property url 
        @type String
        @static
        @final
        @default "http://danielmagro.apiary.io/users/"
        **/
		url: "http://danielmagro.apiary.io/users/",

		/**
        Defaults dos atributos do modelo

        @property defaults
        @type Object
        @static
        @final
        @protected
        **/
		defaults: {

			name: null, 
			email: null,
			institution: null,
			area: null,
			image: 'None',
			publish_schedule: false,
			votes: 0,
			author: false,
			hasVoted: false, 
			bio: null,
			socialContacts: null,
			events: null,
			nextEvent: null

		},

		/**
        Construtor do modelo UserModel. Adiciona à url o id
        do modelo a fazer fetch do servidor

        @constructor
        @protected
        @class UserModel
        **/
		initialize: function (){

			//this.contacts = new Contacts;
        	//this.contacts.url = '/user/' + this.id + '/contacts';
        	//Verificar proximo statement
        	//this.contacts.on("reset", this.updateCounts);
        	//this.socialContacts = new SocialContact;

        	//adiciona o id do modelo ao url, para o Backbone poder fazer fetch da informação
			this.url += this.id;
		}

	});

});
