define([
    "jquery",
    "backbone",
    "underscore",
    "backbone.localStorage",
    "models/event"
], 

function ($, Backbone, _, LocalStorage, Event) {

	return Backbone.Collection.extend({

		model: Event,

		url: null,

		localStorage: null,

		initialize: function (args){
            if(!args.isPersonal)
                this.url = "http://danielmagro.apiary.io/events";

			console.log('EventS');
		},

        //Verifica se o evento esta na collection
        hasEvent: function (id){
            return  this.find( function(event_obj){ return event_obj.get("id") === id; });
        },

		//Devolve o evento com um dado name
		//caso contrário devolve null
		getEventByName: function(name){
            
            return  this.find( function(event_obj){ 
            	if(event_obj.get("name") === name)
            		return event_obj; 
            	else
            		return null;
            });
        },

        //Filtra a collection devolvendo um array com os 
        //objectos que teem nome a stinr passada
        getEventsWithString: function(string){
            var lowerString = string.toLowerCase();
            return this.filter(function(event_obj) {
                    return event_obj.get('name').toLowerCase().indexOf(lowerString) > -1;
                });
        },

        
        getEventsOfType: function(types){

            var chainTypes = _.chain(types)
                .pairs()
                .filter(function (pair){ return pair[1];})
                .map(function (pair){return pair[0];}).value();

            return this.filter(function(event_obj){
                return _.contains(chainTypes,event_obj.get("type").toLowerCase());
            });
        },

        getDifferences: function(arrayOfIds)
        {
            var idsArray = this.map(function(event_obj){
                return event_obj.get("id");
            });

            return _.difference(idsArray, arrayOfIds);
        },

        //Filtra a coleção de eventos para obter apenas aqueles cujo o id
        // id está no tal array
        getEventsFromIdArray: function(arrayOfEventsId){
            return this.filter(function(event_obj){
                return _.contains(arrayOfEventsId, event_obj.get("id"));
            });
        },

        syncEvents: function(conferenceEvents, personalAgenda){

             
                
            var personalEvents = conferenceEvents.getPersonalAgenda(personalAgenda.get("chosen_events"));
            
            for(i = 0; i < personalEvents.length; i++)
            {
                var eventAttr = personalEvents[i].attributes;
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
            
        },

        removeEvent: function(eventId) {
            this.hasEvent(eventId).destroy();
        },

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