define([
	"backbone",
	"jquery",
	"underscore",

	"account/account"
],

/**
Responsável por inicializar o objecto global com as configurações da aplicação e do utilizador

@class AppConfig
**/
function (Backbone, $, _, Account) {

	var app = window.app = window.app || {};

	/**
	Modelo Account com as definições do utilizador

	@property account 
	@type Account
	@static
	**/

	if(!app.account) {
		app.account = new Account({id: 1});
		app.account.fetch(); //carrega a informação da conta, caso esteja 
							//guardada no dispositivo
		app.account.setupCredentials(); //configura o jQuery para enviar as credenciais
	}
	

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
	Email oficial da conferência

	@property confEmail 
	@type String
	@static
	@final
	**/
	app.confEmail = "adcapp.g22@gmail.com";


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
		QUESTION: "Question",
		USER: "User"
	};

	app.TYPESINFO = {"paper": {color: '#2c3e50', url: '#paper/'}, "workshop": {color: '#16a085', url: '#workshop/'}, 
					"socialevent": {color: '#8e44ad', url: '#social/'}, "keynote": {color: '#2ecc71', url: '#keynote/'},
					"session": {url: '#session/'}};


	/**
	Constantes de várias mensagens usadas pela app

	@property MSG 
	@type Object
	@static
	@final
	**/
	app.MSG = {
		REGISTRATION_NEEDED: "Por favor, registe-se nas opções."
	};


	/**
	Atualiza as notificações, agenda pessoal e opções

	@method update
	@static
	**/
	app.update = function () {

		//actualiza as notificações, caso o utilizador tenha activado a opção
		if(app.account.alertNotif()) {
			require(["notifications/notifications"], function (Notifications) {
				var notifs = new Notifications();
				notifs.fetch({
					beforeSend: function (){
						//override do ajax loader
					}
				});
			});
		}

		//app.account.pushOptionsToServer();

		//TODO: actualizar agenda pessoal
	};


	/**
	Cria o intervalo de actualização de informações

	@method setUpdateInterval
	@static
	@param {Number} time Duração do intervalo (em milissegundos)
	**/
	app.setUpdateInterval = function (time) {

		if(app.updateInterval)
			clearInterval(app.updateInterval);

		//Verifica se há novas notificações periodicamente
		app.updateInterval = setInterval(function () {
			app.update();
		}, time); //converter de minutos para milisegundos

	};

	//Inicializa o intervalo de actualização
	if(!app.updateInterval) {
		var updateTime = app.account.getNotifTimeout() * 60 * 1000;
		app.setUpdateInterval(updateTime);
		app.update();
	}


	return window.app;


});