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
            this.model.fetch().done(
                function () {
                    self.renderLayout();
                    self.render();
                });

		},


		render: function () {
			var model = this.model.attributes;

			var sessions =  _.filter(model.events, function(e){ 
				return e.type == "Session"; 
			});
			var papers =  _.filter(model.events, function(e){ 
				return e.type == "Paper"; 
			});
			var keynotes =  _.filter(model.events, function(e){ 
				return e.type == "Keynote"; 
			});
			var workshops =  _.filter(model.events, function(e){ 
				return e.type == "Workshop"; 
			});
			var socials =  _.filter(model.events, function(e){ 
				return e.type == "SocialEvent"; 
			});

			var context = {
				local_name 		: model.name,
				coord_x		: model.coord_x,
				coord_y 	: model.coord_y,
				events 		: model.events,
				localId		: model.id,
				localType	: model.type,
				sessions	: sessions,
				papers		: papers,
				keynotes	: keynotes,
				workshops	: workshops,
				socials 		: socials,

			};

			var html = this.compileTextTemplate(this.template, context);

			$("[data-role=content]").append(html);
            this.enhanceJQMComponentsAPI();

			return this;

		},

	});

});