var app = app || {};



app.Feedback = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		link: 'Unknown'
	},


	initialialize: function(){
		
		console.log('Feedback created');
	}

	
});