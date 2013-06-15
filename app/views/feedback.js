define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "views/basicview",
    "models/feedback",
    "app.config"
], function ($, Backbone, _, Handlebars, BasicView, Feedback, App) {

    /**
    View do menu de feedback

    @class FeedbackView
    @extends BasicView
    **/
	return BasicView.extend({

        /**
        ID usado pelo div que contém a página

        @property id 
        @type String
        @static
        @final
        @default "feedback-page"
        **/
        id: "feedback-page",


        /**
        Nome da página, apresentado no header

        @property pageName 
        @type String
        @static
        @final
        @default "Feedback"
        **/
        pageName: "Feedback",


        /**
        Template usado pela página

        @property template 
        @type String
        @final
        @protected
        @default "feedback-template"
        **/
        template: "feedback-template",


        /**
        Definição dos listeners dos eventos

        @property events
        @type Object
        @protected
        **/
        events: {

        },


        /**
        Inicializa a página de feedback. 

        @constructor
        @class FeedbackView
        **/
        initialize: function () {

            _.bindAll(this);

            this.feedback = new Feedback({id: 1});

            var self = this;
            this.feedback.fetch({
                success: function () {
                    self.renderLayout();
                    self.setElement($(self.mainContainer));
                    self.render();
                }
            });

        },


        /**
        Faz o rendering da página de feedback.

        @method render
        @protected
        @chainable
        **/
        render: function () {

            var context = {
                email: App.confEmail,
                forms: this.feedback.get('forms')
            };

            var html = this.compileTemplate(this.template, context);

            this.$el.html(html);
            this.enhanceJQMComponentsAPI();
            
            return this;

        }





    });

});