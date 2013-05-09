var app = app || {};



app.Notification = Backbone.Model.extend({

	defaults: {
		title:'Unknown', 
		content: 'Unknown'
	},


	initialialize: function(){
		
		console.log('Notification created');
	}

	
});