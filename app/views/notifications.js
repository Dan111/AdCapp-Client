define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "views/basicview",
    "models/notification",
    "models/account",
    "collections/notifications"
], function ($, Backbone, _, Handlebars, BasicView, Notification, Account, NotificationsCollection) {


	return BasicView.extend({

        id: "notification-page",
        pageName: "Notificações",

        template: "notifications-template",

        events: {
            "expand .notif"             : "readNotif",
            "click #mark-all-as-read"   : "markAllAsRead"
        },

        initialize: function () {
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

            

        },

        render: function () {

            var self = this;

            //TODO: encontrar uma melhor sulução
            var notifs = _.map(this.collection.toJSON(), function (notif) {
                return {
                    notif: notif,
                    unread: !self.collection.isRead(notif.id)
                };
            });

            var context = {
                notifications: notifs
            };

            var html = this.compileTemplate(this.template, context);

            this.$el.html(html);
            this.enhanceJQMComponentsAPI();

            console.log("notifications rendered");
            
            return this;

        },


        readNotif: function (e) {
            console.log("notif read");

            var $this = $(e.target);
            var notifId = $this.attr('notif-id');

            this.collection.markAsRead(notifId);
            $this.find(".new-notif").remove();

        },


        markAllAsRead: function () {

            console.log("mark all as read");

            $(".notif").trigger("expand").trigger("collapse");
        }


    });

});