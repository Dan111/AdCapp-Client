define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "fullcalendar",
    "moment",
    "collections/events",
    "models/personalagenda",
    "views/basicview"
], 

function ($, Backbone, _, Handlebars, FullCalendar, Moment, EventCollection, PersonalAgenda, BasicView) {

	return BasicView.extend({

		el: "#calendar-placeholder", //para inserir os elementos na página
		id: "calendar-placeholder", //para fazer refresh do jqm

		template: "calendar-partial",

		events: {
			'click #searchsubmit' : 'search',
			'click #my-prev' : 'prev',
			'click #my-next' : 'next',
			'click #my-today' : 'today'
		},

		isOtherUserAgenda: null,
		currentDay: null,
		backLimitDate: null,
		forwardLimitDate: null,
		currentEvents: null,

		$calendar: null,
		$removeevent: null,
		$addevent: null,
		$removeeventbutton: null,
		$addeventbutton: null,
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
		$popup: null,

		initialize: function (args)
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

			this.generalEvents = args.generalEvents;
			this.personalEvents = args.personalEvents;
			this.isOtherUserAgenda = args.isOtherUserAgenda;
			this.isInPersonal = false;

			this.render();

		},


		render: function () {

			var context = null;
			var html = this.compileTemplate(this.template, context);

			//$("#calendar-placeholder").append(html);
			this.enhanceJQMComponentsAPI();

			//this.setElement($("#calendar-placeholder"));

			if(this.isOtherUserAgenda)
			{
				this.fullCalendarSetter(this.personalEvents);
				this.setCurrentEvents(this.personalEvents);
			}
			else
			{
				this.fullCalendarSetter(this.generalEvents);
				this.setCurrentEvents(this.generalEvents);
			}

			return this;

		},

		fullCalendarSetter: function(renderEvents)
		{
			var that = this;

			var selectedEvents = renderEvents;

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
					eventRender: function(event, element) {
						if(event.imageurl !== "")
					        element.find("div.fc-event-time").append("<img src='" + event.imageurl +"' width='12' height='12'>");
					},
					eventClick: function(calEvent, jsEvent, view) {

				        var currentEvent = that.currentEvents.getEventByName(calEvent.title);
				       	var attributes = currentEvent.attributes;

				       	that.setPopUp(attributes);
				       	
				       	//A cada popup temos de fazer unbind e bind dos eventos de click
				       	// nos butões de remover e adicionar evento à agenda pessoal
				       	//O unbind antes do bind previne a chamada de multiplas vezes seguidas
				       	// do evento em questão
				       	if(!this.isOtherUserAgenda)
				       	{
							$('#popupMenu').on( "popupafteropen", function( event, ui ) { 
								$("#remove-event-button").unbind("click").bind("click", function(event){
									
	  								that.removeEvent();
								});

								$("#add-event-button").unbind("click").bind("click", function(event){
	  								that.addEvent();
								});
							});
						}



	    				$('#popupMenu').popup('open', { positionTo: this });
	    				
				   }
				});
				
				
			});

			//Definição de algumas tags para eficiência
			this.$calendar = $('#calendar');
			this.$removeevent = $('#remove-event');
			this.$addevent = $('#add-event');
			this.$removeeventbutton = $("#remove-event-button");
			this.$addeventbutton = $("#add-event-button");
			this.$teacherlink = $('#teacher-link');
			this.$authorlink = $('#author-link');
			this.$teacherlinkA = $('#teacher-link a');
			this.$authorlinkA = $('#author-link a');
			this.$eventlinkA = $('#event-link a');
			this.$locallinkA = $('#local-link a');
			this.$searchbasic = $('#search-basic');
			this.$paperscheck = $('#paperscheck');
			this.$workshopscheck = $('#workshopscheck');
			this.$socialscheck = $('socialscheck');
			this.$searchpanel = $('#searchpanel');
			this.$popup = $('#popupMenu');

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

			if(!this.isOtherUserAgenda)
			{
				//Verfica se tem de colocar no popup o botão de remover ou adicionar evento
				if(this.personalEvents.hasEvent(attributes.id))
				{
					this.$removeevent.show();
					this.$removeeventbutton.attr("value", attributes.id);
					this.$addevent.hide();
				}
				else
				{
					this.$removeevent.hide();
					this.$addevent.show();
					this.$addeventbutton.attr("value", attributes.id);
				}
			}
			else
			{
				this.$removeevent.hide();
				this.$addevent.hide();
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
	  				typeResults = this.currentEvents.getEventsOfType(types);		
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
			var imageurl = "";

			if(this.personalEvents.hasEvent(eventAttrs.id) && !this.isOtherUserAgenda)
				imageurl = "assets/star_white.gif";

			return {title: eventAttrs.name, start: start, end: end, eventBorderColor: color,
				backgroundColor: color, allDay:false, imageurl: imageurl};
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
			this.setCurrentEvents(this.generalEvents);
			this.$calendar.empty();
			this.fullCalendarSetter(this.generalEvents);
			this.isInPersonal = false;
		},

		renderPersonal: function() {
			this.setCurrentEvents(this.personalEvents);
			this.$calendar.empty();
			this.fullCalendarSetter(this.personalEvents);
			this.isInPersonal = true;
		},

		removeEvent: function() {
			var eventId = this.$removeeventbutton.attr("value").trim();
			console.log("remove "+eventId);

			//Guarda o dia em que estava antes da pesquisa
			this.currentDay = this.$calendar.fullCalendar('getDate');

			this.personalEvents.removeEvent(parseInt(eventId));
			this.$popup.popup('close');

			if(!this.isOtherUserAgenda)
			{
				if(this.isInPersonal)
					this.renderPersonal();
				else
					this.renderGeneral();
			}
		},

		addEvent: function() {
			var eventId = this.$addeventbutton.attr("value").trim();
			console.log("add "+eventId);

			//Guarda o dia em que estava antes da pesquisa
			this.currentDay = this.$calendar.fullCalendar('getDate');

			var eventAttr = this.generalEvents.hasEvent(parseInt(eventId)).attributes;
			this.personalEvents.addEvent(eventAttr);

			this.$popup.popup('close');

			if(!this.isOtherUserAgenda)
			{
				if(this.isInPersonal)
					this.renderPersonal();
				else
					this.renderGeneral();
			}
		}

	});

});