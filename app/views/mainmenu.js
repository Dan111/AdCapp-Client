define([
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview"
], function ($, Backbone, Handlebars, BasicView) {

	return BasicView.extend({

		el: $("[data-role=content]"),

		id: "pageId",
		pageName: "Main Menu",

		template: "mainmenu-template",

		initialize: function ()
		{
			_.bindAll(this);

			var self = this;

			this.menu = false;

			self.renderLayout();
			self.render();
			
		},


		render: function () {
			var that = this;

			var context = null;

			var html = this.compileTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			$(document).bind("scrollstart", function() {
                that.closePopup;
            });

            $(document).bind("taphold", function() {
                that.closePopup;
            });

			$(document).ready(function() {
				  document.addEventListener("deviceready", that.onDeviceReady, false);
			});

			$(window).resize(function(){
    			that.resizePopUp();
                that.positioningPopUp();
                
    		});

			return this;

		},

        closePopup: function(){
            $('#menu-button').popup( "close" );
            this.menu = false;
        },

        positioningPopUp: function(){
            var toppos=($(window).height()/2) - ($('#menu-button').height()/2);
            var leftpos=($(window).width()/2) - ($('#menu-button').width()/2);
            $('#menu-button').css("top", toppos).css("left",leftpos-16);
        },

        resizePopUp: function(){
            $('#menu-button').width($(window).width());
        },

		onDeviceReady: function() {
			var that = this;
        	document.addEventListener("menubutton", that.onMenuKeyDown, false);
    	},


    	onMenuKeyDown: function() {
    		that = this;
    		
    		this.resizePopUp();
            
    		if(this.menu === false)
    		{
    			$('#menu-button').popup({
  					afterclose: function( event, ui ) {that.menu = false;}
				});

    			$('#menu-button').popup('open');

                that.positioningPopUp();

    			this.menu = true;
    		}
    		else
    		{
    			this.closePopup();
    		}	
    	}
    });
});