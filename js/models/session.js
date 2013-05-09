var app = app || {};



app.Session = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		hour: 'Unknown', // Unix Time in miliseconds, use -> new Date(this.model.get('someTime'));
		duration:0,  
		description: 'None',
		themes: 'Unknown',  
		local_id: -1,
		moderator_id: -1,
		votes: 0,
		papers: [{"name": 'Unknown',  "paper_id": -1}]
	},


	initialialize: function(){
		this.comments = new Comments;
        this.comments.url = '/session/' + this.id + '/comments';
        //Verificar proximo statement
        //this.comments.on("reset", this.updateCounts);

		console.log('Session created');
	}

	
});