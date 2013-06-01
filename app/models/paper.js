define([
    "jquery",
    "backbone",
    "views/basicview"
], 

function ($, Backbone, BasicView) {

	return Backbone.Model.extend({

		url: "http://adcapp.apiary.io/papers/",

		defaults: {

			name: null,
			hour:0,
			duration:0,
			is_scheduled: false,
			session_id: 0,
			local: null,
			ranking:null,
			speakers:null,
			description: "Sem descrição",
			themes: null,
			comments: null,
			questions: null

		},

		initialize: function (){
			this.url += this.id;
		},

		//TODO: factorizar método
		submitComment: function (options){

			var self = this;

			$.ajax({
				method: "POST",

				async: false,

				timeout: 5000,

				url: this.url + "/" + options.url,

				data: { "email":"toni@mail.com", "password": "123456", "content": options.text, 
						"id": this.id, type: 'Paper' },

				beforeSend: function () {
					$.mobile.loading( 'show', {
				            text: "A enviar",
				            textVisible: true
				    });
				},

				complete: function () {
					//override do ajaxsetup para nao fazer hide do load spinner
				},

				success: function () {
					$.mobile.loading( 'hide' );
					options.success();
				},

				error: function (){
					BasicView.prototype.showErrorOverlay({text: "Erro no envio"});
				}
			});


		}

	});

});

/**

Exemplo da API:
{

	id: 1,

	name: "Data Management",

	hour: "2013-05-12T12:30:00Z",

	duration: 30,

	is_scheduled: true, //se o utilizador adicionou o evento à sua agenda pessoal

	session_id: 1,

	local: {

		id: 1,
		name: "Sala 112"

	},

	ranking: {

		pos: 3,
		votes: 37,
		has_voted: true //se o utilizador votou neste evento
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

	themes: ["tema1", "tema2"],

	"comments": [
        {
            "author_id": 1,
            "author_name": "José da Maia",
            "comment": "Sed gravida sodales erat eget consectetur. Nulla magna eros, suscipit faucibus venenatis vel, feugiat sed metus. Integer enim ante, ultrices et sagittis a, pretium vitae libero. Maecenas ullamcorper lobortis dui ac elementum. Mauris magna risus, consectetur sit amet rhoncus eu, commodo sed libero. Sed gravida tincidunt mollis. Ut ut elit. "
        },
        {
            "author_id": 2,
            "author_name": "Carlos Manuel do Rosário",
            "comment": "Sed felis orci, scelerisque vel gravida a, commodo lacinia elit. Maecenas vel turpis tincidunt ligula ultrices consequat. Aliquam ipsum sapien, pretium non venenatis et, dictum non purus. Aliquam aliquam facilisis est in dictum. Vestibulum at arcu vehicula erat mollis lacinia a sit amet erat. Sed sapien eros, consectetur id tincidunt. "
        }
    ],


    "questions":[
        {
            "author_id": 1,
            "author_name": "José da Maia",
            "question_id": 1,
            "question": "Sed gravida sodales erat eget consectetur. Nulla magna eros, suscipit faucibus venenatis vel, feugiat sed metus. Integer enim ante, ultrices et sagittis a, pretium vitae libero. Maecenas ullamcorper lobortis dui ac elementum. Mauris magna risus, consectetur sit amet rhoncus eu, commodo sed libero. Sed gravida tincidunt mollis. Ut ut elit. "
            "votes": 23,
            "has_voted": false
        },
        {
            "author_id": 1,
            "author_name": "José da Maia",
            "question_id": 1,
            "question": "Sed gravida sodales erat eget consectetur. Nulla magna eros, suscipit faucibus venenatis vel, feugiat sed metus. Integer enim ante, ultrices et sagittis a, pretium vitae libero. Maecenas ullamcorper lobortis dui ac elementum. Mauris magna risus, consectetur sit amet rhoncus eu, commodo sed libero. Sed gravida tincidunt mollis. Ut ut elit. "
            "votes": 23,
            "has_voted": false
        }
    ]

}
*/