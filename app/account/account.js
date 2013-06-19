define([
    "jquery",
    "backbone",
    "underscore",
    "views/basicview",

    "backbone.localStorage"
], 

function ($, Backbone, _, BasicView) {

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


        /**
        Devolve o nome do utilizador

        @method getName
        @return {String} Nome do utilizador.
        **/
        getName: function (){
            return this.get('profile')['name'];
        },


        /**
        Devolve o id do utilizador

        @method getUserId
        @return {Number} Id do utilizador.
        **/
        getUserId: function (){
            return this.get('profile')['id'];
        },


        /**
        Devolve o email do utilizador.

        @method getEmail
        @return {String} Email do utilizador.
        **/
        getEmail: function (){
            return this.get('email');
        },


        /**
        Devolve o código de registo do utilizador.

        @method getCode
        @return {String} Código de registo do utilizador.
        **/
        getCode: function (){
            return this.get('code');
        },


        /**
        Regista o dispositivo no server

        @method registerDevice
        @param {String} email Email do utilizador
        @param {String} code Código de registo do utilizador
        **/
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
                    self.set("logged", true);
                    self.setupCredentials(email, code);

                    self.save();
                    BasicView.prototype.showErrorOverlay({text: "Registo concluído com sucesso"});
                },

                error: function (){
                    BasicView.prototype.showErrorOverlay({text: "Registo inválido"});
                }
            });
        },


        /**
        Reenvia o código de registo para o email especificado, caso esteja presente
        na base de dados do servidor

        @method resendCode
        @param {String} email Email do utilizador
        **/
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


        /**
        Configura o método Ajax do jQuery e do Backbone para enviarem as credenciais de
        autenticação em cada pedido

        @method setupCredentials
        @return {Boolean} Retorna true se a configuração foi bem sucedida, isto é, se o dispositivo
                            já foi registado com sucesso.
        **/
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

        },


        /**
        Actualiza as opções com os valores passados como parâmetro

        @method updateOptions
        @param {Object} options Os novos valores que cada opção deve tomar
        **/
        updateOptions: function (options) {

            //actualiza as opções locais (por exemplo, de quanto em quanto tempo deve verificar actualizações)
            var newOptions = this.mergeOptions(this.attributes, options);
            this.set(newOptions);

            //actualiza o perfil do utilizador e os contactos sociais
            var newProfile = this.mergeOptions(this.get('profile'), options);
            var newSocialContacts = this.mergeOptions(this.get('profile')['socialContacts'],
                                                        options);
            newProfile['socialContacts'] = newSocialContacts;
            this.set('profile', newProfile);


            this.save();
            this.pushOptionsToServer({options: options});

        },


        /**
        Guarda as alterações feitas no perfil pessoal no servidor

        @method pushOptionsToServer
        @async
        @param {Object} args Argumentos da função
            @param {Object} args.options Os pares chave e valor a serem guardados no servidor
            @param {Object} [args.showError=false] Caso seja true, é apresentada uma mensagem a informar se
                                                    as alterações não foram guardados no servidor
        **/
        pushOptionsToServer: function (args) {

            if(args.options == null)
                args.options = _.extend(this.get('profile'), 
                                        this.get('profile')['socialContacts']);


            var self = this;

            $.ajax({
                method: "POST",

                url: window.app.URL + "users/" + self.getUserId(),
            
                data: _.extend({
                    "_method": "put"
                },args.options),

                beforeSend: function () {
                    //override do ajax loader
                },

                complete: function () {
                    //override do ajaxsetup para nao fazer hide do load spinner
                },

                success: function (data) {
                    self.set('profile', data);
                    self.save();
                },

                error: function (){
                    if(args.showError)
                    {
                        BasicView.prototype.showErrorOverlay({text: "As opções não foram guardadas no servidor."});
                    }
                }
            });

        },


        /**
        Altera os campos de oldOptions usando os valores de newOptions. Com este método, evita-se criar
        novos atributos no objecto oldOptions, o que poderia acontecer caso se usasse o método extend
        do Underscore

        @method mergeOptions
        @private
        @param {Object} oldOptions Objecto com as opções actuais
        @param {Object} newOptions Objecto com as opções que se quer alterar
        @return {Object} O objecto oldOptions com as opções actualizadas
        **/
        mergeOptions: function (oldOptions, newOptions) {

            if(newOptions == null)
                return oldOptions;

            var options_keys = _.keys(oldOptions);

            newOptions = _.chain(newOptions)
                            .omit('id')
                            .pick(options_keys)
                            .value();

            return _.extend(oldOptions, newOptions);

        },


        /**
        Atribui a todas os atributos de Account os valores predefinidos

        @method resetAccount
        **/
        resetAccount: function () {
            this.set(this.defaults);
            this.save();
        }

	});

});