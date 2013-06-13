define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		url: "http://danielmagro.apiary.io/Rooms/",

		defaults: {

			name: null,
			coord_x: 0,
			coord_y: 0,
			events: null

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