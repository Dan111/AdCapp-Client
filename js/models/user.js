var app = app || {};



app.User = Backbone.Model.extend({

	defaults: {
		name: 'Unknown', 
		email: 'Unknown',
		password: 'Unknown', 
		institution: 'Unknown',
		area:'Unknown',
		image: 'None',
		publish_schedule: false,
		votes: 0,
		author: false

	},


	initialialize: function(){

		this.contacts = new Contacts;
        this.contacts.url = '/user/' + this.id + '/contacts';
        //Verificar proximo statement
        //this.contacts.on("reset", this.updateCounts);


		console.log('User created');
	},

	//Activar ou desactivar publicar agenda
	toggleSchedule: function(){
		this.save({
			publish_schedule: !this.get('publish_schedule')
		});
	}  
	
});