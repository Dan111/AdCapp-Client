define([
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview"
], function ($, Backbone, Handlebars, BasicView) {

	return BasicView.extend({

		el: $("[data-role=content]"),

		id: "rankings-page",
		pageName: "Prémios",

		template: "rankingsmenu-template",

		initialize: function ()
		{
			_.bindAll(this);

			var self = this;

			self.renderLayout();
			self.render();
			
		},


		render: function () {

			var context = null;

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();
			
			this.setElement($("[data-role=content]"));

			return this;

		}

    });
});