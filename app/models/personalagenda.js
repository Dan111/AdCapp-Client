define([
    "jquery",
    "backbone"
], 

function ($, Backbone) {

	return Backbone.Model.extend({

		url: "http://danielmagro.apiary.io/personalagendas/",

		defaults: {
			id: -1,
			chosen_events: null
		},

		initialize: function (){

        	//adiciona o id do modelo ao url, para o Backbone poder fazer fetch da informação
			this.url += this.id;

		}

	});

});