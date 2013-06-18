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
	View da página de prémios das palestras

	@class PapersRankView
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
		@default "paper-award-page"
		**/
		id: "paper-award-page",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Prémios Palestras"
		**/
		pageName: "Prémios Palestras",



		/**
		Construtor da classe. Faz o render da página, vai buscar a 
		informação dos prémios e rankings e quando tiver essa informação
		chama o método getStarted para fazer o rendering da página

		@constructor
		@protected
		@class PapersRankView
		**/
		initialize: function ()
		{
			_.bindAll(this);

			var self = this;
			this.ranksInfo = new RanksInfo({type:"paper"});
			this.ranksInfo.fetch({
				success: function () {
					self.getStarted(AwardView, self, true, app.TYPES.PAPER, new GenericEventCollection({type:"papers"}));
				}
			});

			
		}

	});

});