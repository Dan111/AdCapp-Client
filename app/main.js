require([
  'jquery',
  'router',
  'views/profile',
  'collections/contacts',
  'handlebars.config',
  'jquerymobile',
  'jquerymobile.config'
],

function ($, Router, Profile, Contacts, configHandlebars) {

  
  //Inicialização do router global, responsável pela transição de páginas
  var router = new Router();

  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default.  Change in app.js.
  Backbone.history.start();

  //Mostra o body só depois do jqm ter inicializado
  $("body").show();

  //Configura o handlebars (ver ficheiro handlebars.config)
  configHandlebars();

  //Faz rendering da página profile
  //Futuramente isto será retirado e substituído pelo menu inicial
  //new Profile();

  //Cria uma collections de contacts com id 1 e faz fetch ao localStorage dessa collection 
  this.contacts = new Contacts({ id: 1 });
  this.contacts.fetch();

  //Redireciona os links <a> para o router do Backbone
  $(document).on("click", "a[href]:not([data-bypass])", function(evt) {

    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };

    if(href.attr === "#")
      return;

    console.log("redirecting to: " + href.attr);
    evt.preventDefault();
    Backbone.history.navigate(href.attr, true);

  });



});
