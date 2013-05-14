define([
    "jquery",
    "backbone",
    "handlebars",
    "models/paper"
], function ($, Backbone, Handlebars, PaperModel) {

	return Backbone.View.extend({

		id: "paper-page",

		paper: null,

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



		},


		render: function () {



			var paper = this.paper.attributes;


			var context = {
				title : paper.name,
				datetime : "12/05 12:30",
				roomName : paper.local.name,
				roomId : paper.local.id,
				description : paper.description,
				speakers : paper.speakers
			};

			var source   = $("#paper-template").html();
			var template = Handlebars.compile(source);

			var html = template(context);


			$("[data-role=content]").append(html);

			this.enhanceJQMComponentsAPI();



			//faz refresh da pagina, para ficar com os estilos do jQM
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