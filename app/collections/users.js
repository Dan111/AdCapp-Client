define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/user",
    "app.config"
], 

function ($, Backbone, LocalStorage, User, App) {

	/**
    Coleção de users

    @class UsersCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default User
        **/
		model: User,

		url: App.URL + "users",


		initialize: function (){
		},

	    /**
        Devolve o modelo user da collection que tem como id o id 
        passado

        @method getById
        @protected
        @param {integer} id id de um user
        @return {User} modelo com o id passado
        **/
	    getById: function (id){
            return  this.find( function(user){ return user.get("id") === id; });
        },

        /**
        Devolve os modelos da collection que tem como id os ids
        passados no array

        @method getByIds
        @protected
        @param {Array} arrayOfIds array de ids
        @return {Array} array de modelos User
        **/
        getByIds: function(arrayOfIds){
            that = this;
            return _.map(arrayOfIds, function(id){
                return that.getById(id);
            });
        }


	});

});