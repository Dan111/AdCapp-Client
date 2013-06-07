define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "views/basicview",
    "models/notification",
    "collections/notifications"
], function ($, Backbone, _, Handlebars, BasicView, Notification, NotificationsCollection) {


	return BasicView.extend({

        id: "notification-page",
        pageName: "Notificações",

        template: "notifications-template",

        initialize: function ()
        {
            _.bindAll(this);

            this.collection = new NotificationsCollection();

            window.coll = this.collection;

            var self = this;
            this.collection.fetch({
                success: function () {
                    self.renderLayout();
                    self.setElement($(self.mainContainer));
                    self.render();

                    console.log(self.collection.toJSON());

                }
            });

            this.listenTo(this.collection, 'add', this.newNotif);

        },

        render: function (){

            var context = {
                notifications: this.collection.toJSON()
            };

            console.log(context);

            var html = this.compileTemplate(this.template, context);

            this.$el.html(html);
            this.enhanceJQMComponentsAPI();

            console.log("notifications rendered");
            
            return this;

        },


        newNotif: function (){
            console.log('new');
        }


    });

});