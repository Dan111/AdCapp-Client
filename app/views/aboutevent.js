define([
    "jquery",
    "backbone",
    "handlebars",
    "views/basicview"
], function ($, Backbone, Handlebars, BasicView) {

	return BasicView.extend({

		el: "#tab-content", //para inserir os elementso na página
		id: "tab-content", //para fazer refresh do jqm

		template: "event-about-tab-template",

		initialize: function (args) {

			//nome a ser dado à descrição (por exemplo, 'Abstract')
			this.descName = args.descName; 
			this.description = args.description;

			//nome a ser dado aos oradores (por exemplo, 'Autores', 'Moderador', 'Tutores')
			this.speakersTitle = args.speakersTitle; 
			this.speakers = args.speakers;

		},


		render: function () {

			if(!this.el)
				this.setElement($("#tab-content"));

			var context = {
				descName		: this.descName,
				description 	: this.description,

				speakersTitle	: this.speakersTitle,
				speakers 		: this.speakers
			};

			var html = this.compileTemplate(this.template, context);

			this.$el.html(html);

			return this;

		}

	});

});