define([

  "backbone",

  //Views

  "views/paper",
  "views/profile",
  "views/userslist",
  "views/agenda",
  "views/contacts",
  "views/maininfo",
  "views/mainmenu"
],

function (Backbone, PaperView, ProfileView, UsersListView, AgendaView, ContactsView, MainInfoView, MainMenuView) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({


    routes: {
      ""              : "main",
      "index"         : "index",
      "agenda"        : "agenda",
      "maininfo"      : "maininfo",
      "mainmenu"      : "mainmenu",
      "speakers"      : "speakers",
      "participants"  : "participants",
      "paper/:id"     : "paper",
      "user/:id"      : "user",
      "contacts"      : "contacts"
    },

    index: function() {
      console.log("ROUTE: homepage");
    },

    agenda: function() {
      console.log("ROUTE: agenda");
      new AgendaView();
    },

    maininfo: function() {
      console.log("ROUTE: mainInfo");

      new MainInfoView();
    },

    mainmenu: function() {
      console.log("ROUTE: mainmenu");

      new MainMenuView();
    },

    paper: function(id) {
      console.log("ROUTE: paper");
      new PaperView({modelId: id});
    },

    user: function(id){
      console.log("ROUTE: user");
      new ProfileView({modelId: id});
    },

    speakers: function(){
      console.log("ROUTE: speakers");
      new UsersListView({isSpeakers: true, pageId: "speakers-page", pageName: "Oradores"});
    },

    participants: function(){
      console.log("ROUTE: participants");
      new UsersListView({isSpeakers: false, pageId: "participants-page", pageName: "Participates"});
    },

    contacts: function(id){
      console.log("ROUTE: contacts");
      new ContactsView();
    }
  });

  return Router;

});
