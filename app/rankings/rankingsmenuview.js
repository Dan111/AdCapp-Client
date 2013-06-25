define("rankings/rankingsmenuview",
[
    "jquery",
    "backbone",
    "handlebars",
    "common/basicview",

    "text!./templates/rankings.html"
], function ($, Backbone, Handlebars, BasicView, RankingsTemplate) {

	/**
	View do menu de prémios

	@class rankings.RankingsView
	@alternateClassName RankingsView
	@extends BasicView
	**/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@readonly
		
		**/
		el: $("[data-role=content]"),

		/**
		Id da página

		@property id 
		@type String
		@static
		@readonly
		
		**/
		id: "rankings-page",

		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@readonly
		
		**/
		pageName: "Prémios",

		/**
		Template da página

		@property template 
		@type String
		@readonly
		@protected
		
		**/
		template: RankingsTemplate,

		/**
		Construtor da classe. Faz o render da página

		@constructor
		**/
		initialize: function ()
		{
			_.bindAll(this);

			var self = this;

			self.renderLayout();
			self.render();
			this.isWifiActive();
			
		},

		/**
		Faz o rendering do layout da página

		@method render
		@protected
		@chainable
		**/
		render: function () {

			var context = null;

			var html = this.compileTextTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();
			
			this.setElement($("[data-role=content]"));

			return this;

		}

    });
});