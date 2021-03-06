define("account/optionsview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "common/basicview",
    "app.config",

    "text!./options.html"
], function ($, Backbone, _, Handlebars, BasicView, App, OptionsTemplate) {

	/**
	Página de registo do dispositivo

	@class account.OptionsView
	@alternateClassName OptionsView
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
        ID usado pelo div que contém a página

        @property id 
        @type String
        @static
        @readonly
        @private
        **/
        id: "options-page",


        /**
        Nome da página, apresentado no header

        @property pageName 
        @type String
        @static
        @readonly
        @private
        **/
        pageName: "Opções",


		/**
		Template base de todas as páginas de informação

		@property template 
		@type String
		@static
        @readonly
        @private
		**/
		template: OptionsTemplate,


		/**
		Conta do utilizador

		@property account 
		@type Account
		@private
		**/
		account: null,


		/**
		Id do botão para submeter o registo do dispositivo, presente no popup

		@property submitButton 
		@type String
		@static
        @readonly
        @private
		**/
		submitButton: "#submit-button",


		/**
		Id do botão para cancelar o registo do dispositivo, presente no popup

		@property cancelButton 
		@type String
		@static
        @readonly
        @private
		**/
		cancelButton: "#cancel-button",


		/**
		Id do botão para pedir o reenvio do código de registo, presente no popup

		@property resendButton 
		@type String
		@static
        @readonly
        @private
		**/
		resendButton: "#resend-button",


		/**
		Campo de texto para inserir o email, presente no popup

		@property emailForm 
		@type String
		@static
        @readonly
        @private
		**/
		emailForm: "#email-form",


		/**
		Campo de texto para inserir o código de activação, presente no popup

		@property codeForm 
		@type String
		@static
        @readonly
        @private
		**/
		codeForm: "#code-form",


		/**
		Listeners dos botões do formulário de registo e de configurações

		@property events
		@type Object
		@static
        @readonly
        @private
		**/
		events: {

			"click #register-device": "setupPopup",
			"click #save-settings": "saveOptions",
			"click #cancel-settings": "cancelOptions",

			"change #alert-notifs": "toggleNotifSlider",
			"click #load-image": "uploadPhoto"

		},


		/**
		Construtor da página de opções

		@constructor
		**/
		initialize: function ()
		{
			_.bindAll(this);

			this.account = App.account;

			this.renderLayout();
			this.setElement($("[data-role=content]"));
			this.render();

		},


		/**
		Faz o rendering do formulário das opções

		@method render
		@chainable
		**/
		render: function () {

			var context = this.account.attributes;

			var html = this.compileTextTemplate(this.template, context);

			this.$el.html(html);
			this.enhanceJQMComponentsAPI();
			
			return this;
		},


		/**
		Faz o rendering do popup com o formulário de registo e configuar os listeners
		dos botões

		@method setupPopup
		@private
		**/
		setupPopup: function () {

			var self = this;

			$('#popupMenu').on("popupafteropen", function() { 
				
				$(self.submitButton).unbind("click").bind("click", function(event){
					self.registerDevice();
				});


				$(self.cancelButton).unbind("click").bind("click", function(event){
					self.cancelRegistration();
				});


				$(self.resendButton).unbind("click").bind("click", function(event){
					self.resendCode();
				});
								
			});

			$('#popupMenu').popup('open', { positionTo: "window" });

		},


		/**
		Função chamada quando o utilizador clica no botão de submissão de registo

		@method registerDevice
		**/
		registerDevice: function() {

			var email = $(this.emailForm).val();
			var code = $(this.codeForm).val();

			var self = this;
			var success = function () {
				console.log("success");
				self.render();
			}

			this.account.registerDevice(email, code, success);

		},


		/**
		Função chamada quando o utilizador clica no botão de cancelar o registo

		@method cancelRegistration
		**/
		cancelRegistration: function() {
			$('#popupMenu').popup('close');
		},


		/**
		Função chamada quando o utilizador clica no botão de reenvio de código de registo

		@method resendCode
		**/
		resendCode: function() {

			var email = $(this.emailForm).val();

			if(email.length < 5) //se a string do email for demasiado pequena, não vale a pena enviar um pedido ao server
			{
				console.log("email too short");

				BasicView.prototype.showErrorOverlay({text: "Insira um email válido"});
				return;
			}

			console.log(email);

			this.account.resendCode(email);


		},


		/**
		Função chamada quando o utilizador clica no botão guardar as opções, iniciando o
		processo de guardar as opções localmente e no servidor

		@method saveOptions
		**/
		saveOptions: function () {
			console.log("save options");

			var success = function () {
				BasicView.prototype.showErrorOverlay({text: "Opções guardadas"});
			};

			var error = function () {
				BasicView.prototype.showErrorOverlay({text: "As opções não foram guardadas no servidor."});
			};


			var newOptions = this.getNewOptions();
			this.account.updateOptions(newOptions);

			BasicView.prototype.showErrorOverlay({text: "Opções guardadas"});

		},


		/**
		Obtém os valores presentes nos vários inputs do formulário de opções e coloca-los
		num mapa.

		@method getNewOptions
		@private
		@return {Object} Objecto com as opções inseridas pelo utilizador
		**/
		getNewOptions: function () { //TODO: factorizar método

			var options = {};

			var publishOption = $("#publish-schedule").find(":selected").attr("value");
			options.publish_schedule = publishOption === "on";

			var alertNotifs = $("#alert-notifs").find(":selected").attr("value");
			options.alert_notifs = alertNotifs === 'on';

			var notifTimeout = $("#notif-timeout").val();
			options.notif_timeout = parseInt(notifTimeout, 10);

			var area = $("#profile-area").val();
			options.area = area;

			// var image = $("#profile-image").val();
			// options.image = image;

			var bio = $("#profile-bio").val();
			options.bio = bio;

			var socialContacts = $("#options-social-contacts input");
			socialContacts.each(function (index) {
				var $this = $(this);

				options[$this.attr('name')] = $this.val();
			});


			return options;

		},


		/**
        Função chamada quando se clica no botão de carregar imagem

        @method uploadPhoto
        @param {Event} e Evento lançado quando se clica no botão de carregar imagem
        **/
		uploadPhoto: function (e) {

			var self = this;

			var files = $("#profile-image").get(0).files;
			var reader = new FileReader();

			if(files.length === 0) {
				this.showErrorOverlay({text: "Nenhuma imagem foi selecionada.", time:2000});
				return;
			}

			var errorCallback = function () {
				self.showErrorOverlay({text: "Erro no carregamento da imagem.", time:2000});
			};

			reader.onload = function (file) {

				self.account.uploadPhoto(file, function (data) {

					var url = data['data']['link'];

					console.log("url" + url);

					var imgTag = '<img class="profile-pic" src="' + url + '" '+
									'alt="Profile" height="130px" width="130px"/>';

					$("#profile-pic-wrapper").html(imgTag);

					self.showErrorOverlay({text: "Imagem actualizada.", time:2000});

				}, errorCallback);

			};

			reader.onerror = errorCallback;


			reader.readAsBinaryString(files[0]);

		},


		/**
		Função chamada quando o utilizador clica no botão de cancelar a alteração das opções

		@method cancelOptions
		**/
		cancelOptions: function() {
			history.go(-1);
		},


		/**
		Função chamada quando o utilizador clica switch de receber alertas de notificações, 
		fazendo show ou hide do slider do tempo consoante o switch esteja on ou off

		@method toggleNotifSlider
		**/
		toggleNotifSlider: function () {

			var alertNotifs = $("#alert-notifs").find(":selected").attr("value");

			if(alertNotifs === "on")
				$("#notif-slider").show();
			else if(alertNotifs === "off")
				$("#notif-slider").hide();

		}


	});


});