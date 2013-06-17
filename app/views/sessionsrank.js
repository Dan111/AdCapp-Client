define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/ranksinfo",
    "collections/genericeventcollection",
    "views/award"
], function ($, Backbone, _, Handlebars, RanksInfo, GenericEventCollection, AwardView) {

	/**
	View da página de prémios das sessões

	@class SessionsRankView
	@extends AwardView
	**/
	return AwardView.extend({

		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@final
		@default "div[data-role=content]"
		**/
		el: "div[data-role=content]",


		/**
		ID usado pelo div que contém a página

		@property id 
		@type String
		@static
		@final
		@default "session-award-page"
		**/
		id: "session-award-page",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Prémios Sessões"
		**/
		pageName: "Prémios Sessions",




		initialize: function ()
		{
			_.bindAll(this);

			var self = this;
			this.ranksInfo = new RanksInfo({type:"session"});
			this.ranksInfo.fetch({
				success: function () {
					self.getStarted(AwardView, self, true, app.TYPES.SESSION, new GenericEventCollection({type:"sessions"}));
				}
			});

			
		},

	});

});