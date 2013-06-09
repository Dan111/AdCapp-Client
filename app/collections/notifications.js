define([
    "jquery",
    "backbone",
    "underscore",
    "models/notification",
    "storagewrapper"
], 

function ($, Backbone, _, Notification, StorageWrapper) {

	/**
	Colecção de notificações. Gere as notificações já lidas e informa o 
	utilizador de novas.

	@class NotificationCollection
	@extends Backbone.View
	**/
	return Backbone.Collection.extend({

		/**
        Classe do modelo utilizado na coleção

        @property model
        @type Backbone.Model
        @final
        @static
        @private
        @default Notification
        **/
		model: Notification,


		/**
		URL utilizado para obter os dados

		@property url
		@type String
		@final
		@static
		@private
		@default "/notifications"
		**/
		url: "http://adcapp.apiary.io/notifications",


		/**
		ID usado no localStorage para guardar os identificadores das 
		notificações já lidas pelo utilizador

		@property readStorageID
		@type String
		@final
		@static
		@private
		@default "notif-read"
		**/
		readStorageID: 'notif-read',


		/**
		Vetor com os ids das notificações já lidas

		@property read
		@type Array
		@private
		@default []
		**/
		read: [],


		/**
		ID usado no localStorage para guardar o número de notificações recebidas
		na última atualização. Útil para saber quando se deve alterar o
		utilizador de novas notificações

		@property prevLengthStorageID
		@type String
		@final
		@static
		@private
		@default 'notif-prev-length'
		**/
		prevLengthStorageID: 'notif-prev-length',


		/**
		Carrega a lista de notificações lidas da localStorage e cria um listener
		para o evento lançado nas atualizações dos dados.

		@constructor
		@class NotificationCollection
		**/
		initialize: function () {
			//_.bindAll(this); //FUCK YOU!!!

			this.loadRead();
			this.listenTo(this, 'sync', this.newNotif);
		},


		/**
		Carrega da localStorage a lista de notificações lidas

		@method loadRead
		@private
		**/
		loadRead: function () { //TODO: utilizar o StorageWrapper

			var readJson = window.localStorage.getItem(this.readStorageID);
			var readArray = window.JSON.parse(readJson);

			readArray = readArray || [];
			this.read = readArray;
		},


		/**
		Grava na localStorage a lista de notificações lidas

		@method saveRead
		@private
		**/
		saveRead: function () {

			var readJson = window.JSON.stringify(this.read);
			window.localStorage.setItem(this.readStorageID, readJson);
		},


		/**
		Adiciona o id da notificação à lista de notificações lidas

		@method markAsRead
		@protected
		@param {String|Number} notifId ID da notificação lida
		**/
		markAsRead: function (notifId) {

			this.read = _.union(this.read, parseInt(notifId, 10));
			this.saveRead();
		},


		/**
		Verifica se o id da notificação está na lista de notificações lidas

		@method isRead
		@protected
		@param {String|Number} notifId ID da notificação
		@return {Boolean} Retorna true se a notificação já foi lida
		**/
		isRead: function (notifId) {
			return _.contains(this.read, parseInt(notifId, 10));
		},



		/**
		Callback usado no final de cada sincronização com o server

		@method newNotif
		@private
		@param {NotificationCollection} collection Esta coleção
		@param {Object} resp Objecto com a resposta do servidor (ver Backbone)
		@param {Object} options Opções utilizadas na sincronização(ver Backbone)
		**/
		newNotif: function (collection, resp, options) {

			var show = window.app.account.alertNotif();


			var prevLength = StorageWrapper.load(this.prevLengthStorageID, 0);
			var newNotifs = this.length - prevLength;
			StorageWrapper.save(this.prevLengthStorageID, this.length);

			if(show && newNotifs > 0)
			{
				var message = "";

            	if(newNotifs == 1)
            		message = "Tem uma notificação não lida.";
            	else
            		message = "Tem " + newNotifs + " notificações não lidas.";

            	this.showDeviceNotification("Notificações", message);
            }
        },


        /**
		Apresenta um alerta (nativo do dispositivo) ao utilizador, com a opção
		de redirecionar para a lista de notificações. Utilizado para informar
		caso haja notificações novas. Caso o utilizador se encontre no menu de
		notificações, o alerta é ignorado.

		@method showDeviceNotification
		@static
		@param {String} title Título da janela do alerta
		@param {String} message Mensagem a ser apresentada
		**/
        showDeviceNotification: function (title, message) { //TODO: colocar num sítio mais apropriado

        	var notifHash = "#notifications";

        	if(window.location.hash === notifHash)
        		return;

        	navigator.notification.confirm(
		        message,
		        function (buttonIndex) {
		        	if(buttonIndex == 2) { //botão 'Ver'
		        		window.location.hash = notifHash;
		        	}
		        },
		        title,            
		        'Fechar,Ver'
    		);
        }


	});

});