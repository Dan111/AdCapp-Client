var app = app || {};



app.Workshop = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		hour: 'Unknown', // Unix Time in miliseconds, use -> new Date(this.model.get('someTime'));
		duration: 0,  
		description: 'None',
		themes: 'Unknown',  
		local_id: -1,
		instructor_id: -1,
		votes: 0,
		tutors: [{"name": 'Unknown',  "tutor_id": -1}]
	},


	initialialize: function(){
		this.comments = new Comments;
        this.comments.url = '/workshop/' + this.id + '/comments';
        //Verificar proximo statement
        //this.comments.on("reset", this.updateCounts);

		console.log('Workshop created');
	}

	
});