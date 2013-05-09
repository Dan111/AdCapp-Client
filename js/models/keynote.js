var app = app || {};



app.Keynote = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		hour: 'Unknown', // Unix Time in miliseconds, use -> new Date(this.model.get('someTime'));
		duration: 0,  
		description: 'None',
		themes: 'Unknown',  
		local_id: -1,
		speaker_id: -1,
		votes: 0
	},


	initialialize: function(){

		this.comments = new Comments;
        this.comments.url = '/keynote/' + this.id + '/comments';
        //Verificar proximo statement
        //this.comments.on("reset", this.updateCounts);
		console.log('Keynote created');
	}

	
});