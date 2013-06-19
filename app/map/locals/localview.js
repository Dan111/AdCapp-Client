define("map/locals/localview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",

    "./local",
    "common/basicview",

    "text!./local.html"
], function ($, Backbone, _, Handlebars, LocalModel, BasicView, LocalTemplate) {


	return BasicView.extend({

		el: "div[data-role=content]",

		template: LocalTemplate,

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

			var html = this.compileTextTemplate(this.template, context);

			$("[data-role=content]").append(html);
            this.enhanceJQMComponentsAPI();

			return this;

		},

	});

});