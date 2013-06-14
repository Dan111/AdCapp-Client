define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/session",
    "app.config"
], 

function ($, Backbone, LocalStorage, Session, App) {

	/**
    Coleção de sessions

    @class SessionsCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default Session
        **/
		model: Session,

		url: App.URL + "sessions",


		initialize: function (){
		},

	    /**
        Devolve o modelo session da collection que tem como id o id 
        passado

        @method getById
        @protected
        @param {integer} id id de um session
        @return {Session} modelo com o id passado
        **/
	    getById: function (id){
            return  this.find( function(session){ return session.get("id") === id; });
        },

        /**
        Devolve os modelos da collection que tem como id os ids
        passados no array

        @method getByIds
        @protected
        @param {Array} arrayOfIds array de ids
        @return {Array} array de modelos Session
        **/
        getByIds: function(arrayOfIds){
            that = this;
            return _.map(arrayOfIds, function(id){
                return that.getById(id);
            });
        }


	});

});