define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "models/ranksinfo",
    "collections/papers",
    "views/award"
], function ($, Backbone, _, Handlebars, RanksInfo, PapersCollection, AwardView) {

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
		ID usado pelo div que contém a página

		@property id 
		@type String
		@static
		@final
		@default "paper-page"
		**/
		id: "paper-award-page",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Palestra"
		**/
		pageName: "Prémios Palestras",




		initialize: function ()
		{
			_.bindAll(this);

			var self = this;
			this.ranksInfo = new RanksInfo({type:"papers"});
			this.ranksInfo.fetch({
				success: function () {
					self.getStarted(self);
				}
			});

			
		},


		getStarted: function(self){

			var attrs = this.ranksInfo.attributes;

			this.isEvent = true;

			this.eventsType = app.TYPES.PAPER;

			this.votesArray = attrs.competitors;

			this.prizesArray = attrs.awards;

			this.modelCollection = new PapersCollection();

			this.voted = attrs.voted;

			this.modelId = this.votesArray[0].id;

			this.modelCollection.fetch({
				success: function () {
					self.model = self.modelCollection.getById(self.modelId);
					AwardView.prototype.initialize.apply(self);
				},
				error: function (){
					console.log("Fail ");
				}
			});	
		}

	});

});