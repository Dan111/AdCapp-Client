define([
    "jquery",
    "backbone",
    "handlebars",
    "fullcalendar",
    "moment",
    "collections/events",
    "views/basicview"
], function ($, Backbone, Handlebars, FullCalendar, Moment, EventCollection, BasicView) {

	return BasicView.extend({

		el: "div[data-role=content]",

		id: "agenda-page",
		pageName: "Agenda",

		template: "agenda-template",

		events: {
			'click' : 'removePopUp',
			'click #my-prev' : 'prev',
			'click #my-next' : 'next',
			'click #my-today' : 'today'
		},

		$calendar: null,

		initialize: function ()
		{
			_.bindAll(this);

			var self = this;
			

			this.conferenceEvents = new EventCollection();
			console.log(this.conferenceEvents);

			this.conferenceEvents.fetch({
				success: function () {
					self.renderLayout();
					self.render();
				}
			});

			//this.$calendar = $("#calendar");
			
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

		compileTemplate: function (templateName, context) {

			var source   = $("#" + templateName).html();
			var template = Handlebars.compile(source);
			var html = template(context);

			return html;

		},


		render: function () {
			var that = this;

			var context = null;
			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			this.setElement($("[data-role=content]"));

			var treatedEvents = this.conferenceEvents.map(this.treatEvents);



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

				    	that.$calendar.parent().append(that.getHtml(attributes));

	    				var xx = jsEvent.pageX + 160 > $(window).width() ? $(window).width() - 190 : jsEvent.pageX;  
	    				$("#options").offset({ top: jsEvent.pageY, left: xx });
	    				
				   }
				});
				
				
			});

			this.$calendar = $('#calendar');

			return this;

		},

		//Dependendo do tipo do evento retorna o html de uma lista de opções
		getHtml: function(attributes){
			var type = attributes.type;
			
			if(type === "paper")
				return '<div class="menu">'
						       + '<ul id="options">'
						          +  '<li><a href="#paper/'+attributes.id+'"">Página Evento</a><i class="icon-chevron-right"></i></li>'
						          +  '<li><a href="#user/'+attributes.users_id_array[0]+'">Autor</a><i class="icon-chevron-right"></i></li>'
						          +  '<li><a href="#local'+attributes.local_id+'">Local</a><i class="icon-chevron-right"></i></li>'
						       + '</ul>'
				        	+'</div>';
			else if(type === "workshop")
				return '<div class="menu">'
						       + '<ul id="options">'
						          +  '<li><a href="#workshop/'+attributes.id+'"">Página Evento</a><i class="icon-chevron-right"></i></li>'
						          +  '<li><a href="#user/'+attributes.users_id_array[0]+'">Responsável</a><i class="icon-chevron-right"></i></li>'
						          +  '<li><a href="#local'+attributes.local_id+'">Local</a><i class="icon-chevron-right"></i></li>'
						       + '</ul>'
				        	+'</div>';
			else
				return '<div class="menu">'
						       + '<ul id="options">'
						          +  '<li><a href="#social/'+attributes.id+'"">Página Evento</a><i class="icon-chevron-right"></i></li>'
						          +  '<li><a href="#local'+attributes.local_id+'">Local</a><i class="icon-chevron-right"></i></li>'
						       + '</ul>'
				        	+'</div>';
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