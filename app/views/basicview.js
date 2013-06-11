define([
    "jquery",
    "backbone",
    "handlebars"
], function ($, Backbone, Handlebars) {

	/**
	View abstracta extendida por todas as outras views.
	Contém código comum entre todas as views, como o rendering do layout, compilação de templates,
	refrescamento do jQuery Mobile, ...

	@class BasicView
	@extends Backbone.View
	**/
	return Backbone.View.extend({


		/**
		Elemento da DOM onde são colocados todas as páginas

		@property mainContainer 
		@type String
		@static
		@final
		@default "div[data-role=content]"
		**/
		mainContainer: "div[data-role=content]",


		/**
		Id a ser usado no div da página

		@attribute id
		@type {String}
		@protected
		@required
		**/


		/**
		Nome da página que é exibido no header do layout

		@attribute pageName
		@type {String}
		@protected
		@required
		**/


		/**
		Faz o rendering do layout comum a todas a páginas

		@method renderLayout
		@protected
		@chainable
		**/
		renderLayout: function () {

			var pid = this.id;
			var name = this.pageName;

			var context = {page_id: pid, page_name: name};
			var html = this.compileTemplate("layout-template", context);

			//adiciona página ao body
			$("body").append(html);
			this.enhanceJQMComponentsAPI();

			//limpa a pagina anterior do DOM
			this.removePreviousPageFromDOM();

			return this;
		},


		/**
		Compila um template Handlebars com o contexto dado e retorna o HTML gerado

		@method compileTemplate
		@static
		@param {String} templateName Id do template
		@param {Object} context Contexto da compilação do template
		@return {String} HTML gerado através da compilação do template
		**/
		compileTemplate: function (templateName, context) {

			var source   = $("#" + templateName).html();
			var template = Handlebars.compile(source);
			var html = template(context);

			return html;

		},


		/**
		Apresenta um popup com uma mensagem

		@method showErrorOverlay
		@static
		@param {Object} options Configuração do popup
			@param {String} options.text Mensagem a ser mostrada pelo popup
			@param {Integer} [options.time=2000] Durante quanto tempo, em milisegundos, 
													deve o popup ser apresentado
		@example
			showErrorOverlay("Erro", 5000)
		**/
		showErrorOverlay: function (options) {

			if(options.time == null)
				options.time = 2000;

			$.mobile.loading( 'hide' );

			$.mobile.loading( 'show', {
				            text: options.text,
				            textVisible: true,
				            textonly: true
			});

			setTimeout(function (){
				$.mobile.loading( 'hide' );
			}, options.time);

		},


		/**
		Inicia a transição de página do jQuery Mobile para a página corrente

		@method enhanceJQMComponentsAPI
		@private
		**/
		enhanceJQMComponentsAPI: function () {

			var $page = $("#" + this.id);

			$.mobile.changePage("#" + this.id, {
				changeHash: false
			});

			$page.trigger("create");
		},


		/**
		Remove a página anterior do DOM

		@method removePreviousPageFromDOM
		@private
		**/
		removePreviousPageFromDOM: function () {
			$("[data-role=page]:first").remove();
		},



		/**
		Faz o refrescamento dos componentes do jQuery Mobile

		@method refreshJQM
		@protected
		**/
		refreshJQM: function (){
			$("#" + this.id).trigger("create");
		}


	});


});

