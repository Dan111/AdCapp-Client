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

            this.notifs = new NotificationsCollection();

            var self = this;
            this.notifs.fetch({
                success: function () {
                    self.renderLayout();
                    self.setElement($(self.mainContainer));
                    self.render();
                }
            });

        },

        render: function () {

            var self = this;

            //TODO: encontrar uma melhor sulução
            var notifs = _.map(this.notifs.toJSON(), function (notif) {
                return {
                    notif: notif,
                    unread: !self.notifs.isRead(notif.id)
                };
            });

            var context = {
                notifications: notifs
            };

            var html = this.compileTemplate(this.template, context);

            this.$el.html(html);
            this.enhanceJQMComponentsAPI();
            
            return this;

        },


        readNotif: function (e) {

            var $this = $(e.target);
            var notifId = $this.attr('notif-id');

            this.notifs.markAsRead(notifId);
            $this.find(".new-notif").remove();

        },


        markAllAsRead: function () { //TODO: tornar mais eficiente
            $(".notif").trigger("expand").trigger("collapse");
        }


    });

});