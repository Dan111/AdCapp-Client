define([
    "jquery",
    "backbone",
    "app.config",
    "backbone.cachingsync"
], 

function ($, Backbone, App) {

	/**
    Modelo de um local

    @class map.locals.Local
    @alternateClassName Local
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		url: App.URL + "/locals/",

		/**
		Alteração do método sync para utilizar o localStorage como cache

		@property sync
		@type Function
		@private
		**/
		sync: Backbone.cachingSync(Backbone.sync, 'adcapp-local'),

		defaults: {

			id: null,
			name: null,
			coord_x: 0,
			coord_y: 0,
			events: null,
			type: null

		},


		initialize: function (){
			this.url += this.id;
		},


		arrayOfEventIds: function(){
			return  _.map(this.get('events'), function(event){
				return event.id;
			});
		},

	});

});