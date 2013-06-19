define("informations/localslist/localslistview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "collections/locals",
    "views/basicview",
    "app.config",

    "text!./localslist.html"
], function ($, Backbone, _, Handlebars, LocalsCollection, BasicView, App, LocalsListTemplate) {

	/**
	View das páginas com listagens de locais

	@class LocalsListView
	@extends BasicView
	**/
	return BasicView.extend({
		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@final
		@default "div[data-role=content]"
		**/
		el: "div[data-role=content]",

		/**
		Id da página em questão, muda consoante
		o tipo de lista de eventos

		@property id 
		@type String
		@static
		@final
		@default ""
		**/
		id: "locals-page",

		/**
		Template da lista de locais

		@property template 
		@type template
		@final
		@protected
		@default LocalsListTemplate
		**/
		template:LocalsListTemplate,

		/**
		Nome da página de locais

		@property pageName 
		@type String
		@static
		@final
		@default "Locais"
		**/
		pageName: "Locais",


		/**
		Construtor da classe LocalsListView.
		Neste construtor é feito o fetch de uma LocalsCollection, que representa
		os elementos a serem apresentados na view. Ainda neste contrutor é
		chamado o render da página

		@constructor
		@protected
		@class LocalsListView
        **/
		initialize: function ()
		{
			_.bindAll(this);


			var self = this;


			this.locals = new LocalsCollection();

			this.locals.fetch({
				success: function () {
					console.log("localsloaded");
				    self.renderLayout();
					self.render();

				},
				error: function () {
					console.log("localsNOTloaded");
				}
			});

			
		},

		/**
		Este método chama outro para fazer o tratamento de toda a informação
		dos locais a ser apresentada e depois faz o rendering da página

		@method render
		@protected
		@chainable
		**/
		render: function () {
			console.log(this.locals);
			var treatedLocals = this.locals.map(this.treatLocals);

			var context = {
				localsList: treatedLocals
			};

			var html = this.compileTextTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			return this;

		},

		/**
		Faz o tratamento do local passado, preparando-o para a listagem

		@method treatLocals
		@protected
		@param 
		@return   
		**/
		treatLocals: function(local_obj){
			
			var localAttrs = local_obj.attributes;

		    return {
			    	url: "#local/" + localAttrs.id.toString(),
			     	name: localAttrs.name
		    };
		}


	});


});