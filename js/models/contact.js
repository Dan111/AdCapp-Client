var app = app || {};



app.Contact = Backbone.Model.extend({

	defaults: {	
		user_name: 'Unknown',
		user_id: -1,
		e-mail: 'Unknown'
	},


	initialialize: function(){
		
		console.log('Contact created');
	}

	
});