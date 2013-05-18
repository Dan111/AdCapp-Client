define([
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview"
], function ($, Backbone, Handlebars, BasicView) {

	return Backbone.View.extend({

		el: "#tab-content",

		template: "comments-tab-template",

		events: {
			"click #new-comment"	: "newComment"
		},

		comments: null,

		initialize: function (args) {

			this.args = args;
			this.render();

		},

		render: function (){
			var html = this.compileTemplate(this.template, this.args);

			this.$el.html(html);

			return this;
		},

		compileTemplate: function (templateName, context) {

			var source   = $("#" + templateName).html();
			var template = Handlebars.compile(source);
			var html = template(context);

			return html;

		}

	});

});

