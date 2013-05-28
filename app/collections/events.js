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
			console.log('EventS');
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

        //Filtra a collection devolvendo um array com os
        //objectos com os tipos desejados
        //São passados um objecto javascript do tipo
        //{papers: boolean, workshops: boolean, socials: boolean}
        //e um número para se saber o número de tipos requeridos
        getEventsOfType: function(types, numberOfTypes){

        	var type1 = null;
        	var type2 = null;
        	var type3 = null;

        	//verificamos quais os tipos que
        	//são necessários
        	if (types.papers)
        		type1 = "paper";

        	if (types.workshops)
        	{	
        		if(type1 === null)
        			type1 = "workshop";
        		else
        			type2 = "workshop";
        	}

        	if (types.socials)
        	{
        		if(type1 === null)
        			type1 = "social";
        		else if(type2 === null)
        			type2 = "social";
        		else
        			type3 = "social";
        	}

        	//Se um dos type fosse a null funcionava, mas
        	// para não haver nenhum erro, já que o default do
        	// type de um event é null, decidi usar o tal
        	//numberOfTypes
        	if(numberOfTypes === 1)
	        	return this.filter(function(event_obj) {
					return event_obj.get('type') === type1;
				});
	        else if(numberOfTypes === 2)
	        	return this.filter(function(event_obj) {
	        		var type = event_obj.get('type')
					return  type === type1 || type === type2;
				});
	        else 
	        	return this.filter(function(event_obj) {
	        		var type = event_obj.get('type')
					return  type === type1 || type === type2 || type === type3;
				});
        }


	});

});