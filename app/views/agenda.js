define([
    "jquery",
    "backbone",
    "handlebars",
    "fullcalendar",
    "views/basicview"
], function ($, Backbone, Handlebars, FullCalendar, BasicView) {

	return Backbone.View.extend({

		el: $("[data-role=content]"),

		id: "agenda-page",
		pageName: "Agenda",

		template: "agenda-template",

		events: {

			

		},

		initialize: function (args)
		{
			_.bindAll(this);


			var self = this;

			self.renderLayout();
			self.render();
			
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

			$(document).ready(function() {
				
				var date = new Date();
				var d = date.getDate();
				var m = date.getMonth();
				var y = date.getFullYear();
				
				$('#calendar').fullCalendar({
					height:4000,
					minTime: '8:00am',
					header: {
						left: 'prev,next today',
						right: 'agendaDay'
					},
					titleFormat: '',
					slotMinutes: 10,
					editable: false,
					events: [
						{
							title: 'All Day Event',
							start: new Date(y, m, 1)
						},
						{
							title: 'Long Event',
							start: new Date(y, m, d-5),
							end: new Date(y, m, d-2)
						},
						{
							id: 999,
							title: 'Repeating Event ',
							start: new Date(y, m, d-3, 16, 0),
							allDay: false
						},
						{
							id: 999,
							title: 'Repeating Event \n Sala1',
							start: new Date(y, m, d, 08, 00),
							end: new Date(y, m, d, 08, 10),
							allDay: false
						},
						{
							title: 'Meeting \n Sala3',
							start: new Date(y, m, d, 08, 30),
							end: new Date(y, m, d, 08, 50),
							backgroundColor: '#378006',
							allDay: false
						},
						{
							title: 'Lunch \n Sala 2',
							start: new Date(y, m, d, 08, 0),
							end: new Date(y, m, d, 11, 0),
							allDay: false
						},
						{
							title: 'Birthday Party',
							start: new Date(y, m, d+1, 19, 0),
							end: new Date(y, m, d+1, 22, 30),
							allDay: false
						},
						{
							title: 'Click for Google',
							start: new Date(y, m, 28),
							end: new Date(y, m, 29),
							url: 'http://google.com/'
						}
					],
					 eventClick: function(calEvent, jsEvent, view) {

				        //alert('Event: ' + calEvent.title);
				        //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
				        //alert('View: ' + view.name);

				        // change the border color just for fun
				        //$(this).css('border-color', 'red');

				    }
				});
				
				
			});

			return this;

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