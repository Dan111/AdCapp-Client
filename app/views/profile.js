define([
    "jquery",
    "backbone",
    "handlebars"
], function ($, Backbone, Handlebars) {

    return Backbone.View.extend({
        id : "ProfileGeneralView", 
        getHeaderTitle : function () {
            return "Perfil";
        },

        getSpecificTemplateValues : function () {
            this.user ={
                name: 'Antonio Mendes', 
                lastname: 'mendes',
                email: 'Unknown',
                password: 'Unknown', 
                institution: 'FCT',
                area:'Informatica',
                image: 'None',
                publish_schedule: false,
                votes: 0,
                author: true};
            return this.user;
        },
        events : function () {
            // merged events of BasicView, to add an older fix for back button functionality
            return _.extend({
                'click #add-user': 'addUser',
                'click #vote': 'vote',
                'click #contacts': 'renderContacts'
            }, this.constructor.__super__.events);
        },

        initialize: function() {
            

            this.render();
        },

        
        addUser: function() {
            
        },

        vote: function() {

        },

        renderContacts: function() {
            
        },

         render: function () {
             this.cleanupPossiblePageDuplicationInDOM();

             $("div#author-ranking").html('<a href="#index" id="vote" data-role="button" data-theme="d" >Votar</a>');
/*             this.addPageToDOMAndRenderJQM();
             this.enhanceJQMComponentsAPI();*/
             $("#vote").buttonMarkup( "refresh" );
             console.log("RENDER");

             console.log("template");


         },
    // // Generate HTML using the Handlebars templates
    //      getTemplateResult: function (templateDefinitionID, templateValues) {
    //          return window.JST[templateDefinitionID](templateValues);
    //      },
    // // Collect all template paramters and merge them
    //      getBasicPageTemplateResult: function () {
    //          var templateValues = {
    //              templatePartialPageID: this.id,
    //              headerTitle: this.getHeaderTitle()
    //          };
    //          var specific = this.getSpecificTemplateValues();
    //          $.extend(templateValues, this.getSpecificTemplateValues());
    //          return this.getTemplateResult(this.getTemplateID(), templateValues);
    //      },
    //      getRequestedPageTemplateResult: function () {
    //          this.getBasicPageTemplateResult();
    //      },
         enhanceJQMComponentsAPI: function () {
    // changePage
             $.mobile.changePage("#" + this.id, {
                 changeHash: false,
                 role: this.role
             });
         },
    // Add page to DOM
         addPageToDOMAndRenderJQM: function () {
             $("body").append($(this.el));
             $("#profile").page();
         },
    // Cleanup DOM strategy
         cleanupPossiblePageDuplicationInDOM: function () {
         // Can also be moved to the event "pagehide": or "onPageHide"
             var $previousEl = $("#" + this.id);
             var alreadyInDom = $previousEl.length >= 0;
             if (alreadyInDom) {
                 $previousEl.detach();
             }
         },
    // Strategy to always support back button with disabled navigation
         goBackInHistory: function (clickEvent) {
             history.go(-1);
             return false;
         }
    });
});