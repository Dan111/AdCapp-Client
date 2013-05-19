define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		url: "http://danielmagro.apiary.io/users/",

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
