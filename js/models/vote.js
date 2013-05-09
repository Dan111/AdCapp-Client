var app = app || {};



app.Vote = Backbone.Model.extend({

	defaults: {
		user_id: -1, 
		votable_id: -1,
		votable_type: 'Unknown'

	},


	initialialize: function(){

		console.log('Vote created');
	},

	
});