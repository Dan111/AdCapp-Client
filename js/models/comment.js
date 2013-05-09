var app = app || {};



app.Comment = Backbone.Model.extend({

	defaults: {	
		user_name: 'Unknown',
		user_id: -1,
		content: 'Unknown'
	},


	initialialize: function(){
		
		console.log('Comment created');
	}

	
});