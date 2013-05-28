define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "fullcalendar",
    "moment",
    "collections/events",
    "views/basicview"
], 

function ($, Backbone, _, Handlebars, FullCalendar, Moment, EventCollection, BasicView) {

	return BasicView.extend({

		//el: "div[data-role=content]",

		id: "agenda-page",
		pageName: "Agenda",

		template: "agenda-template",

		events: {
			'click #popupbutton' :  'popup',
			'click #searchsubmit' : 'search',
			'click #my-prev' : 'prev',
			'click #my-next' : 'next',
			'click #my-today' : 'today'
		},

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


		initialize: function ()
		{
			_.bindAll(this);

			var self = this;
			

			this.conferenceEvents = new EventCollection();
			
			
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

		popup: function(e) {
   			e.preventDefault();

   			$('#popupMenu').popup('open', { positionTo: "#popupbutton", transition: "slideup" });

  		},

  		search: function() {
  			var terms = this.$searchbasic.val().trim();
  			var counter = 0;
  			var papers = this.$paperscheck.is(':checked');
  			var workshops= this.$workshopscheck.is(':checked');
  			var socials = this.$socialscheck.is(':checked');
  			var types = {papers: papers, workshops: workshops, socials: socials};

  			if(papers)
  				counter+=1;

  			if(workshops)
  				counter+=1;

  			if(socials)
  				counter+=1;
  			console.log(terms);
  			var stringResults = this.conferenceEvents.getEventsWithString(terms);
  			var typeResults = [];
  			var renderEvents = [];

  			if(counter>0)
  			{	
  				typeResults = this.conferenceEvents.getEventsOfType(types, counter);		
  			  	renderEvents = _.intersection(stringResults, typeResults);
  			}
  			else
  				renderEvents = stringResults;
  			
  			this.$calendar.empty();
  			this.fullCalendarSetter(renderEvents);

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
			this.$calendar.fullCalendar('prev');
		},

		next: function() {
			this.$calendar.fullCalendar('next');
		},

		today: function() {
			this.$calendar.fullCalendar('today');
		},

		//remove o popup se este existir
		removePopUp: function(e) {
			var target =$(e.target);
			if(target.parents('.fc-event').length === 0)
				$('.menu').remove();

		}


	});


});