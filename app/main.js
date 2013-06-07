require([
	"jquery",
	"router",
	"views/profile",
	"collections/contacts",
	"handlebars.config",
	"app.config",
	"jquerymobile",
	"jquerymobile.config"
],

/**
Classe principal que trata de inicializar a app

@class Main
**/
function ($, Router, Profile, Contacts, configHandlebars, configApp) {


	//Inicialização do router global, responsável pela transição de páginas
	var router = new Router();

	// Trigger the initial route and enable HTML5 History API support, set the
	// root folder to '/' by default.  Change in app.js.
	Backbone.history.start();

	//Mostra o body só depois do jqm ter inicializado
	$("body").show();

	//Configura o handlebars (ver ficheiro handlebars.config)
	configHandlebars();

	//Configura definições da aplicação
	configApp();

	//apresenta o loading entre paginas
	$.ajaxSetup({
		beforeSend: function() {
			$.mobile.loading('show');
		},

		complete: function() {
			$.mobile.loading('hide');
		}
	});


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
