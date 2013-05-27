define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		url: "http://danielmagro.apiary.io/events/",

		defaults: {

			id: 0,
			name: null,
			hour: 0,
			minutes: 0,
			day: 0,
			month: 0,
			year: 0, 
			duration: 0, 
			type: null,
			local_id: -1,
			users_id_array: null

		},

		initialize: function (){

			//adiciona o id do modelo ao url, para o Backbone poder fazer fetch da informação
			this.url += this.id;
		}

	});

});
