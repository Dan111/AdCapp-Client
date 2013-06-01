define([
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview"
], function ($, Backbone, Handlebars, BasicView) {

	return BasicView.extend({

		el: "#tab-content", //para inserir os elementso na página
		id: "tab-content", //para fazer refresh do jqm

		template: "session-papers-tab-template",

		initialize: function (args) {

			//nome a ser dado à descrição (por exemplo, 'Abstract')
			this.papers = args.papers;

		},


		render: function () {

			if(!this.el)
				this.setElement($("#tab-content"));

			var context = {
				papers 		: this.papers
			};

			var html = this.compileTemplate(this.template, context);

			this.$el.html(html);

			return this;

		}

	});

});