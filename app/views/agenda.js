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
		calendarView: null,


		initialize: function ()
		{
			_.bindAll(this);

			var self = this;


			//Por enquanto para teste fica como utilizador 0 o utilizador do 
			//dispositivo, mas quando o registo/login estiver feito teremos
			//de passar o id correspondente
			//Modelo para de array + id da agenda personalizada de um utilizador, vindo do server
			this.personalAgenda = new PersonalAgenda({id: 0});

			this.personalLocalAgenda = new EventCollection({isPersonal: true});

			this.conferenceEvents = new EventCollection({isPersonal: false});	

			this.personalAgenda.fetch({
				success: function () {
					console.log("Personal Events loaded from server");
				},
				error: function (){
					console.log("Fail to get events from server or don't have any");
				}
			});

			this.personalLocalAgenda.fetch({
				success: function () {
					console.log("Personal Events loaded");
				},
				error: function (){
					console.log("Fail to get events or don't have any");
				}
			});

			
			this.conferenceEvents.fetch({
				success: function () {
					self.renderLayout();
					self.render();
				}
			});


		},


		renderLayout: function () {

			var pid = this.id;
			var name = this.pageName;

			var context = {page_id: pid, page_name: name};
			var html = this.compileTemplate("layout-template", context);

			//adiciona página ao body
			$("body").append(html);
			this.enhanceJQMComponentsAPI();

			//limpa a pagina anterior do DOM
			this.removePreviousPageFromDOM();

			return this;
		},


		render: function () {

			var context = null;
			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			this.setElement($("[data-role=content]"));

			this.personalLocalAgenda.syncEvents(this.conferenceEvents, this.personalAgenda);
			this.calendarView = new CalendarView({generalEvents: this.conferenceEvents, personalEvents: this.personalLocalAgenda, isOtherUserAgenda: false});


			return this;

		},

		renderGeneral: function() {
			this.calendarView.renderGeneral();
		},

		renderPersonal: function() {
			this.calendarView.renderPersonal();
		},




	});


});