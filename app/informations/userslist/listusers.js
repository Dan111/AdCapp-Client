define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "./listuser",
    "app.config"
], 

function ($, Backbone, LocalStorage, listUser, App) {

    /**
    Coleção de utilizadores para serem mostrados em lista

    @class ListUserCollection
    @extends Backbone.Collection
    **/
    return Backbone.Collection.extend({

        /**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default listUser
        **/
        model: listUser,

        /**
        Url do servidor para fazer fecth da collection

        @property url 
        @type String
        @static
        @final
        @default ""
        **/
        url: "",

        //localStorage: new Backbone.LocalStorage('users-backbone'),

        /**
        Construtor da coleção. Verifca o booleano passado como parametro
        e escolhe a url a utilizar no fecth da collection

        @constructor
        @protected
        @class ListUserCollection
        @param {Object} args contém booleano para distinguir oradores de participantes
            @param {boolean} args.isSpeakers booleano para distinguir oradores de participantes
        **/
        initialize: function (args){

            if(args.isSpeakers)
            {
                this.url = App.URL + "speakers";
                this.sync = Backbone.cachingSync(Backbone.sync, 'speakers');
            }
            else
            {
                this.url = App.URL + "participants";
                this.sync = Backbone.cachingSync(Backbone.sync, 'participants');
            }

            console.log('UserS');
        },

        /**
        Comparador de modelos

        @method comparator
        @protected
        @param {listUser} user modelo de informação de utilizador para lista
        @return {String} nome do user
        **/
        comparator: function( user ) {
          return user.get('name');
        },

        /**
        Filtra a collection devolvendo um array com os 
        objectos que teem no nome, na instituição ou na area a string passada

        @method getEventsWithString
        @protected
        @param {String} string termo de filtragem
        @return {Array} array de modelos listUser
        **/
        getUsersWithString: function(string){
            var lowerString = string.toLowerCase();
            return this.filter(function(obj) {
                    if(obj.get('name').toLowerCase().indexOf(lowerString) > -1)
                        return true;
                    else if(obj.get('institution').toLowerCase().indexOf(lowerString) > -1)
                        return true;
                    else if(obj.get('area').toLowerCase().indexOf(lowerString) > -1)
                        return true;
                    else
                        return false;
                });
        },
    });

});