define([
    "jquery",
    "backbone",
    "handlebars",
    "collections/users",
    "views/basicview"
], function ($, Backbone, Handlebars, UserCollection, BasicView) {

	return Backbone.View.extend({

		el: $("[data-role=content]"),

		id: "",
		pageName: "",

		template: "users-template",
		
		users: null,

		events: {

			

		},

		initialize: function (args)
		{
			_.bindAll(this);


			var self = this;

			this.speakers = args.isSpeakers;
			this.id = args.pageId;
			this.pageName = args.pageName; 

			this.users = new UserCollection();
			this.users.fetch({
				success: function () {
					self.renderLayout();
					self.render();
				}
			});
		},


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

		compileTemplate: function (templateName, context) {

			var source   = $("#" + templateName).html();
			var template = Handlebars.compile(source);
			var html = template(context);

			return html;

		},


		render: function () {
			
			var models = this.users.toJSON();

			console.log(models);
			
			var context = {
				speakers: this.speakers,
				users : models
			};

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			return this;

		},




		enhanceJQMComponentsAPI: function () {
    // changePage
             $.mobile.changePage("#" + this.id, {
                 changeHash: false
             });

             $("#" + this.id).trigger("create");
         },
    // Add page to DOM
         removePreviousPageFromDOM: function () {
             // $("main").append($(this.el));
             // $("#profile").page();
             $("[data-role=page]:first").remove();
         }


	});


});