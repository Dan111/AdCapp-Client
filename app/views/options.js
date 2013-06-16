define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "views/basicview",
    "app.config"
], function ($, Backbone, _, Handlebars, BasicView, App) {

	/**
	Página de registo do dispositivo

	@class OptionsView
	@extends BasicView
	**/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@final
		@default "div[data-role=content]"
		**/
		el: "div[data-role=content]",


		/**
        ID usado pelo div que contém a página

        @property id 
        @type String
        @static
        @final
        @default "options-page"
        **/
        id: "options-page",


        /**
        Nome da página, apresentado no header

        @property pageName 
        @type String
        @static
        @final
        @default "Opções"
        **/
        pageName: "Opções",


		/**
		Template base de todas as páginas de informação

		@property template 
		@type String
		@final
		@protected
		@default "event-template"
		**/
		template: "options-template",


		/**
		Conta do utilizador

		@property account 
		@type Account
		@private
		@default null
		**/
		account: null,


		//TODO: Docs
		submitButton: "#submit-button",
		cancelButton: "#cancel-button",
		resendButton: "#resend-button",

		emailForm: "#email-form",
		codeForm: "#code-form",



		/**
		Listeners dos botões do formulário de registo

		@property events
		@type Object
		@protected
		**/
		events: {

			"click #register-device": "setupPopup",
			"click #save-settings": "saveOptions",
			"click #cancel-settings": "cancelOptions",

			"change #alert-notifs": "toggleNotifSlider"

		},


		/**
		Construtor da classe abstracta.

		@constructor
		@protected
		@class OptionsView
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
		Faz o rendering do layout base das páginas de informações

		@method render
		@protected
		@chainable
		**/
		render: function () {

			var context = this.account.attributes;

			var html = this.compileTemplate(this.template, context);

			this.$el.append(html);
			this.enhanceJQMComponentsAPI();
			
			return this;
		},



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


		registerDevice: function() {

			var email = $(this.emailForm).val();
			var code = $(this.codeForm).val();

			this.account.registerDevice(email, code);

		},



		cancelRegistration: function() {
			$('#popupMenu').popup('close');
		},


		//TODO: Docs
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




		saveOptions: function () {
			console.log("save options");

			var newOptions = this.getNewOptions();
			this.account
		},



		getNewOptions: function () { //TODO: guardar os wrappers em atributos

			var options = {};

			var publishOption = $("#publish-schedule").find(":selected").attr("value");
			options.publish_schedule = publishOption === "on";

			var alertNotifs = $("#alert-notifs").find(":selected").attr("value");
			options.alert_notifs = alertNotifs === 'on';

			var notifTimeout = $("#notif-timeout").val();
			options.notif_timeout = parseInt(notifTimeout, 10);

			var area = $("#profile-area").val();
			options.area = area;

			var image = $("#profile-image").val();
			options.image = image;

			var bio = $("#profile-bio").val();
			options.bio = bio;

			var socialContacts = $("#options-social-contacts input");
			socialContacts.each(function (index) {
				var $this = $(this);

				options[$this.attr('name')] = $this.val();
			});


			this.account.updateOptions(options);

		},


		cancelOptions: function() {
			history.go(-1);
		},


		toggleNotifSlider: function () {

			var alertNotifs = $("#alert-notifs").find(":selected").attr("value");

			if(alertNotifs === "on")
				$("#notif-slider").show();
			else if(alertNotifs === "off")
				$("#notif-slider").hide();

		}


	});


});