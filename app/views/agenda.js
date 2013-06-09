define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "fullcalendar",
    "moment",
    "collections/events",
    "models/personalagenda",
    "views/calendar",
    "views/basicview"
], 

function ($, Backbone, _, Handlebars, FullCalendar, Moment, EventCollection, PersonalAgenda, CalendarView, BasicView) {

	/**
    View da página da agenda

    @class AgendaView
    @extends BasicView
    **/
	return BasicView.extend({

		/**
        Id da página da agenda

        @property id 
        @type String
        @static
        @final
        @default "agenda-page"
        **/
		id: "agenda-page",

        /**
        Nome da página da agenda

        @property pageName 
        @type String
        @static
        @final
        @default "Agenda"
        **/		
		pageName: "Agenda",

        /**
        Template da agenda

        @property template 
        @type String
        @final
        @protected
        @default "agenda-template"
        **/
		template: "agenda-template",

        /**
        Eventos lançados pela transição entre tabs,
        que representão a agenda geral e a agenda
        personalizada

        @property events
        @type Object
        @protected
        **/
		events: {
			'click #generalAgenda' : 'renderGeneral',
			'click #personalAgenda' : 'renderPersonal',
		},

 		/**
        Modelo da agenda pessoal

        @property personalAgenda
        @type Backbone.Model
        @final
        @protected
        @default null
        **/
		personalAgenda: null,

		/**
        Coleção dos eventos da conferência

        @property conferenceEvents
        @type Backbone.Collection
        @final
        @protected
        @default null
        **/
		conferenceEvents: null,

		/**
        View que apresenta o tipo de agenda escolhido,
        neste caso ou é a agenda geral ou a personalizada

        @property calendarView
        @type Backbone.View
        @final
        @protected
        @default null
        **/
		calendarView: null,

		/**
        Construtor da classe AgendaView. Faz o fecth da agenda personalizada,
        da coleção de eventos da conferência e faz o rendering da página

        @constructor
        @class AgendaView
        **/
		initialize: function ()
		{
			_.bindAll(this);

			var self = this;

			//Por enquanto para teste fica como utilizador 0 o utilizador do 
			//dispositivo, mas quando o registo/login estiver feito teremos
			//de passar o id correspondente
			this.personalAgenda = new PersonalAgenda({id: 0, Personal: true});

			this.conferenceEvents = new EventCollection({isPersonal: false});	

			this.personalAgenda.fetch({
				success: function () {
					console.log("Personal Events loaded from server");
				},
				error: function (){
					console.log("Fail to get events from server or don't have any");
				}
			});
		
			this.conferenceEvents.fetch({
				success: function () {
					self.renderLayout();
					self.render();
				}
			});


		},

        /**
        Faz o rendering do layout base da página da agenda

        @method render
        @protected
        @chainable
        **/
		render: function () {

			var context = null;
			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			this.setElement($("[data-role=content]"));
			this.calendarView = new CalendarView({toShowEvents: this.conferenceEvents, personalEvents: this.personalAgenda, inPersonal: false});


			return this;

		},


		/**
        Faz o rendering do calendário com todos os eventos da conferência

        @method renderGeneral
        @protected
        **/
		renderGeneral: function() {
			this.calendarView.undelegateEvents();
			this.calendarView = new CalendarView({toShowEvents: this.conferenceEvents, personalEvents: this.personalAgenda, inPersonal: false}) ;
		},

		/**
        Faz o rendering do calendário com todos os eventos da agenda personalizada

        @method renderPersonal
        @protected
        **/
		renderPersonal: function() {
			this.calendarView.undelegateEvents();
			var personalLocalAgenda = new EventCollection({isPersonal: true});

			//quando se cria uma collection por alguma razão já vem com um elemento com defaults
			//daí o reset
			personalLocalAgenda.reset();
			var modelsArray = this.conferenceEvents.getEventsFromIdArray(this.personalAgenda.get("chosen_events")); 
			personalLocalAgenda.add(modelsArray);

			this.calendarView = new CalendarView({toShowEvents: personalLocalAgenda, personalEvents: this.personalAgenda, inPersonal: true}) ;
		},




	});


});