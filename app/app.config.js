define([
	"backbone",
	"jquery",
	"underscore",

	"models/account",
	"collections/notifications"
],

/**
Responsável por inicializar o objecto global com as configurações da aplicação e do utilizador

@class AppConfig
**/
function (Backbone, $, _, Account, Notifications) {

	return function () {

		var app = window.app = window.app || {};

		//Configurações do utilizador
		app.account = new Account();
		app.account.fetch();

		//URL do server SI-M
		app.URL = "http://193.136.122.153/";

		//Nome da conferência
		app.ConfName = "AdCapp";

		//Website oficial da conferência
		app.confWebsite = "http://";

		//Início e fim da conferência
		app.startDate = null;
		app.endDate = null;

		//Actualiza as notificações
		app.updateNotifs = function () {
			var notifs = new Notifications();
			notifs.fetch({
				beforeSend: function (){
					//override do ajax loader
				}
			});
		};


		//Caso o utilizador queira ser avisado de novas notificações
		if(app.account.alertNotif()) {
			//app.updateNotifs();

			//Verifica se há novas notificações periodicamente
			app.notifInterval =  app.notifInterval || setInterval(function () {
				app.updateNotifs();
			}, app.account.getNotifTimeout() * 60 * 1000); //converter de minutos para milisegundos
		}

	};


});