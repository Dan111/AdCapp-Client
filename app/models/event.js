define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	/**
    Modelo que representa um evento

    @class Event
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        Url do servidor para fazer fecth do modelo

        @property url 
        @type String
        @static
        @final
        @default "http://danielmagro.apiary.io/events/"
        **/
		url: "http://danielmagro.apiary.io/events/",

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
			typeId: 0,
			name: null,
			hours: 0, 
			duration: 0, //em minutos
			type: null,
			local_id: -1,
			users_id_array: null

		},

		/**
        Construtor do modelo Event. Adiciona à url o id
        do modelo a fazer fetch do servidor

        @constructor
        @protected
        @class Event
        **/
		initialize: function (){

			//adiciona o id do modelo ao url, para o Backbone poder fazer fetch da informação
			this.url += this.id;
		}

	});

});
