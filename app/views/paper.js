define([
    "jquery",
    "backbone",
    "handlebars",
    "models/paper",
    "views/basicview"
], function ($, Backbone, Handlebars, PaperModel, BasicView) {

	return Backbone.View.extend({

		el: $("[data-role=content]"),

		id: "paper-page",
		pageName: "Palestra",

		template: "paper-template",
		aboutTabTemplate: "paper-about-tab-template",
		commentsTabTemplate: "comments-tab-template",


		paper: null,

		events: {

			"click #about-tab"		: "renderAboutTab",
			"click #comments-tab"	: "renderCommentsTab"

		},

		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;

			var self = this;

			this.paper = new PaperModel({id: modelId});
			this.paper.fetch({
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
			var paper = this.paper.attributes;

			var context = {
				title : paper.name,
				datetime : "12/05 12:30",
				room_name : paper.local.name,
				room_id : paper.local.id
			};

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			this.renderAboutTab();
			this.setElement($("[data-role=content]"));

			return this;

		},


		renderAboutTab: function () {
			console.log("about tab");

			var paper = this.paper.attributes;

			var context = {
				description : paper.description,
				speakers : paper.speakers
			};

			var html = this.compileTemplate(this.aboutTabTemplate, context);

			$("#tab-content").html(html);
			$("#" + this.id).trigger("create");

			return this;
		},


		renderCommentsTab: function () {

			console.log("comments tab");

			var paper = this.paper.attributes;

			var context = {
				comments: paper.comments
			};

			var html = this.compileTemplate(this.commentsTabTemplate, context);	


			$("#tab-content").html(html);
			$("#" + this.id).trigger("create");

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