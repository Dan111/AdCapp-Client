define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/workshop",
    "app.config"
], 

function ($, Backbone, LocalStorage, Workshop, App) {

	/**
    Coleção de workshop's

    @class WorkshopsCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default Workshop
        **/
		model: Workshop,

		url: App.URL + "workshops",


		initialize: function (){
		},

	    /**
        Devolve o modelo workshop da collection que tem como id o id 
        passado

        @method getById
        @protected
        @param {integer} id id de um workshop
        @return {Workshop} modelo com o id passado
        **/
	    getById: function (id){
            return  this.find( function(workshop){ return workshop.get("id") === id; });
        },

        /**
        Devolve os modelos da collection que tem como id os ids
        passados no array

        @method getByIds
        @protected
        @param {Array} arrayOfIds array de ids
        @return {Array} array de modelos Workshop
        **/
        getByIds: function(arrayOfIds){
            that = this;
            return _.map(arrayOfIds, function(id){
                return that.getById(id);
            });
        }


	});

});