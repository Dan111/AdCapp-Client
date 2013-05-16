define([
    "jquery",
    "backbone",
    "handlebars",
    "models/user",
    "views/basicview"
], function ($, Backbone, Handlebars, UserModel, BasicView) {

    return Backbone.View.extend({

        el: $("[data-role=content]"),

        id: "profile-page",
        pageName: "Perfil",

        template: "profile-template",
        generalInfoTemplate: "general-info-template",
        moreContactsTemplate: "more-contacts-template",


        user: null,

        events: {

            'click #add-user' : 'addUser',
            'click #vote'     : 'vote',
            'click #general'  : 'renderGeneral',
            'click #contacts' : 'renderContacts'

        },

        initialize: function (args)
        {
            _.bindAll(this);

            var modelId = args.modelId;

            var self = this;

            this.user = new UserModel({id: modelId});
            this.user.fetch({
                success: function () {
                    self.renderLayout();
                    self.render();
                }
            });



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
            var user = this.user.attributes;
             
            var context = {
                user : user,
                author : user.author
            };

            var html = this.compileTemplate(this.template, context);

            $("[data-role=content]").append(html);
            this.enhanceJQMComponentsAPI();

            this.renderGeneral();
            this.setElement($("[data-role=content]"));

            return this;

        },

        addUser: function()
        {

        },

        vote: function()
        {

        },

        renderGeneral: function() {
            console.log("general tab");

            var user = this.user.attributes;

            var context = {
                idNextEvent : user.nextEvent.idNextEvent,
                nameNextEvent : user.nextEvent.nameNextEvent,
                userId : user.id,
                events : user.events,
                bio : user.bio
            };

            
            var html = this.compileTemplate(this.generalInfoTemplate, context);

            $("#option-menu").html(html);
            $("#" + this.id).trigger("create");

            return this;
        },

        renderContacts: function() {
            console.log("social contacts tab");

            var user = this.user.attributes;

            var context = {
                website : user.socialContacts.website,
                linkedin : user.socialContacts.linkedin,
                facebook : user.socialContacts.facebook,
                twitter : user.socialContacts.twitter
            };

            var html = this.compileTemplate(this.moreContactsTemplate, context);

            $("#option-menu").html(html);
            $("#" + this.id).trigger("create");

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