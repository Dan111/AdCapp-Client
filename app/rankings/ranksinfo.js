define([
    "jquery",
    "backbone",
    "common/basicview",
    "app.config"
], 

function ($, Backbone, BasicView, App) {

	/**
    Modelo de uma palestra

    @class rankings.RankInfo
    @alternateClassName RankInfo
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
		URL utilizado para obter os dados.

		@property url
		@type String
		@private
		**/
		url: null,


		/**
        Atributos predefinidos do modelo.

        @property defaults
        @type Object
        @static
        @readonly
        @private
        **/
		defaults: {
            has_votes: false,
			voted: -1,
    		awards:[],
    		competitors: []
		},


		/**
        Construtor do modelo. Adiciona ao URL o tipo da instância.

        @constructor
        @param {Object} args contém o tipo de ranking
            @param {String} args.type tipo de ranking
        @example "paper", "session", "user", "keynote" ou "workshop"
        **/
		initialize: function (args){
			this.url = App.URL + "rankings/" + args.type;
		},

		

	});

});