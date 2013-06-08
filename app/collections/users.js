define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/listuser"
], 

function ($, Backbone, LocalStorage, listUser) {

	/**
    Coleção de utilizadores para serem mostrados em lista

    @class UserCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
		Tipo do modelo utilizado na collection

		@property model 
		@type Backbone.Model
		@final
		@protected
		@default listUser
		**/
		model: listUser,

		/**
        Url do servidor para fazer fecth da collection

        @property url 
        @type String
        @static
        @final
        @default ""
        **/
		url: "",

		//localStorage: new Backbone.LocalStorage('users-backbone'),

		/**
        Construtor da coleção. Verifca o booleano passado como parametro
        e escolhe a url a utilizar no fecth da collection

        @constructor
        @protected
        @class UserCollection
        @param {Javascript prototype} args contém booleano para distinguir oradores de participantes
        **/
		initialize: function (args){

			if(args.isSpeakers)
				this.url = "http://danielmagro.apiary.io/speakers";
			else
				this.url = "http://danielmagro.apiary.io/participants";

			console.log('UserS');
		},

		/**
        Comparador de modelos

        @method comparator
        @protected
        @param {listUser} user modelo de informação de utilizador para lista
        **/
		comparator: function( user ) {
	      return user.get('name');
	    }


	});

});