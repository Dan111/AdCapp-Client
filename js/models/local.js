var app = app || {};



app.Local = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		coord_x: 0, 
		coord_y: 0
	},


	initialialize: function(){
		console.log('Local created');
	}

	
});