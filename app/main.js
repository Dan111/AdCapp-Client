require([
	"backbone",
	"jquery",
	"router",
	"handlebars.config",
	"app.config",

	"jquerymobile",
	"jquerymobile.config",
	"backbone.localStorage",
	"fullcalendar",
	"touchpunch"
],

/**
Classe principal que trata de inicializar a app

@class Main
**/
function (Backbone, $, Router, configHandlebars, configApp) {

	$(function () {

		console.log(configApp.confName);

		//Configura o handlebars (ver ficheiro handlebars.config)
		configHandlebars();

		//apresenta o loading entre paginas
		$.ajaxSetup({

			data: {
				"api": "true"
			},

			beforeSend: function() {
				$.mobile.loading('show', {theme: "d"});
			},

			complete: function() {
				$.mobile.loading('hide', {theme: "d"});
			}
		});

		//activa o modo API nos pedidos ao server
		Backbone.$.ajaxSetup({
			data: {
				"api": "true"
			}
		});


		//Inicialização do router global, responsável pela transição de páginas
		var router = new Router();

		// Trigger the initial route and enable HTML5 History API support, set the
		// root folder to '/' by default.  Change in app.js.
		Backbone.history.start();

		//Mostra o body só depois do jqm ter inicializado
		//$("body").show();

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

//Comentários para gerar a documentação gerar a herança correctamente

/**
View do Backbone

@class Backbone.View
**/

/**
Collection do Backbone

@class Backbone.Collection
**/

/**
Model do Backbone

@class Backbone.Model
**/

/**
Router do Backbone

@class Backbone.Router
**/