define("rankings/sessionsrankview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "./ranksinfo",
    "./genericeventcollection",
    "./awardview"
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
		Id da página

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



		/**
		Construtor da classe. Faz o render da página, vai buscar a 
		informação dos prémios e rankings e quando tiver essa informação
		chama o método getStarted para fazer o rendering da página

		@constructor
		@protected
		@class SessionsRankView
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