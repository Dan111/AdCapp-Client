define("feedback/feedbackview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "common/basicview",
    "./feedback",
    "app.config",

    "text!./feedback.html"
], function ($, Backbone, _, Handlebars, BasicView, Feedback, App, FeedbackTemplate) {

    /**
    View do menu de feedback

    @class feedback.FeedbackView
    @alternateClassName FeedbackView
    @extends BasicView
    **/
	return BasicView.extend({

        /**
        ID usado pelo div que contém a página

        @property id 
        @type String
        @static
        @readonly
        @private
        **/
        id: "feedback-page",


        /**
        Nome da página, apresentado no header

        @property pageName 
        @type String
        @static
        @readonly
        @private
        **/
        pageName: "Feedback",


        /**
        Template usado pela página

        @property template 
        @type String
        @static
        @readonly
        @private
        **/
        template: FeedbackTemplate,


        /**
        Definição dos listeners dos eventos

        @property events
        @type Object
        @static
        @readonly
        @private
        **/
        events: {

        },


        /**
        Inicializa a página de feedback. 

        @constructor
        **/
        initialize: function () {

            _.bindAll(this);

            this.feedback = new Feedback({id: 1});

            var self = this;
            this.feedback.fetch().done(
                function () {
                    self.renderLayout();
                    self.setElement($(self.mainContainer));
                    self.render();
                    self.isWifiActive();
                }
            );

        },


        /**
        Faz o rendering da página de feedback.

        @method render
        @chainable
        **/
        render: function () {

            var context = {
                email: App.confEmail,
                forms: this.feedback.get('forms')
            };

            var html = this.compileTextTemplate(this.template, context);

            this.$el.html(html);
            this.enhanceJQMComponentsAPI();
            
            return this;

        }

    });

});