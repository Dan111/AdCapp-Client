define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/ranksinfo",
    "collections/users",
    "views/award"
], function ($, Backbone, _, Handlebars, RanksInfo, UsersCollection, AwardView) {

	/**
	View da página de prémios dos oradores

	@class SpeakersRankView
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
		@default "user-award-page"
		**/
		id: "user-award-page",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Prémios Oradores"
		**/
		pageName: "Prémios Oradores",




		initialize: function ()
		{
			_.bindAll(this);

			var self = this;
			this.ranksInfo = new RanksInfo({type:"speakers"});
			this.ranksInfo.fetch({
				success: function () {
					self.getStarted(AwardView, self, false, null, new UsersCollection());
				}
			});

			
		},


	});

});