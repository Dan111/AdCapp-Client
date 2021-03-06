define("common/basicview",
[
    "jquery",
    "backbone",
    "handlebars",

    "text!./layout.html"
], function ($, Backbone, Handlebars, LayoutTemplate) {

	/**
	View abstracta extendida por todas as outras views.
	Contém código comum entre todas as views, como o rendering do layout, compilação de templates,
	refrescamento do jQuery Mobile, ...

	@class common.BasicView
	@alternateClassName BasicView
	@extends Backbone.View
	**/
	return Backbone.View.extend({


		/**
		Elemento da DOM onde são colocados todas as páginas

		@property mainContainer 
		@type String
		@static
        @readonly
        @protected
		**/
		mainContainer: "div[data-role=content]",


		/**
		Id a ser usado no div da página

		@property id
		@type String
		@static
        @readonly
        @protected
		**/
		id: null,


		/**
		Nome da página que é exibido no header do layout

		@property pageName
		@type String
		@static
        @readonly
        @protected
		**/
		pageName: null,


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
			var html = this.compileTextTemplate(LayoutTemplate, context);

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
		Compila um template Handlebars com o contexto dado e retorna o HTML gerado. A diferença para com
		o compileTemplate é que recebe uma string com o template em vez do id.

		@method compileTextTemplate
		@static
		@param {String} text String com o template
		@param {Object} context Contexto da compilação do template
		@return {String} HTML gerado através da compilação do template
		**/
		compileTextTemplate: function (text, context) {

			var template = Handlebars.compile(text);
			var html = template(context);

			return html;
		},


		/**
		Apresenta um popup com uma mensagem

		@method showErrorOverlay
		@static
		@param {Object} options Configuração do popup
		@param {String} options.text Mensagem a ser mostrada pelo popup
		@param {Number} [options.time=2000] Durante quanto tempo, em milisegundos, 
													deve o popup ser apresentado
		@example
			showErrorOverlay({text: "Erro", time: 5000})
		**/
		showErrorOverlay: function (options) {

			if(options.time == null)
				options.time = 2000;

			$.mobile.loading( 'hide' );

			$.mobile.loading( 'show', {
				            text: options.text,
				            textVisible: true,
				            textonly: true,
				            theme: "d"
			});

			setTimeout(function (){
				$.mobile.loading( 'hide' );
			}, options.time);

		},

		/**
		Apresenta um alert com uma mensagem a avisar que o o dispositivo
		tem o wi-fi desligado e que este pode não conter a informação
		pretendida devido a isso. Este aviso só é feito apenas uma vez
		por sessão.

		@method isWifiActive

		**/
		isWifiActive: function(){
			if(!app.hasAlerted)
			{
				var networkState = navigator.connection.type;

				var msg = "Para uma melhor experiência, active o Wi-Fi.";

				if(networkState === Connection.NONE || networkState === Connection.CELL)
					navigator.notification.alert(
	    				msg,
	   					function (){
	   						app.hasAlerted = true;
	   					},
	   					'Alerta de rede Wi-fi'
					);

			}
		},

		/**
		Inicia a transição de página do jQuery Mobile para a página corrente

		@method enhanceJQMComponentsAPI
		@protected
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

