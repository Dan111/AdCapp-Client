define("informations/userslist/userslistview",
[
    "jquery",
    "backbone",
    "handlebars",
    "./listusers",
    "views/basicview",

    "text!./userslist.html"
], function ($, Backbone, Handlebars, ListUserCollection, BasicView, UsersListTemplate) {

	/**
	View das páginas com listagens de oradores e participantes

	@class UsersListView
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
		a lista de utilizadores a apresentar

		@property id 
		@type String
		@static
		@final
		@default ""
		**/
		id: "",

		/**
		Nome da página em questão, muda consoante
		a lista de utilizadores a apresentar

		@property pageName 
		@type String
		@static
		@final
		@default ""
		**/
		pageName: "",

		/**
		Template base de todas as páginas
		de listas de utilizadores

		@property template 
		@type template
		@final
		@protected
		@default UsersListTemplate
		**/
		template: UsersListTemplate,
		
		/**
		Collection com modelos do tipo ListUser,
		que compõe a lista de utilizadores a serem
		apresentados

		@property cusers 
		@type Backbone.Collection
		@final
		@protected
		@default null
		**/
		users: null,

		/**
		Construtor da classe UsersListView.
		Neste construtor é feito o fetch de uma UserCollection, que representa
		os elementos a serem apresentados na view. Ainda neste contrutor é
		feito o rendering necessário.

		@constructor
		@protected
		@class UsersListView
		@param {Object} args contém um booleano, id da página e nome da página
			@param {boolean} args.isSpeakers Booleano que indentifica a collection que temos de
			utilizar
            @param {String} args.id id da página
            @param {String} args.pageName nome da página
        **/
		initialize: function (args)
		{
			_.bindAll(this);


			var self = this;

			this.speakers = args.isSpeakers;
			this.id = args.pageId;
			this.pageName = args.pageName; 

			this.users = new ListUserCollection({isSpeakers: this.speakers});

			this.users.fetch({
				success: function () {
					self.renderLayout();
					self.render();
				}
			});
		},

		/**
		Faz o rendering do layout das páginas de listagem de utilizadores,
		passando o template e o contexto adequeados, sendo que o contexto
		é composto pela collection de utilizadores a apresentar(users) e
		por um booleano que revela se os utilizadores são oradores ou
		participantes.

		@method render
		@protected
		@chainable
		**/
		render: function () {
			
			var models = this.users.toJSON();
			
			var context = {
				speakers: this.speakers,
				users : models
			};

			var html = this.compileTextTemplate(this.template, context);

			$("[data-role=content]").append(html);
			this.enhanceJQMComponentsAPI();

			
			this.setElement($("[data-role=content]"));

			return this;

		}


	});


});