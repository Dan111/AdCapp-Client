define([
  "backbone"
],

function (Backbone) {

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

			"local/:id"		: "local",

			"user/:id"      : "user",
			"contacts"      : "contacts",
			"notifications"	: "notifications",
			"options"		: "options",
			"feedback"		: "feedback",

			"rankings"		: "rankings",
			"rankings/papers": "papersrank",
			"rankings/workshops": "workshopsrank",
			"rankings/speakers"	: "speakersrank",
			"rankings/sessions"	: "sessionsrank",
			"rankings/keynotes"	: "keynotesrank",

			"generalsearch"	: "generalsearch",
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

			require(["views/agenda"], function (AgendaView) {
				new AgendaView();
			});
			
		},


		/**
		Route do menu de informações

		@method maininfo
		@private
		**/
		maininfo: function() {
			console.log("ROUTE: mainInfo");

			require(["views/maininfo"], function (MainInfoView) {
				new MainInfoView();
			});
			
		},


		/**
		Route do menu principal

		@method mainmenu
		@private
		**/
		mainmenu: function() {
			console.log("ROUTE: mainmenu");

			require(["views/mainmenu"], function (MainMenuView) {
				new MainMenuView();
			});
			
		},


		/**
		Route da página de palestra

		@method paper
		@param {Number} id Id da palestra
		@private
		**/
		paper: function(id) {
			console.log("ROUTE: paper");

			require(["events/paper/paperview"], function (PaperView) {
				new PaperView({modelId: id});
			});
		},


		/**
		Route da página de sessão

		@method session
		@param {Number} id Id da sessão
		@private
		**/
		session: function(id) {
			console.log("ROUTE: session");

			require(["events/session/sessionview"], function (SessionView) {
				new SessionView({modelId: id});
			});
		},


		/**
		Route da página de keynote

		@method keynote
		@param {Number} id Id do keynote
		@private
		**/
		keynote: function(id) {
			console.log("ROUTE: keynote");

			require(["events/keynote/keynoteview"], function (KeynoteView) {
				new KeynoteView({modelId: id});
			});
		},


		/**
		Route da página de workshop

		@method keynote
		@param {Number} id Id do workshop
		@private
		**/
		workshop: function(id) {
			console.log("ROUTE: workshop");

			require(["events/workshop/workshopview"], function (WorkshopView) {
				new WorkshopView({modelId: id});
			});
		},


		/**
		Route da página de workshop

		@method keynote
		@param {Number} id Id do workshop
		@private
		**/
		social: function(id) {
			console.log("ROUTE: social event");

			require(["events/socialevent/socialeventview"], function (SocialEventView) {
				new SocialEventView({modelId: id});
			});
		},


		/**
		Route da página de um local

		@method local
		@param {Number} id Id do local
		@private
		**/
		local: function(id) {
			console.log("ROUTE: local");

			require(["views/local"], function (LocalView) {
				new LocalView({modelId: id});
			});
		},


		/**
		Route da página do utilizador

		@method user
		@param {Number} id Id do utilizador
		@private
		**/
		user: function(id){
			console.log("ROUTE: user");

			require(["views/profile"], function (ProfileView) {
				new ProfileView({modelId: id});
			});
			
		},


		/**
		Route da lista de oradores

		@method speakers
		@private
		**/
		speakers: function(){
			console.log("ROUTE: speakers");
			
			require(["views/userslist"], function (UsersListView) {
				new UsersListView({isSpeakers: true, pageId: "speakers-page", pageName: "Oradores"});
			});
			
		},


		/**
		Route da lista de participantes

		@method participants
		@private
		**/
		participants: function(){
			console.log("ROUTE: participants");

			require(["views/userslist"], function (UsersListView) {
				new UsersListView({isSpeakers: false, pageId: "participants-page", pageName: "Participates"});
			});
			
			
		},


		/**
		Route da lista de papers

		@method papers
		@private
		**/
		papers: function(){
			console.log("ROUTE: papers");
			
			require(["views/eventslist"], function (EventsListView) {
				new EventsListView({type: "paper", pageId: "papers-page", pageName: "Papers"});
			});
			
		},


		/**
		Route da lista de sessões

		@method sessions
		@private
		**/
		sessions: function(){
			console.log("ROUTE: sessions");

			require(["views/eventslist"], function (EventsListView) {
				new EventsListView({type: "session", pageId: "sessions-page", pageName: "Sessões"});
			});
			
		},


		/**
		Route da lista de keynotes

		@method keynotes
		@private
		**/

		keynotes: function(){
			console.log("ROUTE: keynotes");

			require(["views/eventslist"], function (EventsListView) {
				new EventsListView({type: "keynote", pageId: "keynotes-page", pageName: "Keynotes"});
			});
			
		},


		/**
		Route da lista de workshops

		@method workshops
		@private
		**/
		workshops: function(){
			console.log("ROUTE: workshops");

			require(["views/eventslist"], function (EventsListView) {
				new EventsListView({type: "workshop", pageId: "workshops-page", pageName: "Workshops"});
			});
			
		},


		/**
		Route da lista de eventos sociais

		@method socials
		@private
		**/
		socials: function(){
			console.log("ROUTE: socials");

			require(["views/eventslist"], function (EventsListView) {
				new EventsListView({type: "social", pageId: "socials-page", pageName: "Eventos Sociais"});
			});
			
		},


		/**
		Route do menu de contactos do utilizador

		@method contacts
		@private
		**/
		contacts: function(){
			console.log("ROUTE: contacts");

			require(["contacts/contactsview"], function (ContactsView) {
				new ContactsView();
			});
			
		},


		/**
		Route do menu de notificações

		@method contacts
		@private
		**/
		notifications: function(){
			console.log("ROUTE: notifications");

			require(["notifications/notificationsview"], function (NotificationsView) {
				new NotificationsView();
			});
		},


		/**
		Route do menu de opções

		@method options
		@private
		**/
		options: function(){
			console.log("ROUTE: options");

			require(["account/optionsview"], function (OptionsView) {
				new OptionsView();
			});
		},


		/**
		Route do menu de rankings

		@method rankings
		@private
		**/
		rankings: function(){
			console.log("ROUTE: rankings");

			require(["views/rankings"], function (RankingsView) {
				new RankingsView();
			});
			
		},

		/**
		Route da página de prémios dos papers

		@method papersrank
		@private
		**/
		papersrank: function(){
			console.log("ROUTE: rankings papers");

			require(["views/papersrank"], function (PapersRankView) {
				new PapersRankView();
			});
			
		},

		/**
		Route da página de prémios dos oradores

		@method speakersrank
		@private
		**/
		speakersrank: function(){
			console.log("ROUTE: rankings speakers");

			require(["views/speakersrank"], function (SpeakersRankView) {
				new SpeakersRankView();
			});
			
		},

		/**
		Route da página de prémios dos workshops

		@method workshopsrank
		@private
		**/
		workshopsrank: function(){
			console.log("ROUTE: rankings workshops");

			require(["views/workshopsrank"], function (WorkshopsRankView) {
				new WorkshopsRankView();
			});
		},

		/**
		Route da página de prémios dos keynotes

		@method keynotesrank
		@private
		**/
		keynotesrank: function(){
			console.log("ROUTE: rankings keynotes");

			require(["views/keynotesrank"], function (KeynotesRankView) {
				new KeynotesRankView();
			});
		},

		/**
		Route da página de prémios das sessões

		@method sessionsrank
		@private
		**/
		sessionsrank: function(){
			console.log("ROUTE: rankings sessions");

			require(["views/sessionsrank"], function (SessionsRankView) {
				new SessionsRankView();
			});
		},


		/**
		Route da página de feedback

		@method feedback
		@private
		**/
		feedback: function(){
			console.log("ROUTE: feedback");

			require(["feedback/feedbackview"], function (FeedbackView) {
				new FeedbackView();
			});
		},

		/**
		Route da página de pesquisa geral

		@method generalsearch
		@private
		**/
		generalsearch: function(){
			console.log("ROUTE: generalsearch");

			require(["views/generalsearch"], function (GeneralSearchView) {
				new GeneralSearchView();
			});
		},
	});

  	return Router;

});
