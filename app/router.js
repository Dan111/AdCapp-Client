define([
  "backbone",

  //Views

  "views/paper",
  "views/session",
  "views/keynote",
  "views/workshop",
  "views/socialevent",

  "views/profile",
  "views/userslist",
  "views/eventslist",
  "views/agenda",
  "views/contacts",
  "views/notifications",
  "views/registration",
  "views/maininfo",
  "views/mainmenu",
  "views/rankings",
  "views/papersrank"
],

function (Backbone, PaperView, SessionView, KeynoteView, WorkshopView, SocialEventView, 
	ProfileView, UsersListView, EventsListView, AgendaView, ContactsView, NotificationsView, RegistrationView,
	MainInfoView, MainMenuView, RankingsView, PapersRankView) {

  	/**
	Router principal da app, responsável por traduzir os links em métodos a serem chamados

	@class Router
	@extends Backbone.Router
	**/
	var Router = Backbone.Router.extend({	 	

		/**
		Enumeração de todas as routes possíveis da app

		@property routes
		@type Object
		@static
		@final
		**/
		routes: {
			""              : "main",
			"index"         : "index",
			"agenda"        : "agenda",
			"maininfo"      : "maininfo",
			"mainmenu"      : "mainmenu",

			//listas
			"speakers"      : "speakers",
			"participants"  : "participants",
			"papers"		: "papers",
			"sessions"		: "sessions",
			"keynotes"		: "keynotes",
			"workshops"		: "workshops",
			"socials"		: "socials",

			//páginas de evento
			"paper/:id"     : "paper",
			"session/:id"   : "session",
			"keynote/:id"   : "keynote",
			"workshop/:id"  : "workshop",
			"social/:id"    : "social", 

			"user/:id"      : "user",
			"contacts"      : "contacts",
			"notifications"	: "notifications",
			"registration"	: "registration",

			"rankings"		: "rankings",
			"rankings/papers": "papersrank",
		},

		/**
		Route da página inicial da app

		@method index
		@private
		**/
		index: function() {
	  		console.log("ROUTE: homepage");
		},


		/**
		Route do menu agenda

		@method agenda
		@private
		**/
		agenda: function() {
			console.log("ROUTE: agenda");
			new AgendaView();
		},


		/**
		Route do menu de informações

		@method maininfo
		@private
		**/
		maininfo: function() {
			console.log("ROUTE: mainInfo");

			new MainInfoView();
		},


		/**
		Route do menu principal

		@method mainmenu
		@private
		**/
		mainmenu: function() {
			console.log("ROUTE: mainmenu");

			new MainMenuView();
		},


		/**
		Route da página de palestra

		@method paper
		@param {Number} id Id da palestra
		@private
		**/
		paper: function(id) {
			console.log("ROUTE: paper");
			new PaperView({modelId: id});
		},


		/**
		Route da página de sessão

		@method index
		@param {Number} id Id da sessão
		@private
		**/
		session: function(id) {
			console.log("ROUTE: paper");
			new SessionView({modelId: id});
		},


		/**
		Route da página de keynote

		@method keynote
		@param {Number} id Id do keynote
		@private
		**/
		keynote: function(id) {
			console.log("ROUTE: keynote");
			new KeynoteView({modelId: id});
		},


		/**
		Route da página de workshop

		@method keynote
		@param {Number} id Id do workshop
		@private
		**/
		workshop: function(id) {
			console.log("ROUTE: workshop");
			new WorkshopView({modelId: id});
		},


		/**
		Route da página de workshop

		@method keynote
		@param {Number} id Id do workshop
		@private
		**/
		social: function(id) {
			console.log("ROUTE: social event");
			new SocialEventView({modelId: id});
		},


		/**
		Route da página do utilizador

		@method user
		@param {Number} id Id do utilizador
		@private
		**/
		user: function(id){
			console.log("ROUTE: user");
			new ProfileView({modelId: id});
		},


		/**
		Route da lista de oradores

		@method speakers
		@private
		**/
		speakers: function(){
			console.log("ROUTE: speakers");
			new UsersListView({isSpeakers: true, pageId: "speakers-page", pageName: "Oradores"});
		},


		/**
		Route da lista de participantes

		@method participants
		@private
		**/
		participants: function(){
			console.log("ROUTE: participants");
			new UsersListView({isSpeakers: false, pageId: "participants-page", pageName: "Participates"});
		},


		/**
		Route da lista de papers

		@method papers
		@private
		**/
		papers: function(){
			console.log("ROUTE: participants");
			new EventsListView({type: "paper", pageId: "papers-page", pageName: "Papers"});
		},


		/**
		Route da lista de sessões

		@method sessions
		@private
		**/
		sessions: function(){
			console.log("ROUTE: sessions");
			new EventsListView({type: "session", pageId: "sessions-page", pageName: "Sessões"});
		},


		/**
		Route da lista de keynotes

		@method keynotes
		@private
		**/

		keynotes: function(){
			console.log("ROUTE: keynotes");
			new EventsListView({type: "keynote", pageId: "keynotes-page", pageName: "Keynotes"});
		},


		/**
		Route da lista de workshops

		@method workshops
		@private
		**/
		workshops: function(){
			console.log("ROUTE: workshops");
			new EventsListView({type: "workshop", pageId: "workshops-page", pageName: "Workshops"});
		},


		/**
		Route da lista de eventos sociais

		@method socials
		@private
		**/
		socials: function(){
			console.log("ROUTE: socials");
			new EventsListView({type: "social", pageId: "socials-page", pageName: "Eventos Sociais"});
		},


		/**
		Route do menu de contactos do utilizador

		@method contacts
		@private
		**/
		contacts: function(){
			console.log("ROUTE: contacts");
			new ContactsView();
		},


		/**
		Route do menu de notificações

		@method contacts
		@private
		**/
		notifications: function(){
			console.log("ROUTE: notifications");
			new NotificationsView();
		},


		/**
		Route do menu de notificações

		@method contacts
		@private
		**/
		registration: function(){
			console.log("ROUTE: registration");
			new RegistrationView();
		},


		/**
		Route do menu de rankings

		@method rankings
		@private
		**/
		rankings: function(){
			console.log("ROUTE: rankings");
			new RankingsView();
		},

		/**
		Route da página de prémios dos papers

		@method papersrank
		@private
		**/
		papersrank: function(){
			console.log("ROUTE: rankings papers");
			new PapersRankView();
		},
	});

  	return Router;

});
