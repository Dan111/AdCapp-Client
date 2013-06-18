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
	View da página de prémios dos workshop's

	@class WorkshopsRankView
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
		@default "workshop-award-page"
		**/
		id: "workshop-award-page",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Prémios Workshops"
		**/
		pageName: "Prémios Workshops",




		/**
		Construtor da classe. Faz o render da página, vai buscar a 
		informação dos prémios e rankings e quando tiver essa informação
		chama o método getStarted para fazer o rendering da página

		@constructor
		@protected
		@class WorkshopsRankView
		**/
		initialize: function ()
		{
			_.bindAll(this);

			var self = this;
			this.ranksInfo = new RanksInfo({type:"workshop"});
			this.ranksInfo.fetch({
				success: function () {
					self.getStarted(AwardView, self, true, app.TYPES.WORKSHOP, new GenericEventCollection({type:"workshops"}));
				}
			});

			
		},

	});

});