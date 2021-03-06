define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "profile/user",
    "app.config"
], 

function ($, Backbone, LocalStorage, User, App) {

    /**
    Coleção de users

    @class rankings.UsersCollection
    @alternateClassName UsersCollection
    @extends Backbone.Collection
    **/
    return Backbone.Collection.extend({

        /**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @readonly
        @protected
        
        **/
        model: User,

        url: App.URL + "users",

        /**
        Alteração do método sync para utilizar o localStorage como cache

        @property sync
        @type Function
        @private
        **/
        sync: Backbone.cachingSync(Backbone.sync, 'users'), 

        initialize: function (){
        },

        /**
        Devolve o modelo user da collection que tem como id o id 
        passado

        @method getById
        @protected
        @param {Number} id id de um user
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