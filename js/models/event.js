var app = app || {};



app.Event = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		hour: 'Unknown', // Unix Time in miliseconds, use -> new Date(this.model.get('someTime'));
		duration: 0, 
		type: 'Unknown',
		local_id: -1,
		users_id_array: [-1]
	},


	initialialize: function(){

		console.log('Event created');
	}

	
});