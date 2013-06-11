define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "moment",
    "models/personalagenda",
    "collections/events",
    "views/basicview"
], function ($, Backbone, _, Handlebars, Moment, PersonalAgenda, EventCollection, BasicView) {

	/**
	View das páginas com listagens de eventos

	@class EventsListView
	@extends BasicView
	**/
	return BasicView.extend({
		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@final
		@default "div[data-role=content]"
		**/
		el: "div[data-role=content]",

		/**
		Id da página em questão, muda consoante
		o tipo de lista de eventos

		@property id 
		@type String
		@static
		@final
		@default ""
		**/
		id: "",

		/**
		Template de todas as páginas
		de listas de eventos

		@property template 
		@type String
		@final
		@protected
		@default "events-template"
		**/
		template:"events-template",

		/**
		Nome da página em questão, muda consoante
		o tipo de lista de eventos

		@property pageName 
		@type String
		@static
		@final
		@default ""
		**/
		pageName: "",


		/**
        Dicionário que guarda informações relativas aos tipos de
        eventos possíveis

        @property typesInfo
        @type Javascript prototype
        @static
        @final
        @protected
        @default {"paper": {color: '#2c3e50', url: '#paper/'}, "workshop": {color: '#16a085', url: '#workshop/'}, 
				  "social": {color: '#8e44ad', url: '#social/'}, "keynote": {color: '#2ecc71', url: '#keynote/'},
				  "session": {url: '#sessions/'}},}
        **/
		typesInfo: {"paper": {color: '#2c3e50', url: '#paper/'}, "workshop": {color: '#16a085', url: '#workshop/'}, 
					"social": {color: '#8e44ad', url: '#social/'}, "keynote": {color: '#2ecc71', url: '#keynote/'},
					"session": {url: '#sessions/'}},

		/**
		Construtor da classe EventsListView.
		Neste construtor é feito o fetch de uma EventCollection, que representa
		os elementos a serem apresentados na view. Ainda neste contrutor é
		feito o rendering necessário e fetch da PersonalAgenda do utilizador do
		dispositivo.

		@constructor
		@protected
		@class EventsListView
		@param {Object} args contém um booleano, id da página e nome da página
			@param {string} args.type string que indentifica o tipo dos eventos a apresentar
			utilizar
            @param {String} args.id id da página
            @param {String} args.pageName nome da página
        **/
		initialize: function (args)
		{
			_.bindAll(this);


			var self = this;

			this.eventType = args.type;
			this.id = args.pageId;
			this.pageName = args.pageName; 
			//PARTE DO ID TEM DE SER ALTERADA PARA USAR O ID DO UTILIZADOR DO
			//DISPOSITIVO
			this.personalEvents = this.personalAgenda = new PersonalAgenda({id: 0, Personal: true});

			this.listEvents = new EventCollection({isPersonal: false});

			this.personalAgenda.fetch({
				success: function () {
					console.log("Personal Events loaded from server");
				},
				error: function (){
					console.log("Fail to get events from server or don't have any");
				}
			});

			this.listEvents.fetch({
				success: function () {
					self.renderLayout();
					self.render();
				}
			});
		},

		/**
		Faz uma filtragem de eventos consoante o tipo e prepara-os para a listagem.
		Ainda faz o rendering do layout das páginas de listagem de eventos,
		passando o template e o contexto adequeados, sendo que o contexto
		é composto 

		@method render
		@protected
		@chainable
		**/
		render: function () {
			var types = {};

			types[this.eventType] = true;
			var models = this.listEvents.getEventsOfType(types);

			var treatedEvents = _.map(models, this.treatEvents);
			var context = {
				eventsList: treatedEvents
			};

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			return this;

		},

		/**
		Faz o tratamento do evento passado, preparando-o para a listagem

		@method treatEvents
		@protected
		@param {Event} event_obj modelo evento
		@return {url: url do evento,
				 name: nome do evento, 
		    		start: data de início do evento na forma YYYY-MM-DD HH:mm, 
		    		end: data de fim do evento na forma YYYY-MM-DD HH:mm,
		    		local_name: nome da sala do evento, 
		    		inagenda: booleano que indica se o evento está na agenda } 
		**/
		treatEvents: function(event_obj){
			var dateFormat = "YYYY-MM-DD HH:mm";

			var eventAttrs = event_obj.attributes;

  			var date = eventAttrs.hours.toString();
            var startDate = Moment(date);
		   	var duration = eventAttrs.duration;


			var inagenda = false;

		   	if(this.personalEvents.hasEvent(eventAttrs.id))
		    	inagenda = true;
		    //ALTERAR LOCAL_NAME QUANDO TIVER COLLECTION DE LOCAIS
		    return{url: this.typesInfo[eventAttrs.type].url + eventAttrs.typeId.toString(), name: eventAttrs.name, 
		    		start: startDate.utc().format(dateFormat), end: startDate.add('minutes',duration).utc().format(dateFormat),
		    		local_name: "Sala1", inagenda: inagenda };
		}


	});


});