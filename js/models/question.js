var app = app || {};



app.Question = Backbone.Model.extend({

	defaults: {
		name: 'Unknown',
		user_id: -1,
		content: 'Unknown'
		
	},


	initialialize: function(){
		
		console.log('Question created');
	}

	
});