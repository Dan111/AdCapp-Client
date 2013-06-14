define([
    "jquery",
    "backbone",
    "views/basicview",

    "backbone.localStorage"
], 

function ($, Backbone, BasicView) {

	/**
    Guarda as configurações da aplicação definidas pelo utilizador.

    @class Account
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        LocalStorage usado para guardar.

        @property localStorage
        @type Backbone.LocalStorage
        @static
        @final
        @default new Backbone.LocalStorage('contacts-backbone')
        **/
		localStorage: new Backbone.LocalStorage('account-backbone'),


		/**
        Atributos predefinidos do modelo .

        @property defaults
        @type Object
        @static
        @final
        @private
        **/
		defaults: {

            id: 1,

			alert_notifs: true,
			notif_timeout: 15,

			logged: false,
			publish_schedule: false,

            profile: null,
            email: null,
            code: null

		},


		/**
        Informa se o utilizador optou por receber alertas de novas notificações.

        @method alertNotif
        @return {Boolean} Retorna true se o utilizador ativou os alertas.
        **/
		alertNotif: function () {
			return this.get('alert_notifs');
		},


		/**
        Devolve de quanto em quanto tempo a aplicação deve verificar a 
        existência de novas notificações.

        @method getNotifTimeout
        @return {Number} Período de verificação.
        **/
		getNotifTimeout: function () {
			return this.get('notif_timeout');
		},


		/**
        Verifica se o utilizador registou o dispositivo com sucesso.

        @method isLogged
        @return {Boolean} Retorna true se o dispositivo foi registado com 
        					sucesso.
        **/
		isLogged: function () {
			return this.get('logged');
		},


        getEmail: function (){
            return this.get('email');
        },


        getCode: function (){
            return this.get('code');
        },



        registerDevice: function (email, code) {

            var self = this;

            $.ajax({
                method: "POST",

                url: window.app.URL + "login",
            
                data:{
                    "email"     : email, 
                    "password"  : code
                },

                beforeSend: function () {
                    $.mobile.loading( 'show', {
                            text: "A registar dispositivo",
                            textVisible: true,
                            theme: "d"
                    });
                },

                complete: function () {
                    //override do ajaxsetup para nao fazer hide do load spinner
                },

                success: function (data) {
                    $.mobile.loading( 'hide' );

                    self.set("profile", data);
                    self.set("email", email);
                    self.set("code", code);
                    self.setupCredentials(email, code);

                    self.save();
                    BasicView.prototype.showErrorOverlay({text: "Registo concluído com sucesso"});
                },

                error: function (){
                    BasicView.prototype.showErrorOverlay({text: "Registo inválido"});
                }
            });
        },


        resendCode: function (email) {

            var self = this;

            $.ajax({
                method: "POST",

                url: window.app.URL + "resend",
            
                data:{
                    "email": email
                },

                beforeSend: function () {
                    $.mobile.loading( 'show', {
                            text: "A processar pedido",
                            textVisible: true,
                            theme: "d"
                    });
                },

                complete: function () {
                    //override do ajaxsetup para nao fazer hide do load spinner
                },

                success: function (data) {
                    $.mobile.loading( 'hide' );

                    console.log("resend success");

                    BasicView.prototype.showErrorOverlay({text: "Código de activação reenviado.\nVerifique o seu email."});
                },

                error: function (){
                    BasicView.prototype.showErrorOverlay({text: "Email inválido"});
                }
            });

        },


        setupCredentials: function () {

            var email = this.getEmail();
            var code = this.getCode();

            if(email == null || code == null)
                return false;
            
            Backbone.$.ajaxSetup({
                data: {
                    "email"     : email, 
                    "password"  : code
                }
            });

            $.ajaxSetup({
                data: {
                    "email"     : email, 
                    "password"  : code
                }
            });

            return true;

        }

	});

});