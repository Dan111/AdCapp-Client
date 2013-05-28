define([
    "jquery",
    "backbone",
    "handlebars"
], function ($, Backbone, Handlebars) {

	return Backbone.View.extend({

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

		showErrorOverlay: function (options) {

			if(options.time == null)
				options.time = 2000;

			$.mobile.loading( 'hide' );

			$.mobile.loading( 'show', {
				            text: options.text,
				            textVisible: true,
				            textonly: true
			});

			setTimeout(function (){
				$.mobile.loading( 'hide' );
			}, options.time);

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
         },

         refreshJQM: function (){
         	$("#" + this.id).trigger("create");
         }


	});


});

