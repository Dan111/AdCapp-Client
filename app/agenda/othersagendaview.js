define("agenda/othersagendaview",
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

    "text!./othersagenda.html"
], 

function ($, Backbone, _, Handlebars, FullCalendar, Moment, EventCollection, PersonalAgenda, CalendarView, BasicView, App, OthersAgendaTemplate) {

    /**
    View da página da agenda de outro utilizador

    @class OthersAgendaView
    @extends BasicView
    **/
    return BasicView.extend({

        /**
        Id da página da agenda de outro utilizador

        @property id 
        @type String
        @static
        @final
        @default "others-agenda-page"
        **/
        id: "others-agenda-page",

        /**
        Nome da página da agenda de outro utilizador

        @property pageName 
        @type String
        @static
        @final
        @default "Agenda Pessoal"
        **/     
        pageName: "Agenda Pessoal",

        /**
        Template da agenda de outro utilizador

        @property template 
        @type template
        @final
        @protected
        @default OthersAgendaTemplate
        **/
        template: OthersAgendaTemplate,


        /**
        Modelo da agenda pessoal

        @property personalAgenda
        @type Backbone.Model
        @final
        @protected
        @default null
        **/
        personalAgenda: null,

        /**
        Coleção dos eventos da conferência

        @property conferenceEvents
        @type Backbone.Collection
        @final
        @protected
        @default null
        **/
        conferenceEvents: null,

        /**
        View que apresenta o tipo de agenda escolhido,
        neste caso ou é a agenda geral ou a personalizada

        @property calendarView
        @type Backbone.View
        @final
        @protected
        @default null
        **/
        calendarView: null,

        /**
        Construtor da classe AgendaView. Faz o fecth da agenda personalizada,
        da coleção de eventos da conferência e faz o rendering da página

        @constructor
        @class AgendaView
        **/
        initialize: function (args)
        {
            _.bindAll(this);

            var self = this;

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
                console.log("general Events loaded");
               });

            this.otherPersonalAgenda = new PersonalAgenda({id: args.userId, Personal: false});

            this.otherPersonalAgenda.fetch({
                success: function () {
                    console.log("Other personal Events loaded");
                    self.renderLayout();
                    self.render();
                },
                error: function (){
                    console.log("Other Fail to get events or don't have any");
                }
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
            
            //this.calendarView.undelegateEvents();
            var OtherAgenda = new EventCollection();

            //quando se cria uma collection por alguma razão já vem com um elemento com defaults
            //daí o reset
            
            OtherAgenda.reset();
            var modelsArray = this.conferenceEvents.getEventsFromIdArray(this.otherPersonalAgenda.get("chosen_events")); 
            OtherAgenda.add(modelsArray);

            this.calendarView = new CalendarView({toShowEvents: OtherAgenda, personalEvents: this.personalAgenda, inPersonal: false}) ;


            return this;

        },




    });


});