define("rankings/rankingsmenuview",
[
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview",

    "text!./rankings.html"
], function ($, Backbone, Handlebars, BasicView, RankingsTemplate) {

	/**
	View do menu de prémios

	@class RankingsView
	@extends BasicView
	**/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@final
		@default $("[data-role=content]")
		**/
		el: $("[data-role=content]"),

		/**
		Id da página

		@property id 
		@type String
		@static
		@final
		@default "rankings-page"
		**/
		id: "rankings-page",

		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Prémios"
		**/
		pageName: "Prémios",

		/**
		Template da página

		@property template 
		@type template
		@final
		@protected
		@default RankingsTemplate
		**/
		template: RankingsTemplate,

		/**
		Construtor da classe. Faz o render da página

		@constructor
		@protected
		@class EventView
		**/
		initialize: function ()
		{
			_.bindAll(this);

			var self = this;

			self.renderLayout();
			self.render();
			
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