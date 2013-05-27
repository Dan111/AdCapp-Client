define([
    "jquery",
    "backbone",
    "handlebars",
    "fullcalendar",
    "collections/events",
    "views/basicview"
], function ($, Backbone, Handlebars, FullCalendar, EventCollection, BasicView) {

	return Backbone.View.extend({

		el: $("[data-role=content]"),

		id: "agenda-page",
		pageName: "Agenda",

		template: "agenda-template",

		events: {
			'click' : 'removestuff',
			'click #my-prev' : 'prev',
			'click #my-next' : 'next',
			'click #my-today' : 'today'
		},

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

				        //alert('Event: ' + calEvent.title);
				        //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
				        //alert('View: ' + view.name);

				        // change the border color just for fun
				        //$(this).css('border-color', 'red');
				        console.log(this);

				        //$(".fc-event-bg").find(".menu").remove();
				        $(".menu").remove();
				        //if($(".fc-event-bg").find(".menu").length === 0)
					    //{  
				    	$("#calendar").parent().append('<div class="menu">'
						       + '<ul id="options">'
						          +  '<li><a href="#">View details</a></li>'
						          +  '<li><a href="#">Edit</a></li>'
						          +  '<li><a href="#">Disable</a></li>'
						          +  '<li><a href="#">Delete</a></li>'
						       + '</ul>'
				        	+'</div>');
	    				//}
	    				//else
	    					//console.log("dafuq"); 
	    				var xx = jsEvent.pageX + 120 > $(window).width() ? $(window).width() - 190 : jsEvent.pageX;  
	    					$("#options").offset({ top: jsEvent.pageY, left: xx });
	    				
				   }
				});
				
				
			});

			return this;

		},

		treatEvents: function(eventobj) {
			var eventAttrs = eventobj.attributes;
			// data de começo, o mês tem de ser month-1, porque o date do javascript tem os meses de 0 a 11
			var start = new Date(eventAttrs.year, eventAttrs.month-1, eventAttrs.day, 
				eventAttrs.hour, eventAttrs.minutes);
			//duração do evento do tipo hora.minutos (ex: 5.333333333333333)
			var duration = eventAttrs.duration;

			// hora do final, é adicionado ao início as horas da duração 
			//(ex: passo-> 5.333333333333333, retorna-> eventAttrs.hour + 5 )
			var finalHour = eventAttrs.hour + Math.floor(duration);

			// minutos do finais, é adicionado ao início em minutos os minutos da duração 
			//(ex: passo-> 5.333333333333333, após (duration%1)-> 0.33333333333333304,
			//após (duration%1) * 60-> 19.999999999999982 , retorna-> eventAttrs.minutes + 20 )
			var finalMinutes = eventAttrs.minutes + Math.ceil((duration%1) * 60);

			// data de final, o mês tem de ser month-1, porque o date do javascript tem os meses de 0 a 11
			var end = new Date(eventAttrs.year, eventAttrs.month-1, eventAttrs.day, 
				finalHour, finalMinutes);

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
			$("#calendar").fullCalendar('prev');
		},

		next: function() {
			$("#calendar").fullCalendar('next');
		},

		today: function() {
			$("#calendar").fullCalendar('today');
		},

		removestuff: function(e) {

			console.log(e);
			var target =$(e.target);
			if(target.parents('.fc-event').length === 0)
				$('.menu').remove();

		},

		enhanceJQMComponentsAPI: function () {
    // changePage
             $.mobile.changePage("#" + this.id, {
                 changeHash: false
             });

             $("#" + this.id).trigger("create");
         },
    // Add page to DOM
         removePreviousPageFromDOM: function () {
             // $("main").append($(this.el));
             // $("#profile").page();
             $("[data-role=page]:first").remove();
         }


	});


});