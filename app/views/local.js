define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/local",
    "views/basicview"
], function ($, Backbone, _, Handlebars, LocalModel, BasicView) {


	return BasicView.extend({

		el: "div[data-role=content]",

		template: "local-template",

		pageName: "Local",

		id: "local-page",


		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;

            var self = this;

			this.model = new LocalModel({id: modelId});
            this.model.fetch({
                success: function () {
                    self.renderLayout();
                    self.render();
                }
            });


		},


		render: function () {
			var model = this.model.attributes;

			var context = {
				local_name 		: model.name,
				coord_x		: model.coord_x,
				coord_y 	: model.coord_y,
				events 		: model.events

			};

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
            this.enhanceJQMComponentsAPI();

			return this;

		},

	});

});