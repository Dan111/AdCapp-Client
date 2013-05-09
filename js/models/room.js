var app = app || {};



app.Room = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		coord_x: 0, 
		coord_y: 0
	},


	initialialize: function(){
		this.events = new Events;
        this.events.url = '/room/' + this.id + '/events';
        //Verificar proximo statement
        //this.events.on("reset", this.updateCounts);
		console.log('Room created');
	}

	
});