define([
    "jquery",
    "backbone",
    "underscore"
], 

function ($, Backbone, _) {

	return Backbone.Model.extend({

		url: null,

		localStorage: null,

		defaults: {
			id: -1,
			chosen_events: null
		},

		initialize: function (args){

			if(args.Personal)
				this.localStorage =  new Backbone.LocalStorage('personal-agenda-backbone')
			else
        		//adiciona o id do modelo ao url, para o Backbone poder fazer fetch da informação
				this.url = "user/"+this.id+"/schedule";


		},

		hasEvent: function (eventId)
		{
			return _.indexOf(this.get("chosen_events"), eventId) > -1;
		},

		//Verifica se existem na agenda, todos os eventos
		//representados pelos ids contidos no array
		hasEvents: function (idsArray)
		{ 
			var result = true;
			that = this;
			_.each(idsArray, function(id){
				result = result && that.hasEvent(id);
			});

			return result;
		},

		removeEvent: function (eventId)
		{
			var newArray = _.difference(this.get("chosen_events"), [eventId]);
			this.set("chosen_events", newArray);
		}, 

		addEvent: function (eventId)
		{
			var newArray = [];

			if(this.get("chosen_events") === null)
				newArray =_.union([], [eventId]);
			else
				newArray =_.union(this.get("chosen_events"), [eventId]);

			this.set("chosen_events", newArray);
		}

	});

});