define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/session",
    "views/event",
    "views/comment",
    "views/aboutevent",
    "views/sessionpapers"
], function ($, Backbone, _, Handlebars, SessionModel, EventView, CommentsView, AboutView, SessionPapersView) {

	return EventView.extend({

		el 				: "div[data-role=content]",

		id 				: "session-page",
		pageName		: "Sessão",

		descName		: "Descrição",
		speakersTitle	: "Moderador",

		papersTabId		: "papers-tab",
		papersTabName 	: "Papers",


		events: function(){

			return _.extend({
				"click #papers-tab"	: "renderPapersTab"
			}, EventView.prototype.events);
		},


		initialize: function (args)
		{
			_.bindAll(this);

			var modelId = args.modelId;
			var self = this;

			this.model = new SessionModel({id: modelId});
			this.model.fetch({
				success: function () {
					EventView.prototype.initialize.apply(self);
				}
			});
		},


		renderPapersTab: function () {

			console.log("papers tab");

			this.renderTab(this.papers);

			return this;
		},


		createTabs: function (){

			this.about = new AboutView({
				descName		: this.descName,
				description 	: this.model.get('description'),

				speakersTitle	: this.speakersTitle,
				speakers 		: this.model.get('speakers')
			});
			this.addTab(this.about,{id: this.aboutTabId, name: this.aboutTabName});


			this.papers = new SessionPapersView({
				papers 			: this.model.get('papers')
			});
			this.addTab(this.papers,{id: this.papersTabId, name: this.papersTabName});

			//chamada do método createTabs da superclasse
			EventView.prototype.createTabs.apply(this);

		}


		


	});


});