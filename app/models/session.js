define([
    "jquery",
    "backbone",
    "views/basicview"
], 

function ($, Backbone, BasicView) {

	return Backbone.Model.extend({

		url: "http://adcapp.apiary.io/sessions/",

		defaults: {

			name: null,
			hour:0,
			duration:0,
			is_scheduled: false,
			session_id: 0,
			local: null,
			speakers:null,
			papers: null,
			description: "Sem descrição",
			themes: null,
			comments: null

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