define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "fullcalendar",
    "moment",
    "collections/events",
    "collections/personalevents",
    "models/personalagenda",
    "views/basicview"
], 

function ($, Backbone, _, Handlebars, FullCalendar, Moment, EventCollection, PersonalEvents, PersonalAgenda, BasicView) {

	return BasicView.extend({

		//el: "div[data-role=content]",

		id: "agenda-page",
		pageName: "Agenda",

		template: "agenda-template",

		events: {
			'click #searchsubmit' : 'search',
			'click #generalAgenda' : 'renderGeneral',
			'click #personalAgenda' : 'renderPersonal',
			'click #my-prev' : 'prev',
			'click #my-next' : 'next',
			'click #my-today' : 'today'
		},

		currentDay: null,
		backLimitDate: null,
		forwardLimitDate: null,
		personalEvents: null,//array com os ids dos eventos da agenda personalizada vindos do server
		currentEvents: null,

		$calendar: null,
		$teacherlink: null,
		$authorlink: null,
		$teacherlinkA: null,
		$authorlinkA: null,
		$eventlinkA: null,
		$locallinkA: null,
		$searchbasic: null,
		$paperscheck: null,
		$workshopscheck: null,
		$socialscheck: null,
		$searchpanel: null,

		initialize: function ()
		{
			_.bindAll(this);

			var self = this;
			//Data do dia em que estamos, para testes
			var d = 29;
			var m = 4;//meses no javascript date são de 0-11
			var y = 2013;
			this.date = new Date(y,m,d);

			//Limites em termos de datas, sempre + e - 3 dias do que esta definido, para testes
			//A definir que datas e como passa-las
			this.backLimitDate = new Date(y, m, d-3);
			this.forwardLimitDate = new Date(y, m, d+3);


			//Por enquanto para teste fica como utilizador 0 o utilizador do 
			//dispositivo, mas quando o registo/login estiver feito teremos
			//de passar o id correspondente
			//Modelo para de array + id da agenda personalizada de um utilizador, vindo do server
			this.personalAgenda = new PersonalAgenda({id: 0});

			this.personalLocalAgenda = new PersonalEvents();

			this.conferenceEvents = new EventCollection();	

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
			var that = this;

			var context = null;
			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			this.setElement($("[data-role=content]"));

			this.fullCalendarSetter(this.conferenceEvents);

			return this;

		},

		fullCalendarSetter: function(renderEvents)
		{
			var that = this;

			var selectedEvents = renderEvents || this.conferenceEvents;

			var treatedEvents = selectedEvents.map(this.treatEvents);

			$(document).ready(function() {
				
				
				$('#calendar').fullCalendar({
					height:4000,
					minTime: '8:00am',
					header: {
						//left: 'prev,next',
						right: ''
					},
					defaultView: 'agendaDay', 
					allDaySlot: false,
					titleFormat: '',
					slotMinutes: 10,
					editable: false,
					events: treatedEvents,
					eventClick: function(calEvent, jsEvent, view) {


				        console.log(this);

				        var currentEvent = that.conferenceEvents.getEventByName(calEvent.title);
				       	var attributes = currentEvent.attributes;

				       	that.setPopUp(attributes);

	    				$('#popupMenu').popup('open', { positionTo: this });
	    				
				   }
				});
				
				
			});

			//Definição de algumas tags para eficiência
			this.$calendar = $('#calendar');
			this.$teacherlink = $('#teacher-link');
			this.$authorlink = $('#author-link');
			this.$teacherlinkA = $('#teacher-link a');
			this.$authorlinkA = $('#author-link a');
			this.$eventlinkA = $('#event-link a');
			this.$locallinkA = $('#local-link a');
			this.$searchbasic = $("#search-basic");
			this.$paperscheck = $("#paperscheck");
			this.$workshopscheck = $("#workshopscheck");
			this.$socialscheck = $("#socialscheck");
			this.$searchpanel = $("#searchpanel");

			//Decide em que dia é que é apresentada a agenda
			if(this.currentDay !== null)
				this.$calendar.fullCalendar( 'gotoDate', this.currentDay );
			else
				this.$calendar.fullCalendar( 'gotoDate', this.date );
		},

		//Altera o popup consoante o tipo de evento
		setPopUp: function(attributes){
			var type = attributes.type;

			if(type === "paper")
			{
				this.$teacherlink.hide();
				this.$authorlinkA.attr("href", "#user/" + attributes.users_id_array[0]);
				this.$authorlink.show();
			}
			else if(type === "workshop")
			{
				this.$teacherlinkA.attr("href", "#user/" + attributes.users_id_array[0]);
				this.$teacherlink.show();
				this.$authorlink.hide();
			}
			else
			{
				this.$teacherlink.hide();
				this.$authorlink.hide();
			}

			this.$eventlinkA.attr("href", "#paper/" + attributes.id);
			this.$locallinkA.attr("href", "#local/" +  attributes.local_id);
		},


  		search: function() {
  			if(this.currentEvents !== null)
			{	//Fecha painel de pesquisa
				this.$searchpanel.panel( "close" );

				//Guarda o dia em que estava antes da pesquisa
				this.currentDay = this.$calendar.fullCalendar('getDate');

	  			var terms = this.$searchbasic.val().trim();
	  			var counter = 0;
	  			var papers = this.$paperscheck.is(':checked');
	  			var workshops= this.$workshopscheck.is(':checked');
	  			var socials = this.$socialscheck.is(':checked');
	  			var types = {paper: papers, workshop: workshops, social: socials};
	  			
	  			if(papers)
	  				counter+=1;

	  			if(workshops)
	  				counter+=1;

	  			if(socials)
	  				counter+=1;

	  			var stringResults = this.currentEvents.getEventsWithString(terms);
	  			var typeResults = [];
	  			var renderEvents = [];

	  			if(counter>0)
	  			{	
	  				typeResults = this.currentEvents.getEventsOfType(types, counter);		
	  			  	renderEvents = _.intersection(stringResults, typeResults);
	  			}
	  			else
	  				renderEvents = stringResults;
	  			
	  			this.$calendar.empty();
				this.fullCalendarSetter(renderEvents);
			}

  		},

		treatEvents: function(eventobj) {

			var eventAttrs = eventobj.attributes;
			var date = eventAttrs.hours.toString();

            var formattedDate = Moment(date);
            var year = formattedDate.local().format("YYYY");
            var month = formattedDate.local().format("MM");
            var day = formattedDate.local().format("DD");
            var hour = formattedDate.local().format("HH")-1;//estava a adiantar uma hora
            var minutes = formattedDate.local().format("mm");
			
			// data de começo, o mês tem de ser month-1, porque o date do javascript tem os meses de 0 a 11
			var start = new Date(year, month-1, day, hour, minutes);
			//duração do evento em minutos
			var duration = eventAttrs.duration;
			//duração do evento em horas
			var durationInHours = duration/60;

			// hora do final, é adicionado ao início as horas da duração 
			//(ex: passo-> 2.05, hour + 2 )
			var finalHour = hour + Math.floor(durationInHours);

			// minutos do finais, é adicionado ao início em minutos os minutos da duração 
			//(ex: passo-> 5.333333333333333, após (duration%1)-> 0.33333333333333304,
			//após (duration%1) * 60-> 19.999999999999982 , retorna-> minutes + 20 )
			var finalMinutes = parseInt(minutes) + Math.ceil((durationInHours%1) * 60);
			// data de final, o mês tem de ser month-1, porque o date do javascript tem os meses de 0 a 11
			var end = new Date(year, month-1, day, finalHour, finalMinutes);

			var color = this.getColor(eventAttrs.type);

			return {title: eventAttrs.name, start: start, end: end, eventBorderColor: color,
				backgroundColor: color, allDay:false};
		},

		getColor: function(type){
			if(type === "paper")
				return '#2c3e50';
			else if(type === "workshop")
				return '#16a085';
			else
				return '#8e44ad';
		},

		prev: function() {
			if(this.$calendar.fullCalendar('getDate') > this.backLimitDate)
				this.$calendar.fullCalendar('prev');
		},

		next: function() {
			if(this.$calendar.fullCalendar('getDate') < this.forwardLimitDate)
				this.$calendar.fullCalendar('next');
		},

		today: function() {
			this.$calendar.fullCalendar('today');
		},

		setCurrentEvents: function(newCurrentEvents) {
			this.currentEvents = newCurrentEvents;
		},

		renderGeneral: function() {
			this.setCurrentEvents(this.conferenceEvents);
			this.$calendar.empty();
			this.fullCalendarSetter(this.conferenceEvents);
		},

		renderPersonal: function() {

			//Se não tiver nada na local usa a do server para ver se tem alguma
			//coisa
			if(this.personalLocalAgenda.size() === 0)
			{	
				console.log("adding events to local agenda");
				this.personalEvents = this.conferenceEvents.getPersonalAgenda(this.personalAgenda.get("chosen_events"));
				for(i = 0; i < this.personalEvents.length; i++)
				{
					var eventAttr = this.personalEvents[i].attributes;
					var attrs = {
                    	id: eventAttr.id,
						name: eventAttr.name,
						hours: eventAttr.hours, 
						duration: eventAttr.duration,
						type: eventAttr.type,
						local_id: eventAttr.local_id,
						users_id_array: eventAttr.users_id_array
                	};
					this.personalLocalAgenda.create(attrs);
				}
			}

			this.setCurrentEvents(this.personalLocalAgenda);
			this.$calendar.empty();
			this.fullCalendarSetter(this.personalLocalAgenda);
		}


	});


});