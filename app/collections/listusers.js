define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/listuser",
    "app.config"
], 

function ($, Backbone, LocalStorage, listUser, App) {

	/**
    Coleção de utilizadores para serem mostrados em lista

    @class ListUserCollection
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
        @class ListUserCollection
        @param {Object} args contém booleano para distinguir oradores de participantes
        	@param {boolean} args.isSpeakers booleano para distinguir oradores de participantes
        **/
		initialize: function (args){

			if(args.isSpeakers)
                this.url = App.URL + "speakers";
            else
                this.url = App.URL + "participants";

			console.log('UserS');
		},

		/**
        Comparador de modelos

        @method comparator
        @protected
        @param {listUser} user modelo de informação de utilizador para lista
        @return {String} nome do user
        **/
		comparator: function( user ) {
	      return user.get('name');
	    }


	});

});