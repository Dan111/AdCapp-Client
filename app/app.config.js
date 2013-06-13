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

	var app = window.app = window.app || {};

	/**
	Modelo Account com as definições do utilizador

	@property account 
	@type Account
	@static
	**/
	app.account = new Account({id: 1});
	app.account.fetch(); //carrega a informação da conta, caso esteja 
						//guardada no dispositivo


	/**
	Endereço do servidor onde estão disponíveis as informações

	@property URL 
	@type String
	@static
	@final
	**/
	window.app.URL = "http://193.136.122.153/";


	/**
	Nome da conferência

	@property confName 
	@type String
	@static
	@final
	**/
	app.confName = "AdCapp";


	/**
	Site oficial da conferência

	@property confWebsite 
	@type String
	@static
	@final
	**/
	app.confWebsite = "http://";


	/**
	Data do início da conferência

	@property startDate 
	@type Date
	@static
	@final
	**/
	app.startDate = null;


	/**
	Data do fim da conferência

	@property endDate 
	@type Date
	@static
	@final
	**/
	app.endDate = null;



	/**
	Constantes dos vários tipos de entidados

	@property TYPES 
	@type Object
	@static
	@final
	**/
	app.TYPES = {
		PAPER	: "Paper",
		SESSION	: "Session",
		KEYNOTE	: "Keynote",
		WORKSHOP: "Workshop",
		SOCIAL	: "SocialEvent",
		QUESTION: "Question"
	};


	/**
	Atualiza as notificações

	@method updateNotifs
	@static
	**/
	app.updateNotifs = function () {
		var notifs = new Notifications();
		notifs.fetch({
			beforeSend: function (){
				//override do ajax loader
			}
		});
	};


	//Caso o utilizador queira ser avisado de novas notificações,
	//faz-se a atualização quando a aplicação inicializa e configura-se
	//a verificação periódica
	if(app.account.alertNotif()) {
		//app.updateNotifs();

		//Verifica se há novas notificações periodicamente
		app.notifInterval =  app.notifInterval || setInterval(function () {
			app.updateNotifs();
		}, app.account.getNotifTimeout() * 60 * 1000); //converter de minutos para milisegundos
	}

	return window.app;


});