define("rankings/rankspages/sessionsrankview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "rankings/ranksinfo",
    "rankings/genericeventcollection",
    "rankings/awardview"
], function ($, Backbone, _, Handlebars, RanksInfo, GenericEventCollection, AwardView) {

	/**
	View da página de prémios das sessões

	@class rankings.rankpages.SessionsRankView
	@alternateClassName SessionsRankView
	@extends AwardView
	**/
	return AwardView.extend({

		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@readonly
		
		**/
		el: "div[data-role=content]",


		/**
		Id da página

		@property id 
		@type String
		@static
		@readonly
		
		**/
		id: "session-award-page",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@readonly
		
		**/
		pageName: "Prémios Sessions",



		/**
		Construtor da classe. Faz o render da página, vai buscar a 
		informação dos prémios e rankings e quando tiver essa informação
		chama o método getStarted para fazer o rendering da página

		@constructor
		**/
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