define("events/common/events",
[
    "jquery",
    "backbone",
    "underscore",
    "backbone.localStorage",
    "backbone.cachingsync",

    "./event",
    "app.config"
], 


function ($, Backbone, _, LocalStorage, CachingSync, Event, App) {

    /**
    Coleção de eventos

    @class EventCollection
    @extends Backbone.Collection
    **/
    return Backbone.Collection.extend({

        /**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default Event
        **/
        model: Event,

        /**
        Url do servidor para fazer fecth da collection

        @property url 
        @type String
        @static
        @final
        @default App.URL + "events"
        **/
        url: App.URL + "events",

        localStorage: null,

        /**
        Sync da colecção, que com a ajuda do cachingSync,
        trata do caching desta colecção

        @property sync
        @type String
        @static
        @final
        @default Backbone.cachingSync(Backbone.sync, 'events')
        **/
        sync: Backbone.cachingSync(Backbone.sync, 'events'),
        
        /**
        Construtor da coleção.

        @constructor
        @protected
        @class EventCollection
        **/
        initialize: function (){
            

            console.log('EventS');
        },


        /**
        Comparador de modelos

        @method comparator
        @protected
        @param {Event} e Modelo de um evento
        @return {String} Nome do modelo
        **/
        comparator: function( e ) {
          return e.get('name');
        },

        
        /**
        Verifica se um evento está na collection

        @method hasEvent
        @protected
        @param {integer} id id de um evento
        @return {Event} modelo Event
        **/
        hasEvent: function (id){
            return  this.find( function(event_obj){ return event_obj.get("id") === id; });
        },

        
        /**
        Devolve o evento com um dado name,
        caso contrário devolve null

        @method getEventByName
        @protected
        @param {String} name nome de uma evento
        @return {Event} modelo Event
        **/
        getEventByName: function(name){
            
            return  this.find( function(event_obj){ 
                if(event_obj.get("name") === name)
                    return event_obj; 
                else
                    return null;
            });
        },

        
        /**
        Filtra a collection devolvendo um array com os 
        objectos que teem no nome a string passada

        @method getEventsWithString
        @protected
        @param {String} string termo de filtragem
        @return {Array} array de modelos Event
        **/
        getEventsWithString: function(string){
            var lowerString = string.toLowerCase();
            return this.filter(function(event_obj) {
                    return event_obj.get('name').toLowerCase().indexOf(lowerString) > -1;
                });
        },

        /**
        Filtra a collection, consoantes os booleanos passados, que
        respresentão os tipos de evento

        @method getEventsOfType
        @protected
        @param {Object} types contém tipos de eventos, cada um representado por um booleano
        @example {"paper": true, "workshop": false, "social": false, "keynote": false}
        @return {Array} array de modelos Event
        **/
        getEventsOfType: function(types){

            var chainTypes = _.chain(types)
                .pairs()
                .filter(function (pair){ return pair[1];})
                .map(function (pair){return pair[0];}).value();

            return this.filter(function(event_obj){
                return _.contains(chainTypes,event_obj.get("type").toLowerCase());
            });
        },


        /**
        Filtra a coleção de eventos para obter apenas aqueles cujo o id
        está no array passado

        @method getEventsFromIdArray
        @protected
        @param {Array} arrayOfEventsId array de id's de eventos
        @return {Array} array de modelos Event
        **/
        getEventsFromIdArray: function(arrayOfEventsId){
            return this.filter(function(event_obj){
                return _.contains(arrayOfEventsId, event_obj.get("id"));
            });
        },

        /**
        Remove um evento da collection

        @method removeEvent
        @protected
        @param {integer} eventId id do evento a remover
        **/
        removeEvent: function(eventId) {
            this.hasEvent(eventId).destroy();
        },

        /**
        Adiciona um evento à collection

        @method addEvent
        @protected
        @param {Object} eventAttr atributos do evento a criar na collection
        **/
        addEvent: function(eventAttr) {

            var attrs = {
                        id: eventAttr.id,
                        name: eventAttr.name,
                        hours: eventAttr.hours, 
                        duration: eventAttr.duration,
                        type: eventAttr.type,
                        local_id: eventAttr.local_id,
                        users_id_array: eventAttr.users_id_array
                    };
            this.create(attrs);
        }



    });

});