define([
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview",
    "events/common/events",
    "collections/listusers",
], function ($, Backbone, Handlebars, BasicView, EventCollection, ListUserCollection) {

	return BasicView.extend({

		el: $("[data-role=content]"),

		id: "maininfoId",
		pageName: "Informações",

		template: "maininfo-template",
		
		

		events: {

			

		},

		initialize: function ()
		{
			
			_.bindAll(this);

			var self = this;
			
			
			
			self.renderLayout();
			self.render();
			    
			 
			
		},





		render: function () {

			
			var context = null;

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			return this;

		},




	});


});