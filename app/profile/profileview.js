define("profile/profileview",
    [
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "./user",
    "common/basicview",
    "contacts/contacts",
    "app.config",

    "text!./profilebase.html",
    "text!./generalinfo.html",
    "text!./morecontacts.html",
], function ($, Backbone, _, Handlebars, UserModel, BasicView, Contacts, App, ProfileBaseTemplate, GeneralInfoTemplate, MoreContactsTemplate) {

    /**
    View da página de perfil 

    @class profile.ProfileView
    @alternateClassName ProfileView
    @extends BasicView
    **/
    return BasicView.extend({

        /**
        Elemento da DOM onde são colocados todas as páginas

        @property el 
        @type String
        @private
        **/
        el: "div[data-role=content]",


        /**
        Id da página de perfil

        @property id 
        @type String
        @private
        **/
        id: "profile-page-",


        /**
        Nome da página de perfil

        @property pageName 
        @type String
        @static
        @readonly
        @private
        **/
        pageName: "Perfil",


        /**
        Template base do perfil

        @property template 
        @type String
        @static
        @readonly
        @private
        **/
        template: ProfileBaseTemplate,


        /**
        Template da tab de informaões gerais

        @property generalInfoTemplate
        @type String
        @static
        @readonly
        @private
        **/        
        generalInfoTemplate: GeneralInfoTemplate,


        /**
        Template da tab de contactos sociais

        @property moreContactsTemplate 
        @type String
        @static
        @readonly
        @private
        **/          
        moreContactsTemplate: MoreContactsTemplate,


        /**
        Dicionário que guarda informações relativas aos tipos de
        eventos possíveis

        @property typesInfo
        @type Object
        @static
        @readonly
        @private
        **/
        typesInfo: app.TYPESINFO,


        /**
        Modelo do perfil ao qual corresponde esta página

        @property user
        @type Backbone.Model
        @private
        **/
        user: null,


        /**
        Eventos lançados pela transição entre tabs
        e ainda eventos de adição e remoção de utilizador
        como contacto da colecção de contactos

        @property events
        @type Object
        @static
        @readonly
        @private
        **/
        events: {

            'click #add-user' : 'addRemoveUser',
            'click #general'  : 'renderGeneral',
            'click #contacts' : 'renderContacts'

        },


        /**
        Construtor da classe ProfileView, em que é passado o id do utilizador
        a apresentar. Faz o fetch da Collection de contactos, do Model
        do utilizador a apresentar e ainda o rendering da página

        @constructor
        @param {Object} args contém id do utilizador a apresentar
        @param {Number} args.modelId id do utilizador a apresentar
        **/
        initialize: function (args)
        {
            _.bindAll(this);

            var modelId = args.modelId;
            this.id += args.modelId;
            var self = this;

            this.mycontacts = new Contacts();
            this.mycontacts.fetch();

            this.user = new UserModel({id: modelId});
            this.user.fetch().done(
                function () {
                    self.renderLayout();
                    self.render();
                });
        },


        /**
        Faz o rendering do layout base das páginas de perfil

        @method render
        @chainable
        **/
        render: function () {
            //atributos do user do perfil
            var user = this.user.attributes;

            //verifica se é o perfil do utilizador da aplicação
            var isUser = App.account.isLogged() ? user.id === App.account.getUserId() : false;
            
            //informação base da página de um perfil
            var context = {
                user : user,
                author : user.author,
                isUser: isUser
            };

            //compilação do template com a sua informação
            var html = this.compileTextTemplate(this.template, context);

            $("[data-role=content]").append(html);
            this.enhanceJQMComponentsAPI();

            // render da tab geral, sendo que é a default da página
            this.renderGeneral();
            this.setElement($("[data-role=content]"));

            
            if(this.mycontacts.hasContact(user.id))
                $("#add-user span span span").append('<i class="icon-check-sign pull-right"></i>');


            return this;

        },
       
        /**
        Adiciona ou remove o participante que a página representa, consoante
        este esteja ou não na coleção de contactos.

        @method addRemoveUser
        **/
        addRemoveUser: function()
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
            var hasContact = this.mycontacts.hasContact(user.id);
            var feedback = "";
            
            if(!hasContact)
            {
                //Cria o contacto na collection 
                this.mycontacts.create(attrs);
                $("#add-user span span span").append('<i class="icon-check-sign pull-right"></i>');
            }
            else 
            {    
                //retira o contacto da collection
                hasContact.destroy();
                $('#add-user span span span .icon-check-sign').remove();  
            }
        },


        /**
        Trata da informação necessária de cada evento

        @method treatEvents
        @private
        @return{Array} retorna um array de contextos de cada evento passado
        **/
        treatEvents: function(myEvents) {
            console.log(myEvents);
            var that = this;
            return _.map(myEvents, function(obj){
                var type = obj.type.toLowerCase();
                return{
                    url     : that.typesInfo[type].url + obj.id.toString(),
                    name    : obj.name 
                };
            });
        },


        /**
        Faz o renderering da tab de informações gerais

        @method renderGeneral
        @chainable
        **/
        renderGeneral: function() {
            console.log("general tab");
            //atributos do user do perfil
            var user = this.user.attributes;
            var nextEventId = null;
            var nextEventType = null;
            var nextEventName = null;

            if(user.nextEvent !== null)
            {
                nextEventId = user.nextEvent.id;
                nextEventType = user.nextEvent.type.toLowerCase();
                nextEventName = user.nextEvent.name;
            }

            //informação necessária para a tab geral do perfil
            var context = {
                publishSchedule: user.publish_schedule,
                idNextEvent : nextEventId,
                type : nextEventType,
                nameNextEvent : nextEventName,
                userId : user.id,
                events : this.treatEvents(user.events),
                bio : user.bio
            };

            //compilação do template com a sua informação
            var html = this.compileTextTemplate(this.generalInfoTemplate, context);

            //adição do html pretendido e "refresh" para jquey mobile funcionar 
            $("#option-menu").html(html);
            $("#" + this.id).trigger("create");

            return this;
        },


        /**
        Faz o renderering da tab de contactos sociais do perfil

        @method renderContacts
        @chainable
        **/
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
            var html = this.compileTextTemplate(this.moreContactsTemplate, context);

            //adição do html pretendido e "refresh" para jquey mobile funcionar 
            $("#option-menu").html(html);
            $("#" + this.id).trigger("create");

            return this;
        }


    });


});