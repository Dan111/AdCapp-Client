define("notifications/notificationsview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    
    "views/basicview",
    "./notification",
    "account/account",
    "./notifications",
    "text!./notifications.html"
], function ($, Backbone, _, Handlebars, BasicView, Notification, Account, NotificationsCollection, NotifTemplate) {

    /**
    View do menu de notificações

    @class NotificationsView
    @extends BasicView
    **/
	return BasicView.extend({

        /**
        ID usado pelo div que contém a página

        @property id 
        @type String
        @static
        @final
        @default "notification-page"
        **/
        id: "notification-page",


        /**
        Nome da página, apresentado no header

        @property pageName 
        @type String
        @static
        @final
        @default "Notificações"
        **/
        pageName: "Notificações",


        /**
        Template usado pela página

        @property template 
        @type String
        @final
        @protected
        @default "notifications-template"
        **/
        template: NotifTemplate,


        /**
        Definição dos listeners dos eventos que informam quando uma
        notificação deve ser marcada como lida

        @property events
        @type Object
        @protected
        **/
        events: {
            "expand .notif"             : "readNotif",
            "click #mark-all-as-read"   : "markAllAsRead"
        },


        /**
        Carrega as notificações e chama o método responsável pelo 
        rendering da página. 

        @constructor
        @class NotificationsView
        **/
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


        /**
        Faz o rendering de todas as notificações.

        @method render
        @protected
        @chainable
        **/
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

            var html = this.compileTextTemplate(this.template, context);

            /*TODO*/
            /*var template = Handlebars.compile(this.template);
            var html = template(context);*/
            /**/

            this.$el.html(html);
            this.enhanceJQMComponentsAPI();
            
            return this;

        },


        /**
        Função chamada quando se expande uma notificação, delegando a tarefa de
        a marcar como lida para a coleção de notificações.

        @method readNotif
        @protected
        @param {Event} e Evento lançado quando se expandiu a notificação
        **/
        readNotif: function (e) {

            var $this = $(e.target);
            var notifId = $this.attr('notif-id');

            this.notifs.markAsRead(notifId);
            $this.find(".new-notif").remove();

        },


        /**
        Função chamada quando se clica no botão 'Marcar Todas Como Lidas'

        @method markAllAsRead
        @protected
        **/
        markAllAsRead: function () { //TODO: tornar mais eficiente
            $(".notif").trigger("expand").trigger("collapse");
        }


    });

});