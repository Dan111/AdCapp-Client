define([

  "backbone",

  //Views

  "views/paper",

  //Profile

  "views/profile"

],

function (Backbone, PaperView, ProfileView) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
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

      new ProfileView({modelId: id});
    }
  });

  return Router;

});
