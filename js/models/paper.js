var app = app || {};



app.Paper = Backbone.Model.extend({

	defaults: {
		name:'Unknown', 
		hour: 'Unknown', // Unix Time in miliseconds, use -> new Date(this.model.get('someTime'));
		duration: 0,  
		description: 'None'
		themes: 'Unknown',  
		local_id: -1,
                session_id: -1,
                votes: 0,
                authors: [{"name": 'Unknown',  "author_id": -1}]
	},


	initialialize: function(){

                this.comments = new Comments;
                this.comments.url = '/paper/' + this.id + '/comments';
                //Verificar proximo statement
                //this.comments.on("reset", this.updateCounts);

                this.questions = new Questions;
                this.questions.url = '/paper/' + this.id + '/questions';
                //Verificar proximo statement
                //this.questions.on("reset", this.updateCounts);


                console.log('Paper created');
	}

	
});