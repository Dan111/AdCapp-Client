define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/event"
], 

function ($, Backbone, LocalStorage, Event) {

	return Backbone.Collection.extend({

		model: Event,

		url: "http://danielmagro.apiary.io/events",

		//localStorage: new Backbone.LocalStorage('events-backbone'),

		initialize: function (){
			
			//this.url = "http://danielmagro.apiary.io/events";
			console.log('EventS');
		},

		 getEventByName: function(name){
            
            return  this.find( function(event_obj){ 
            	if(event_obj.get("name") === name)
            		return event_obj; 
            	else
            		return null;
            });
        }


	});

});