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

		localStorage: new Backbone.LocalStorage('personal-agenda-backbone'),

		initialize: function (){
			console.log('Personal EventS');
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

        //Filtra a coleção de eventos para obter apenas aqueles cujo o id
        // id está no tal array
        getPersonalAgenda: function(arrayOfEventsId){
            return this.filter(function(event_obj){
                return _.contains(arrayOfEventsId, event_obj.get("id"));
            });
        }


	});

});