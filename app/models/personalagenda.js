define([
    "jquery",
    "backbone",
    "underscore"
], 

function ($, Backbone, _) {

	/**
    Modelo de agenda pessoal

    @class PersonalAgenda
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        Url do servidor para fazer fecth do modelo

        @property url 
        @type String
        @static
        @final
        @default null
        **/
		url: null,

		/**
        LocalStorage para fazer fecth do modelo

        @property localStorage 
        @type String
        @static
        @final
        @default null
        **/
		localStorage: null,

		/**
        Defaults dos atributos do modelo

        @property defaults
        @type Object
        @static
        @final
        @protected
        **/
		defaults: {
			id: -1,
			chosen_events: null
		},

		/**
        Construtor do modelo. Verifca o booleano passado como parametro
        e escolhe o suporte para o fetch do modelo, pudendo ser um url,
        ou localStorage

        @constructor
        @protected
        @class PersonalAgenda
        @param {Javascript prototype} args contém booleano para distinguir a agenda do utilizador do dispositivo ou de outro
        **/
		initialize: function (args){

			if(args.Personal)
				this.localStorage =  new Backbone.LocalStorage('personal-agenda-backbone')
			else
        		//adiciona o id do modelo ao url, para o Backbone poder fazer fetch da informação
				this.url = "user/"+this.id+"/schedule";


		},

		/**
        Verifica se um evento está no array da agenda pessoal, retornando
        um booleano

        @method hasEvent
        @protected
        @param {integer} eventId id de um evento
        **/
		hasEvent: function (eventId)
		{
			return _.indexOf(this.get("chosen_events"), eventId) > -1;
		},

		
		/**
        Verifica se existem na agenda pessoal, todos os eventos
		representados pelos ids contidos no array

        @method hasEvents
        @protected
        @param {Array} idsArray array de inteiros que representão id's de eventos
        **/
		hasEvents: function (idsArray)
		{ 
			var result = true;
			that = this;
			_.each(idsArray, function(id){
				result = result && that.hasEvent(id);
			});

			return result;
		},

		/**
        Remove o evento com o id passado da agenda pessoal

        @method removeEvent
        @protected
        @param {integer} eventId id de um evento
        **/
		removeEvent: function (eventId)
		{
			var newArray = _.difference(this.get("chosen_events"), [eventId]);
			this.set("chosen_events", newArray);
		}, 

		/**
        Adiciona o evento com o id passado à agenda pessoal

        @method addEvent
        @protected
        @param {integer} eventId id de um evento
        **/
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