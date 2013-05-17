define([

  "backbone",

  //Views

  "views/paper",

  //Profile

  "views/profile",
  "collections/contacts"

],

function (Backbone, PaperView, ProfileView, Contacts) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({

    initialize: function (){
      this.contacts = new Contacts();
      console.log("INIT");
    },

    routes: {
      "": "main",
      "index": "index",
      "paper/:id" : "paper",
      "user/:id" : "user"
    },

    index: function() {
      console.log("ROUTE: homepage");
    },

    paper: function(id) {
      console.log("ROUTE: paper");

      new PaperView({modelId: id});
    },

    user: function(id){
      console.log("ROUTE: user");

      new ProfileView({modelId: id, contacts: this.contacts});
    }
  });

  return Router;

});
