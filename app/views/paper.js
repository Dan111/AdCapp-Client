define([
    "jquery",
    "backbone",
    "handlebars",
    "models/paper"
], function ($, Backbone, Handlebars, PaperModel) {

	return Backbone.View.extend({

		el: $("[data-role=content]"),

		id: "paper-page",

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

			var source   = $("#layout-template").html();
			var template = Handlebars.compile(source);

			var pid = this.id

			var context = {pageId: pid};
			var html = template(context);

			//adiciona página ao body
			$("body").append(html);
			this.enhanceJQMComponentsAPI();



			//faz refresh da pagina, para ficar com os estilos do jQM
			$("#paper-page").trigger("create");

			//limpa a pagina anterior do DOM
			$("[data-role=page]:first").remove();

			return this;



		},


		render: function () {
			var paper = this.paper.attributes;

			var context = {
				title : paper.name,
				datetime : "12/05 12:30",
				room_name : paper.local.name,
				room_id : paper.local.id
			};

			var source   = $("#paper-template").html();
			var template = Handlebars.compile(source);
			var html = template(context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			//faz refresh da pagina, para ficar com os estilos do jQM
			$("#paper-page").trigger("create");


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

			var source   = $("#paper-about-tab-template").html();
			var template = Handlebars.compile(source);
			var html = template(context);

			$("#tab-content").html(html);
			$("#paper-page").trigger("create");
		},


		renderCommentsTab: function () {

			console.log("comments");

			var paper = this.paper.attributes;

			var context = {
				comments: paper.comments
			};



			var source   = $("#comments-tab-template").html();
			var template = Handlebars.compile(source);
			var html = template(context);

			console.log(context);

			

			$("#tab-content").html(html);
			$("#paper-page").trigger("create");

		},


		enhanceJQMComponentsAPI: function () {
    // changePage
             $.mobile.changePage("#" + this.id, {
                 changeHash: false
             });
         },
    // Add page to DOM
         addPageToDOMAndRenderJQM: function () {
             $("main").append($(this.el));
             $("#profile").page();
         }


	});


});