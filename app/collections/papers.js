define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/paper"
], 

function ($, Backbone, LocalStorage, Paper) {

	/**
    Coleção de papers

    @class PapersCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default Paper
        **/
		model: Paper,

		url: "http://danielmagro.apiary.io/papers",


		initialize: function (){
		},

	    /**
        Devolve o modelo paper da collection que tem como id o id 
        passado

        @method getById
        @protected
        @param {integer} id id de um paper
        @return {Paper} modelo com o id passado
        **/
	    getById: function (id){
            return  this.find( function(paper){ return paper.get("id") === id; });
        },

        /**
        Devolve os modelos da collection que tem como id os ids
        passados no array

        @method getByIds
        @protected
        @param {Array} arrayOfIds array de ids
        @return {Array} array de modelos Paper
        **/
        getByIds: function(arrayOfIds){
            that = this;
            return _.map(arrayOfIds, function(id){
                return that.getById(id);
            });
        }


	});

});