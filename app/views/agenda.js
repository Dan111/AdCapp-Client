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

	return BasicView.extend({

		//el: "div[data-role=content]",

		id: "agenda-page",
		pageName: "Agenda",

		template: "agenda-template",

		events: {
			'click #generalAgenda' : 'renderGeneral',
			'click #personalAgenda' : 'renderPersonal',
		},

		

		personalEvents: null,//array com os ids dos eventos da agenda personalizada vindos do server
		generalCalendarView: null,
		personalCalendarView: null,


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


		render: function () {

			var context = null;
			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			this.setElement($("[data-role=content]"));
			this.calendarView = new CalendarView({toShowEvents: this.conferenceEvents, personalEvents: this.personalAgenda, inPersonal: false});


			return this;

		},

		renderGeneral: function() {
			this.calendarView.undelegateEvents();
			this.calendarView = new CalendarView({toShowEvents: this.conferenceEvents, personalEvents: this.personalAgenda, inPersonal: false}) ;
		},

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