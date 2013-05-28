define([

  "backbone",

  //Views

  "views/paper",
  "views/profile",
  "views/userslist",
  "views/agenda",
  "views/contacts"
],

function (Backbone, PaperView, ProfileView, UsersListView, AgendaView, ContactsView) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({


    routes: {
      ""              : "main",
      "index"         : "index",
      "agenda"        : "agenda",
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
