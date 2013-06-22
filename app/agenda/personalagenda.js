define([
    "jquery",
    "backbone",
    "underscore",
    "app.config",
    "common/basicview"
], 

function ($, Backbone, _, App, BasicView) {

	/**
    Modelo de agenda pessoal

    @class agenda.PersonalAgenda
    @alternateClassName PersonalAgenda
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        Url do servidor para fazer fecth do modelo

        @property url 
        @type String
        @sprivate
        **/
		url: null,


		/**
        LocalStorage para fazer fecth do modelo

        @property localStorage 
        @type String
        @private
        **/
		localStorage: null,


		/**
        Defaults dos atributos do modelo

        @property defaults
        @type Object
        @static
        @readonly
        @private
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
        @param {Object} args contém booleano para distinguir a agenda do utilizador do dispositivo ou de outro
        @param {boolean} args.Personal booleano para distinguir a agenda do utilizador do dispositivo ou de outro
        **/
		initialize: function (args){

			if(args.Personal)
				this.localStorage =  new Backbone.LocalStorage('personal-agenda-backbone')
            else
            {
                //adiciona o id do modelo ao url, para o Backbone poder fazer fetch da informação
                this.url = App.URL + "users/" + this.get("id") + "/schedule";
                if(this.get("id") !== 0)
                    this.sync =  Backbone.cachingSync(Backbone.sync, 'personal-agenda-'+this.get("id"));
            }


		},


        /**
        Envia a agenda pessoal para o servidor

        @method sendPersonalAgenda
        @protected
        **/
        sendPersonalAgenda: function()
        {
            var url = App.URL + "users/" + this.get("id") + "/schedule";
            var chosen = this.get("chosen_events");
            var that =this;
            $.ajax({
                method: "POST",

                async: true,

                timeout: 5000,

                url: url,

                data: { 
                    "chosen_events": chosen
                },


                beforeSend: function () {
                    $.mobile.loading( 'hide' );
                },

                complete: function () {
                    //override do ajaxsetup para nao fazer hide do load spinner
                },

                success: function () {
                    $.mobile.loading( 'hide' );
                    
                },

                error: function (){
                    $.mobile.loading( 'hide' );
                    
                }
            });
        },

		/**
        Verifica se um evento está no array da agenda pessoal, retornando
        um booleano

        @method hasEvent
        @param {Number} eventId id de um evento
        @return {boolean} booleano que indica se o evento está na agenda
        **/
		hasEvent: function (eventId)
		{
			return _.indexOf(this.get("chosen_events"), eventId) > -1;
		},

		
		/**
        Verifica se existem na agenda pessoal, todos os eventos
		representados pelos ids contidos no array

        @method hasEvents
        @param {Array} idsArray array de inteiros que representão id's de eventos
        @return {boolean} booleano que indica se os eventos estão na agenda
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

        @param {Number} eventId id de um evento
        **/
		removeEvent: function (eventId)
		{
			var newArray = _.difference(this.get("chosen_events"), [eventId]);
			this.set("chosen_events", newArray);
		}, 


		/**
        Adiciona o evento com o id passado à agenda pessoal

        @method addEvent
        @param {Number} eventId id de um evento
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