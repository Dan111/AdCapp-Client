define([
    "jquery",
    "backbone",
    "views/basicview",
    "app.config"
], 

function ($, Backbone, BasicView, App) {

	/**
    Modelo de uma palestra

    @class RankInfo
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		@default "null"
		**/
		url: null,


		/**
        Atributos predefinidos do modelo.

        @property defaults
        @type Object
        @static
        @final
        @private
        **/
		defaults: {
			voted: -1,
    		awards:[],
    		competitors: []
		},


		/**
        Construtor do modelo. Adiciona ao URL o tipo da instância.

        @constructor
        @protected
        @class RankInfo
        @param {Oject} args contém o tipo de ranking
            @param {String} args.type tipo de ranking
        @example "paper", "session", "user", "keynote" ou "workshop"
        **/
		initialize: function (args){
			this.url = App.URL + "rankings/" + args.type;
		},

		

	});

});