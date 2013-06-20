define([
    "jquery",
    "backbone",
    "app.config"
], 

function ($, Backbone, App) {

	return Backbone.Model.extend({

		url: App.URL + "/locals/",
//url: "http://lcatalaya.apiary.io/Locals/",
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