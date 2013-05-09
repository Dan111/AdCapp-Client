var app = app || {};



app.Prize = Backbone.Model.extend({

	defaults: {
		name: 'Unknown',
		prizeable_id: -1
		prizeable_type: 'Unknown'

	},


	initialialize: function(){

		console.log('Prize created');
	},

	
});