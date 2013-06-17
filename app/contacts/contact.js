define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	/**
    Modelo do contacto referente a um utilizador/participante

    @class Contact
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        Nome do atributo que guarda o id do utilizador
        referente a este contacto

        @property idAttribute 
        @type String
        @static
        @final
        @default "user_id"
        **/
		idAttribute: 'user_id',

		/**
        Defaults dos atributos do modelo

        @property defaults
        @type Object
        @static
        @final
        @protected
        **/
		defaults: {

			user_name: 'Unknown',
			user_id: -1,
			email: 'Unknown',
			image: 'None'

		},

		initialize: function (){
		}

	});

});