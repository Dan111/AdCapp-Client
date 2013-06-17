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

	/**
    View dos calendários

    @class CalendarView
    @extends BasicView
    **/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados os calendários

		@property el 
		@type String
		@static
		@final
		@default "#calendar-placeholder"
		**/
		el: "#calendar-placeholder",

		/**
        Id do elemento onde está o calendário, para fazer refresh 
        do jquery mobile

        @property id 
        @type String
        @static
        @final
        @default "calendar-placeholder"
        **/
		id: "calendar-placeholder",

        /**
        Template do calendário

        @property template 
        @type String
        @final
        @protected
        @default "calendar-partial"
        **/
		template: "calendar-partial",

		events: {
			'click #my-prev' : 'prev',
			'click #my-next' : 'next',
			'click #my-today' : 'today'
		},

 		/**
        Dia corrente

        @property currentDay
        @type Date
        @protected
        @default null
        **/
		currentDay: null,

 		/**
        Dia limite para fazer prev no calendário

        @property backLimitDate
        @type Date
        @protected
        @default null
        **/
		backLimitDate: null,

 		/**
        Dia limite para fazer next no calendário

        @property forwardLimitDate
        @type Date
        @protected
        @default null
        **/
		forwardLimitDate: null,

 		/**
        Elemento do calendário

        @property $calendar
        @type jQueryWrapper
        @protected
        @default null
        **/
		$calendar: null,

 		/**
        Elemento de remoção de evento do calendário

        @property $removeevent
        @type jQueryWrapper
        @protected
        @default null
        **/
		$removeevent: null,

 		/**
        Elemento de adição de evento do calendário

        @property $addevent
        @type jQueryWrapper
        @protected
        @default null
        **/
		$addevent: null,

		/**
        Elemento do botão de remoção de evento do calendário

        @property $removeeventbutton
        @type jQueryWrapper
        @protected
        @default null
        **/
		$removeeventbutton: null,

		/**
        Elemento do botão de adição de evento do calendário

        @property $addeventbutton
        @type jQueryWrapper
        @protected
        @default null
        **/
		$addeventbutton: null,

		/**
        Elemento do link para o perfil do orientador do workshop

        @property $teacherlink
        @type jQueryWrapper
        @protected
        @default null
        **/
		$teacherlink: null,

		/**
        Elemento do link para o perfil do autor de um paper

        @property $authorlink
        @type jQueryWrapper
        @protected
        @default null
        **/
		$authorlink: null,

		/**
        Elemento anchor do link para o perfil do orientador do workshop

        @property $teacherlinkA
        @type jQueryWrapper
        @protected
        @default null
        **/
		$teacherlinkA: null,

		/**
        Elemento anchor do link para o perfil do autor de um paper

        @property $authorlinkA
        @type jQueryWrapper
        @protected
        @default null
        **/
		$authorlinkA: null,

		/**
        Elemento anchor do link para a página de um evento

        @property $eventlinkA
        @type jQueryWrapper
        @protected
        @default null
        **/
		$eventlinkA: null,

		/**
        Elemento anchor do link para a página de um local

        @property $locallinkA
        @type jQueryWrapper
        @protected
        @default null
        **/
		$locallinkA: null,

		/**
        Elemento input onde são digitadas pesquisas

        @property $searchbasic
        @type jQueryWrapper
        @protected
        @default null
        **/
		$searchbasic: null,

		/**
        Elemento onde está o painel de pesquisa

        @property $searchpanel
        @type jQueryWrapper
        @protected
        @default null
        **/
		$searchpanel: null,

		/**
        Elemento relativo aos pop-up's

        @property $popup
        @type jQueryWrapper
        @protected
        @default null
        **/
		$popup: null,

		/**
        Dicionário que guarda informações relativas aos tipos de
        eventos possíveis

        @property typesInfo
        @type Object
        @static
        @final
        @protected
        @default {"paper": {color: '#2c3e50', url: '#paper/'}, "workshop": {color: '#16a085', url: '#workshop/'}, 
					"social": {color: '#8e44ad', url: '#social/'}, "keynote": {color: '#2ecc71', url: '#keynote/'},
					"session": {url: '#sessions/'}};
        **/

		typesInfo: app.TYPESINFO,


		/**
        Construtor da classe CalendarView. Inicializa a collection,
        o modelo, um booleano e as datas usadas.
		Neste contrutor é feito o rendering e o binding do método search
		ao evento close do painel de pesquisa

        @constructor
        @protected
        @class CalendarView
        @param {Object} args collection de eventos, model de agenda e booleano
			@param {EventCollection} args.toShowEvents Eventos a serem apresentados no calendário, Collection de Events
			@param {PersonalAgenda} args.personalEvents Agenda pessoal, um Model personalagenda
			@param {boolean} args.inPersonal Booleano que indica se estamos a atuar na agenda
			personalizada do utilizador do dispositivo
        **/
		initialize: function (args)
		{
			_.bindAll(this);

			var self = this;
			//Data do dia em que estamos, para testes
			var d = 6;
			var m = 8;//meses no javascript date são de 0-11
			var y = 2012;
			this.date = new Date(y,m,d);

			//Limites em termos de datas, sempre + e - 3 dias do que esta definido, para testes
			//A definir que datas e como passa-las
			this.backLimitDate = new Date(y, m, d-3);
			this.forwardLimitDate = new Date(y, m, d+3);

			this.toShowEvents = args.toShowEvents;
			this.personalEvents = args.personalEvents;
			this.inPersonal = args.inPersonal;//Foi necessário passar este booleano, já que não consegui arranjar uma
											  //solução viável de outra forma

			//Adicona ao evento close do painel de pesquisa
			//a invocação da pesquisa
			var that = this;
			$( "#searchpanel" ).panel({
  				close: function( event, ui ) {that.search();}
			});


			this.render();
		},

        /**
        Faz o rendering do calendar, com a ajuda o método fullCalendarSetter
		passando a coleção de eventos a mostrar

        @method render
        @protected
        @chainable
        **/
		render: function () {

			$("#calendar").empty();

			var context = null;
			var html = this.compileTemplate(this.template, context);

			this.enhanceJQMComponentsAPI();

			this.fullCalendarSetter(this.toShowEvents);

			var that = this;
			$(window).off( "swipeleft");
			$(window).off( "swiperight");
			$(window).on( "swipeleft",  function( event ) { that.next(); } );
			$(window).on( "swiperight",  function( event ) { that.prev(); } );

			return this;

		},

		/**
        Cria o calendário com os eventos passados, trata do binding
        de métodos a eventos relacionados com pop-up's e adição
        e remoção de eventos, inicializa as variáveis jquery para maior
        eficiência e decide em que dia o calendário é apresentado.

        @method fullCalendarSetter
        @protected
        @param {EventCollection} renderEvents colecção de eventos
        **/
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

		/**
        Altera o conteúdo de um pop-up consoante os atributos de um evento

        @method setPopUp
        @protected
        @param {Object} attributes atributos de um evento
        @example
        	{	
        		id: 1,
			    type_id: 1,
			    name: "Data Management",
				hours: "2013-05-29T08:00:00Z", 
				duration": 20, 
				type: "paper",
				local_id: 1,
				users_id_array: [1]
			}
        **/
		setPopUp: function(attributes){
			var type = attributes.type.toLowerCase();

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
			//Vê o tipo do evento e vai ao typesInfo buscar a url correcta
			var url = this.typesInfo[type].url;

			this.$eventlinkA.attr("href", url + attributes.type_id);
			this.$locallinkA.attr("href", "#local/" +  attributes.local_id);
		},

		/**
        Faz a filtragem de eventos a mostrar no calendário, consoante
        a informação vinda do template, ou seja, dos elementos input

        @method search
        @protected
        **/
  		search: function() {
  			if(this.toShowEvents !== null)
			{	
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

		/**
        Trata da informação de um evento, para este ser passado para o
        calendário

        @method treatEvents
        @protected
        @param {EventModel} eventobj modelo de um evento
        **/
		treatEvents: function(eventobj) {

			var dateFormat = "YYYY-MM-DDTHH:mm:SS";

			var eventAttrs = eventobj.attributes;

  			var date = eventAttrs.hours.toString();
            var startDate = Moment(date);
		   	var duration = eventAttrs.duration;

			var color = this.getColor(eventAttrs.type.toLowerCase());
			var imageurl = "";

		   	if(this.personalEvents.hasEvent(eventAttrs.id))
		    	imageurl = "assets/star_white.gif";


		    return {title: eventAttrs.name, start: startDate.utc().format(dateFormat), 
		       		end: startDate.add('minutes',duration).utc().format(dateFormat), eventBorderColor: color,
		    		backgroundColor: color, allDay:false, imageurl: imageurl};

		},

		/**
        Retorna a cor de um evento consoante o seu tipo

        @method getColor
        @protected
        @param {String} type tipo de um evento
        @return {String} cor do tipo de evento
        **/
		getColor: function(type){
			
			return this.typesInfo[type].color;
		},

		/**
        Anda um dia para trás no calendário, consoante os limites

        @method prev
        @protected
        **/
		prev: function() {

			if(this.$calendar.fullCalendar('getDate') > this.backLimitDate)
				this.$calendar.fullCalendar('prev');

		},

		/**
        Anda um dia para a frente no calendário, consoante os limites

        @method next
        @protected
        **/
		next: function() {
			if(this.$calendar.fullCalendar('getDate') < this.forwardLimitDate)
				this.$calendar.fullCalendar('next');
		},

		/**
        Muda o dia visível do calendário, para o dia corrente, se este estiver
        nos limites dos dias da conferência

        @method today
        @protected
        **/
		today: function() {
			var today = new Date();
			if(today < this.forwardLimitDate && today > this.backLimitDate)
				this.$calendar.fullCalendar('today');
		},

		/**
        Remove um evento da agenda pessoal do utilizador do dispositivo

        @method removeEvent
        @protected
        **/
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
			
			this.personalEvents.sendPersonalAgenda();

			this.$popup.popup('close');

		},

		

		/**
        Adciona um evento à agenda pessoal do utilizador do dispositivo

        @method addEvent
        @protected
        **/
		addEvent: function() {
			var eventId = this.$addeventbutton.attr("value").trim();
			console.log("add "+eventId);

			//Guarda o dia em que estava antes da pesquisa
			this.currentDay = this.$calendar.fullCalendar('getDate');

			this.personalEvents.addEvent(parseInt(eventId));
			this.personalEvents.save();
			
			this.personalEvents.sendPersonalAgenda();

			this.$popup.popup('close');

		}

	});

});