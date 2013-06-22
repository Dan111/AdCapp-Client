define("map/locals/locals",
[
    "jquery",
    "backbone",
    "backbone.localStorage",

    "./local",
    "app.config"
], 

function ($, Backbone, LocalStorage, Local, App) {

	/**
    Coleção de locais

    @class map.locals.LocalsCollection
    @alternateClassName LocalsCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @static
        @readonly
        @private
        **/
		model: Local,


        /**
        URL utilizado para obter os dados.

        @property url
        @type String
        @static
        @readonly
        @private
        **/
		url: App.URL + "locals",


        /**
        Alteração do método sync para utilizar o localStorage como cache

        @property sync
        @type Function
        **/
        sync: Backbone.cachingSync(Backbone.sync, 'locals'),


		initialize: function (){
		},


        /**
        Comparador de modelos

        @method comparator
        @private
        @param {Local} local Modelo de um local
        @return {String} Nome do local
        **/
        comparator: function( local ) {
          return local.get('name');
        },


	    /**
        Filtra a collection devolvendo um array com os 
        objectos que teem no nome a string passada

        @method getEventsWithString
        @param {String} string termo de filtragem
        @return {Array} array de modelos Local
        **/
        getLocalsWithString: function(string){
            var lowerString = string.toLowerCase();
            return this.filter(function(event_obj) {
                    return event_obj.get('name').toLowerCase().indexOf(lowerString) > -1;
                });
        },


	});

});