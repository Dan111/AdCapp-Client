define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/paper",
    "views/basicview",
    "views/comment",
    "views/aboutevent"
], function ($, Backbone, _, Handlebars, PaperModel, BasicView, CommentsView, AboutView) {

	return BasicView.extend({

		el: "div[data-role=content]",

		tabContainer: "#tab-content",

		template: "event-template",

		aboutTabId: "about-tab",
		aboutTabName: "Sobre",

		commentsTabId: "comments-tab",
		commentsTabName: "Comentários",

		model: null,
		tabs: null,
		tabNames: null,

		events: {

			"click #about-tab"		: "renderAboutTab",
			"click #comments-tab"	: "renderCommentsTab"

		},

		initialize: function ()
		{
			_.bindAll(this);

			this.tabs = [];
			this.tabNames = [];

			this.renderLayout();
			this.setElement($("[data-role=content]"));

			this.createTabs();
			this.render();
			this.renderAboutTab();

		},


		render: function () {
			var model = this.model.attributes;

			var context = {
				title 		: model.name,
				datetime 	: model.hour,
				room_name 	: model.local.name,
				room_id 	: model.local.id,
				tabs 		: this.tabNames

			};

			var html = this.compileTemplate(this.template, context);

			this.$el.append(html);
			this.enhanceJQMComponentsAPI();

			this.$tabContent = $("#tab-content");

			//Coloca a tab 'Sobre' como a seleccionada por predefinição
			//TODO: arranjar uma solução mais elegante
			this.$("[data-role=navbar] a:first").addClass("ui-btn-active");
			
			return this;

		},


		renderAboutTab: function () {

			console.log("about tab");

			this.renderTab(this.about);

			return this;
		},



		renderCommentsTab: function () {

			console.log("comments tab");

			this.renderTab(this.comments);

			return this;
		},

		createTabs: function (){

			var model = this.model;
			var comments = this.model.get('comments');

			this.comments = new CommentsView({
				title 		: "Novo Comentário",
				comments 	: comments,
				model 		: model,
				url			: 'comments'
			});
			this.addTab(this.comments, {id: this.commentsTabId, name: this.commentsTabName});

		},


		addTab: function (view, name, pos) { //TODO: colocar o pos a funcionar

			var index = pos;

			if(index == null)
				index = this.tabs.length;


			this.tabs[index] = view;
			this.tabNames[index] = name;

		},


		renderTab: function (view) {

			this.disableTabEvents();

			view.delegateEvents();
			view.render();

			this.refreshJQM();

			return this;
		},


		disableTabEvents: function () {

			_.each(this.tabs, function (view){
				view.undelegateEvents();
			})
		}

	});

});