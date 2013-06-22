define([
    "jquery",
    "backbone",
    "app.config",

    "backbone.cachingsync"
], 

function ($, Backbone, App) {
	
	/**
    Modelo de utilizadores/participantes da conferência

    @class profile.User
    @alternateClassName User
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        Url do servidor para fazer fecth do modelo

        @property url 
        @type String
        @private
        **/
		url: App.URL + "users/",


        /**
        Alteração do método sync para utilizar o localStorage como cache

        @property sync
        @type Function
        **/
        sync: Backbone.cachingSync(Backbone.sync, 'adcapp-user'),


		/**
        Defaults dos atributos do modelo

        @property defaults
        @type Object
        @static
        @readonly
        @private
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
