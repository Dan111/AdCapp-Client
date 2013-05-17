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
            this.contacts = args.contacts;
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
            //atributos do user do perfil
            var user = this.user.attributes;
            
            //informação base da página de um perfil
            var context = {
                user : user,
                author : user.author
            };

            //compilação do template com a sua informação
            var html = this.compileTemplate(this.template, context);

            $("[data-role=content]").append(html);
            this.enhanceJQMComponentsAPI();

            // render da tab geral, sendo que é a default da página
            this.renderGeneral();
            this.setElement($("[data-role=content]"));

            return this;

        },

        addUser: function()
        {
            var user = this.user.attributes;
            //atributos do user a adicionar aos contactos
            var attrs = {
                    user_name: user.name,
                    user_id: user.id,
                    email: user.email,
                    image: user.image
                };

            //Verifica se já existe um contacto com o user_id do user deste perfil
            var hasContact = this.contacts.find( function(user_m){ return user_m.get("user_id") === user.id; });

            console.log(hasContact);
            if(!hasContact)
            {
                this.contacts.create(attrs);
                console.log("contact added");
            }
            else
                console.log("already has contact");
           
        },


        vote: function()
        {
            var url = "www.adcapp.com";//colocar url correcta quando definida

            var form = $('<form></form>');

            //definição do método http e da url do post
            form.attr("method", "post");
            form.attr("action", url);

            //Falta apenas verficar como obter o votable-id e user_id, sendo este último o utilizador da app
            var parameters = {vote: {user_id: -1, votable_id: -1, votable_type: "User"}};

            // criação das tags inputs com os valores passados em parameters
            $.each(parameters, function(key, value) {
                var field = $('<input />');

                field.attr("type", "hidden");
                field.attr("name", key);
                field.attr("value", value);

                form.append(field);
            });

            // faz append do form criado e respectivo submit, para que tudo possa decorrer
            $(document.body).append(form);
            form.submit();

        },

        //Render da tab geral
        renderGeneral: function() {
            console.log("general tab");
            //atributos do user do perfil
            var user = this.user.attributes;

            //informação necessária para a tab geral
            var context = {
                idNextEvent : user.nextEvent.idNextEvent,
                nameNextEvent : user.nextEvent.nameNextEvent,
                userId : user.id,
                events : user.events,
                bio : user.bio
            };

            //compilação do template com a sua informação
            var html = this.compileTemplate(this.generalInfoTemplate, context);

            //adição do html pretendido e "refresh" para jquey mobile funcionar 
            $("#option-menu").html(html);
            $("#" + this.id).trigger("create");

            return this;
        },

        //Render da tab contactos
        renderContacts: function() {
            console.log("social contacts tab");

            //atributos do user do perfil
            var user = this.user.attributes;
            //informação para a tab contactos
            var context = {
                website : user.socialContacts.website,
                linkedin : user.socialContacts.linkedin,
                facebook : user.socialContacts.facebook,
                twitter : user.socialContacts.twitter
            };

            //compilação do template com a sua informação
            var html = this.compileTemplate(this.moreContactsTemplate, context);

            //adição do html pretendido e "refresh" para jquey mobile funcionar 
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