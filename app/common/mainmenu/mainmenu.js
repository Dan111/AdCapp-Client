define("common/mainmenu/mainmenu",
[
    "jquery",
    "backbone",
    "handlebars",

    "../basicview",
    "app.config",

    "text!./mainmenu.html"
], function ($, Backbone, Handlebars, BasicView, App, MainMenuTemplate) {

    /**
    View do menu príncipal

    @class common.mainmenu.MainMenuView
    @alternateClassName MainMenuView
    @extends BasicView
    **/
    return BasicView.extend({

        /**
        Elemento da DOM onde são colocados todas as páginas

        @property el 
        @type String
        @private
        **/
        el: $("[data-role=content]"),


        /**
        Id da página

        @property id 
        @type String
        @static
        @readonly
        @private
        **/
        id: "menu-page",


        /**
        Nome da página, apresentado no header

        @property pageName 
        @type String
        @static
        @readonly
        @private
        **/
        pageName: "Menu",


        /**
        Template da página

        @property template 
        @type String
        @static
        @readonly
        @private
        **/
        template: MainMenuTemplate,


        /**
        Botão de menu

        @property $menubutton
        @type jQueryWrapper
        @static
        @readonly
        @private
        **/
        $menubutton: null,


        /**
        Definição dos listeners dos eventos

        @property events
        @type Object
        @static
        @readonly
        @private
        **/
        events: {

            "click [href=#feedback]": "unauthorizedAccess",
            "click #user-profile-shortcut": "unauthorizedAccess"

        },


        /**
        Construtor da classe. Faz o render da página e coloca
        o booleano menu a false, querendo isto dizer que o menu
        de icons não está aberto

        @constructor
        **/
        initialize: function ()
        {
            _.bindAll(this);

            var self = this;

            this.menu = false;

            self.renderLayout();
            self.render();
            this.isWifiActive();
            
        },


        /**
        Faz o rendering do layout da página e ainda trata de activar eventos
        para o bom funcionamento da página

        @method render
        @chainable
        **/
        render: function () {
            var that = this;

            var context = {
                userId: App.account.getUserId(),
                site: App.confWebsite
            };

            var html = this.compileTextTemplate(this.template, context);

            $("[data-role=content]").append(html);
            this.enhanceJQMComponentsAPI();

            
            this.setElement($("[data-role=content]"));

            //Eventos para o bom funcionamento do menu de icons
            $(document).bind("taphold", function() {
                that.closePopup;
            });

            //Quando tudo estiver pronto activa lança o método onDeviceReady
            $(document).ready(function() {
                  that.onDeviceReady();
            });
            //Recalcula o tamanho do popup e reposiona-o
            $(window).resize(function(){
                that.resizePopUp();
                that.positioningPopUp();      
            });

            this.$menubutton = $('#menu-button');

            //Impede o scroll quando o popup está activo
            this.$menubutton.on( "popupafteropen", function( event, ui ) {
                $("body").on("touchmove", false);
                $("#exit").on("click", that.closeApp);
            } );
            
            //Volta a activar o scroll depois do popup fechar
            this.$menubutton.on( "popupafterclose", function( event, ui ) {
                $("body").unbind("touchmove");
                $("#exit").off("click", that.closeApp);
            } );

            return this;

        },

        /**
        Fecha a aplicação

        @method closeApp
        **/
        closeApp: function(){
            device.exitApp(); 
        },

        /**
        Fecha o menu de icons e faz um unbind 

        @method closePopup
        **/
        closePopup: function(){
            this.$menubutton.popup( "close" );
            this.menu = false;
            $(window).unbind('scroll');
        },

        /**
        Posiciona o menu de icons consoante as dimensões da janela

        @method positioningPopUp
        @private
        **/
        positioningPopUp: function(){
            var toppos=($(window).height()/2) - (this.$menubutton.height()/2);
            var leftpos=($(window).width()/2) - (this.$menubutton.width()/2);

            this.$menubutton.css("top", toppos).css("left",leftpos-16);
        },

        /**
        Redimensiona o menu de icons consoante as dimensões da janela

        @method resizePopUp
        @private
        **/
        resizePopUp: function(){
            this.$menubutton.width($(window).width());
        },

        /**
        Activa o evento que permite abrir e fechar o menu de icons

        @method onDeviceReady
        **/
        onDeviceReady: function() {
            var that = this;    

            $(document).off("menubutton");
            $(document).on("menubutton", this.onMenuKeyDown);

        },

        /**
        Trata da abertura e do fecho do menu de icons

        @method onMenuKeyDown
        **/
        onMenuKeyDown: function() {
            that = this;
            
            this.resizePopUp();
            
            if(this.menu === false)
            {

                console.log("open menu");


                this.$menubutton.popup({
                    afterclose: function( event, ui ) {that.menu = false;}
                });

                this.$menubutton.popup('open');
                this.positioningPopUp();

                this.menu = true;
            }
            else
                this.closePopup();

        },


        /**
        Função chamada quando um utilizador tenta aceder a uma funcionalidade que necessita de
        registo sem estar registado

        @method unauthorizedAccess
        **/
        unauthorizedAccess: function () {
            console.log("unauthorized");

            if(!App.account.isLogged())
            {
                var self = this;
                setTimeout(function (){
                    self.showErrorOverlay({text: App.MSG.REGISTRATION_NEEDED});
                }, 500);
            }
        }
    });
});