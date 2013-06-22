define("agenda/agendaview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "fullcalendar",
    "moment",
    "events/common/events",
    "./personalagenda",
    "./calendarview",
    "common/basicview",
    "app.config",

    "text!./agenda.html"
], 

function ($, Backbone, _, Handlebars, FullCalendar, Moment, EventCollection, PersonalAgenda, CalendarView, BasicView, App, AgendaTemplate) {

    /**
    View da página da agenda

    @class AgendaView
    @extends BasicView
    **/
    return BasicView.extend({

        /**
        Id da página da agenda

        @property id 
        @type String
        @static
        @readonly
        
        **/
        id: "agenda-page",

        /**
        Nome da página da agenda

        @property pageName 
        @type String
        @static
        @readonly
        
        **/     
        pageName: "Agenda",

        /**
        Template da agenda

        @property template 
        @type String
        @readonly
        @protected
        
        **/
        template: AgendaTemplate,

        /**
        Eventos lançados pela transição entre tabs,
        que representão a agenda geral e a agenda
        personalizada

        @property events
        @type Object
        @protected
        **/
        events: {
            'click #generalAgenda' : 'renderGeneral',
            'click #personalAgenda' : 'renderPersonal',
        },

        /**
        Modelo da agenda pessoal

        @property personalAgenda
        @type Backbone.Model
        @readonly
        @protected
        
        **/
        personalAgenda: null,

        /**
        Coleção dos eventos da conferência

        @property conferenceEvents
        @type Backbone.Collection
        @readonly
        @protected
        
        **/
        conferenceEvents: null,

        /**
        View que apresenta o tipo de agenda escolhido,
        neste caso ou é a agenda geral ou a personalizada

        @property calendarView
        @type Backbone.View
        @readonly
        @protected
        
        **/
        calendarView: null,

        /**
        Construtor da classe AgendaView. Faz o fecth da agenda personalizada,
        da coleção de eventos da conferência e faz o rendering da página

        @constructor
        @class AgendaView
        **/
        initialize: function ()
        {
            _.bindAll(this);

            var self = this;

console.log(App.account.isLogged());
            if(App.account.isLogged())
            {

                this.personalAgenda = new PersonalAgenda({id: App.account.getUserId(), Personal: true});

                this.personalAgenda.fetch({
                    success: function () {
                        console.log("Personal Events loaded");
                    },
                    error: function (){
                        console.log("Fail to get events or don't have any");
                    }
                });
            }
            else
              this.personalAgenda = new PersonalAgenda({id: 0, Personal: true});

            this.conferenceEvents = new EventCollection();  

            this.conferenceEvents.fetch().done(function () {
                self.renderLayout();
                self.render();
                
               });


        },

        /**
        Faz o rendering do layout base da página da agenda

        @method render
        @protected
        @chainable
        **/
        render: function () {

            var context = null;
            var html = this.compileTextTemplate(this.template, context);

            $("[data-role=content]").append(html);
            this.enhanceJQMComponentsAPI();

            this.setElement($("[data-role=content]"));
            this.calendarView = new CalendarView({toShowEvents: this.conferenceEvents, personalEvents: this.personalAgenda, inPersonal: false});


            return this;

        },


        /**
        Faz o rendering do calendário com todos os eventos da conferência

        @method renderGeneral
        @protected
        **/
        renderGeneral: function() {
            this.calendarView.undelegateEvents();
            this.calendarView = new CalendarView({toShowEvents: this.conferenceEvents, personalEvents: this.personalAgenda, inPersonal: false}) ;
        },

        /**
        Faz o rendering do calendário com todos os eventos da agenda personalizada

        @method renderPersonal
        @protected
        **/
        renderPersonal: function() {
            if(App.account.isLogged())
            {

                this.calendarView.undelegateEvents();
                var personalLocalAgenda = new EventCollection({isPersonal: true});

                //quando se cria uma collection por alguma razão já vem com um elemento com defaults
                //daí o reset
                personalLocalAgenda.reset();
                var modelsArray = this.conferenceEvents.getEventsFromIdArray(this.personalAgenda.get("chosen_events")); 
                personalLocalAgenda.add(modelsArray);

                this.calendarView = new CalendarView({toShowEvents: personalLocalAgenda, personalEvents: this.personalAgenda, inPersonal: true}) ;
            }
            else
                this.showErrorOverlay({text:App.MSG.REGISTRATION_NEEDED});
        },




    });


});