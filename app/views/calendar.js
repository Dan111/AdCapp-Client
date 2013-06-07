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
		$searchpanel: null,
		$popup: null,

		typesInfo: {"paper": {color: '#2c3e50'}, "workshop": {color: '#16a085'}, "social": {color: '#8e44ad'}, "keynote": {color: '#2ecc71'}},

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

			this.toShowEvents = args.toShowEvents;
			this.personalEvents = args.personalEvents;
			this.inPersonal = args.inPersonal;//Foi necessário passar este booleano, já que não consegui arranjar uma
											  //solução viável de outra forma


			this.hasDifferences = this.toShowEvents.getDifferences(this.personalEvents.get("chosen_events"));


			this.render();
		},


		render: function () {

			$("#calendar").empty();

			var context = null;
			var html = this.compileTemplate(this.template, context);

			this.enhanceJQMComponentsAPI();


			this.fullCalendarSetter(this.toShowEvents);


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

				        var currentEvent = that.toShowEvents.getEventByName(calEvent.title);
				       	var attributes = currentEvent.attributes;

				       	that.setPopUp(attributes);
				       	
				       	//A cada popup temos de fazer unbind e bind dos eventos de click
				       	// nos butões de remover e adicionar evento à agenda pessoal
				       	//O unbind antes do bind previne a chamada de multiplas vezes seguidas
				       	// do evento em questão
						$('#popupMenu').on( "popupafteropen", function( event, ui ) { 
							$("#remove-event-button").unbind("click").bind("click", function(event){
								
  								that.removeEvent();
  								
  								if(!that.inPersonal)
  								{
  									calEvent.imageurl=null;
  									$('#calendar').fullCalendar('updateEvent', calEvent);
  								}
  								else //se estiver na personalizada remove o evento do calendario
  									$('#calendar').fullCalendar('removeEvents',calEvent._id);
							});

							$("#add-event-button").unbind("click").bind("click", function(event){
  								that.addEvent();

  								if(!that.inPersonal)
  								{
  									calEvent.imageurl="assets/star_white.gif";
  									$('#calendar').fullCalendar('updateEvent', calEvent);
  								}	
							});
						});

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


			this.$eventlinkA.attr("href", "#paper/" + attributes.id);
			this.$locallinkA.attr("href", "#local/" +  attributes.local_id);
		},


  		search: function() {

  			if(this.toShowEvents !== null)
			{	//Fecha painel de pesquisa
				this.$searchpanel.panel( "close" );
				//Guarda o dia em que estava antes da pesquisa
				this.currentDay = this.$calendar.fullCalendar('getDate');

	  			var terms = this.$searchbasic.val().trim();
	  			var counter = 0;
				var types = {};

				_.chain(this.typesInfo)
				 .pairs(this.typesInfo)
	  			 .each(function (pair){
	  				var idString = "#"+pair[0];
	  				var checkValue = $('fieldset').find(idString).is(':checked');
	  				types[pair[0]] = checkValue;

	  				if(checkValue)
	  					counter+=1;
	  			});

	  			console.log(types);
	  			

	  			var stringResults = this.toShowEvents.getEventsWithString(terms);
	  			var typeResults = [];
	  			var renderEvents = [];

	  			if(counter>0)
	  			{	
	  				typeResults = this.toShowEvents.getEventsOfType(types);		
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

            var x = Moment(date);


   //          var year = formattedDate.utc().format("YYYY");
   //          var month = formattedDate.utc().format("MM");
   //          var day = formattedDate.utc().format("DD");
   //          var hour = formattedDate.utc().format("HH")-1;//estava a adiantar uma hora
   //          var minutes = formattedDate.utc().format("mm");
			
			// // data de começo, o mês tem de ser month-1, porque o date do javascript tem os meses de 0 a 11
			// var start = new Date(Date.UTC(year, month-1, day, hour, minutes,0,0));
			// //duração do evento em minutos
			var duration = eventAttrs.duration;
			// //duração do evento em horas
			// var durationInHours = duration/60;

			// // hora do final, é adicionado ao início as horas da duração 
			// //(ex: passo-> 2.05, hour + 2 )
			// var finalHour = hour + Math.floor(durationInHours);

			// // minutos do finais, é adicionado ao início em minutos os minutos da duração 
			// //(ex: passo-> 5.333333333333333, após (duration%1)-> 0.33333333333333304,
			// //após (duration%1) * 60-> 19.999999999999982 , retorna-> minutes + 20 )
			// var finalMinutes = parseInt(minutes) + Math.ceil((durationInHours%1) * 60);
			// data de final, o mês tem de ser month-1, porque o date do javascript tem os meses de 0 a 11
			//var end = new Date(Date.UTC(year, month-1, day, finalHour, finalMinutes,0,0));

			var color = this.getColor(eventAttrs.type);
			var imageurl = "";

			if(this.personalEvents.hasEvent(eventAttrs.id))
				imageurl = "assets/star_white.gif";

			return {title: eventAttrs.name, start: x.utc().format("YYYY-MM-DDTHH:mm:SS"), 
						end: x.add('minutes',duration).utc().format("YYYY-MM-DDTHH:mm:SS"), eventBorderColor: color,
				backgroundColor: color, allDay:false, imageurl: imageurl};
		},

		getColor: function(type){
			return this.typesInfo[type].color;
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


		removeEvent: function() {
			var eventId = this.$removeeventbutton.attr("value").trim();
			console.log("remove "+eventId);

			//Guarda o dia em que estava antes da pesquisa
			this.currentDay = this.$calendar.fullCalendar('getDate');

			//remove na collection se estiver na pessoal
			if(this.inPersonal)
				this.toShowEvents.hasEvent(parseInt(eventId)).destroy;

			//remove no modelo com o array
			this.personalEvents.removeEvent(parseInt(eventId));
			this.personalEvents.save();


			this.$popup.popup('close');

		},

		addEvent: function() {
			var eventId = this.$addeventbutton.attr("value").trim();
			console.log("add "+eventId);

			//Guarda o dia em que estava antes da pesquisa
			this.currentDay = this.$calendar.fullCalendar('getDate');

			this.personalEvents.addEvent(parseInt(eventId));
			this.personalEvents.save();

			this.$popup.popup('close');

		}

	});

});