define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	/**
    Modelo que representa a informação de um utilizador/participantes 
    apresentada numa lista de utilizadores/participantes

    @class ListUser
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        Defaults dos atributos do modelo

        @property defaults
        @type Object
        @static
        @final
        @protected
        **/
		defaults: {
			id: 0,
    		name: null, 
    		institution: null, 
    		area: null, 
    		image: "None"

		},

		initialize: function (){

		}

	});

});

