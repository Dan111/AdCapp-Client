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

    @class LocalsCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default Local
        **/
		model: Local,

		//url: App.URL + "locals",
url: "http://lcatalaya.apiary.io/Locals",

		initialize: function (){
		},

	    /**
        Filtra a collection devolvendo um array com os 
        objectos que teem no nome a string passada

        @method getEventsWithString
        @protected
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