define("informations/maininfoview",
[
    "jquery",
    "backbone",
    "handlebars",
    "common/basicview",
    "events/common/events",
    
    "text!./generalinfotemplates/infomenu.html"
], function ($, Backbone, Handlebars, BasicView, EventCollection, InfoMenuTemplate) {

 	/**
    View do menu de informações

    @class informations.MainInfoView
    @alternateClassName MainInfoView
    @extends BasicView
    **/
	return BasicView.extend({

		/**
        Elemento da DOM onde são colocados todas as páginas

        @property el 
        @type String
        @static
        @readonly
        
        **/
		el: $("[data-role=content]"),

		/**
        Id da página

        @property id 
        @type String
        @static
        @readonly
        
        **/
		id: "maininfoId",

        /**
        Nome da página, apresentado no header

        @property pageName 
        @type String
        @static
        @readonly
        
        **/
		pageName: "Informações",

		/**
        Template da página

        @property template 
        @type String
        @readonly
        @protected
        
        **/
		template: InfoMenuTemplate,

		/**
        Construtor da classe. Faz o render da página

        @constructor
        **/
		initialize: function ()
		{
			
			_.bindAll(this);

			var self = this;
			
			self.renderLayout();
			self.render();
		},

		/**
        Faz o rendering do layout da página 

        @method render
        @protected
        @chainable
        **/
		render: function () {

			var context = null;

			var html = this.compileTextTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			return this;

		},




	});


});