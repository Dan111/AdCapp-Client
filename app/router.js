define([

  "backbone",

  //Views

  "views/paper"

],

function (Backbone, PaperView) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "index": "index",
      "paper/:id" : "paper"
    },

    index: function() {
      console.log("ROUTE: homepage");
    },

    paper: function(id) {
      console.log("ROUTE: paper");

      new PaperView({modelId: id});
    }
  });

  return Router;

});
