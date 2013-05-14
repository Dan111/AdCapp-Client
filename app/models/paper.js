define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		url: "http://adcapp.apiary.io/papers/",

		defaults: {

			name: null,
			hour:0,
			duration:0,
			isScheduled: false,
			local: null,
			ranking:null,
			speakers:null,
			description: "Sem descrição",
			themes: null

		},

		initialize: function (){

			// this.comments = new Comments;
			// this.comments.url = '/papers/' + this.id + '/comments';

			// this.questions = new Questions;
			// this.questions.url = '/papers/' + this.id + '/questions';

			this.url += this.id;



		}

	});

});

/**

Exemplo da API:
{

	id: 1,

	name: "Data Management",

	hour: "formato da data",

	duration: 30,

	isScheduled: true, //se o utilizador adicionou o evento à sua agenda pessoal

	local: {

		id: 1,
		name: "Sala 112"

	},

	ranking: {

		pos: 3,
		votes: 37,
		hasVoted: true //se o utilizador votou neste evento
	},

	speakers: [
		{
			id: 1,
			name: "António Mendes",
			institution: "Fundação Gulbenkian",
			area: "Software Arquitecture",
			image: "link"
		}
	],

	description: "lorem ipsum",

	themes: ["tema1", "tema2"]

}
*/