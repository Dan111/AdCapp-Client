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

        $menubutton: null,

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

            //Eventos para o bom funcionamento do menu de icons
            $(document).bind("taphold", function() {
                that.closePopup;
            });

            //Quando tudo estiver pronto activa lança o método onDeviceReady
			$(document).ready(function() {
				  document.addEventListener("deviceready", that.onDeviceReady, false);
			});
            //Recalcula o tamanho do popup e reposiona-o
			$(window).resize(function(){
    			that.resizePopUp();
                that.positioningPopUp();      
    		});

            this.$menubutton = $('#menu-button');

            //Impede o scroll quando o popup está activo
            this.$menubutton.on( "popupafteropen", function( event, ui ) {
                $("body").on("touchmove", false);
            } );
            
            //Volta a activar o scroll depois do popup fechar
            this.$menubutton.on( "popupafterclose", function( event, ui ) {
                $("body").unbind("touchmove");
            } );

			return this;

		},

        closePopup: function(){
            this.$menubutton.popup( "close" );
            this.menu = false;
            $(window).unbind('scroll');
        },

        positioningPopUp: function(){
            var toppos=($(window).height()/2) - (this.$menubutton.height()/2);
            var leftpos=($(window).width()/2) - (this.$menubutton.width()/2);

            this.$menubutton.css("top", toppos).css("left",leftpos-16);
        },

        resizePopUp: function(){
            this.$menubutton.width($(window).width());
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
    			this.$menubutton.popup({
  					afterclose: function( event, ui ) {that.menu = false;}
				});

    			this.$menubutton.popup('open');
                this.positioningPopUp();

    			this.menu = true;
    		}
    		else
    			this.closePopup();

    	}
    });
});