var app = app || {};



app.OutsideLocal = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		coord_x: 0, 
		coord_y: 0,
		type: 'Unknown'
	},


	initialialize: function(){
		console.log('OutsideLocal created');
	}

	
});