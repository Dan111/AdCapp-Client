define("contacts/contactsview",
[
    "jquery",
    "backbone",
    "handlebars",
    "./contact",
    "./contacts",
    "views/basicview",
    "text!./contacts.html"
], function ($, Backbone, Handlebars, ContactModel, Contacts, BasicView, ContactsTemplate) {

	console.log("Contacts loaded");

	/**
	View do menu de contactos da aplicação

	@class ContactsView
	@extends BasicView
	@main contacts
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
		ID usado pelo div que contém a página

		@property id 
		@type String
		@static
		@final
		@default "contacts-page"
		**/
		id: "contacts-page",


		/**
		Nome da página, apresentado no header

		@property pageName 
		@type String
		@static
		@final
		@default "Contactos"
		**/
		pageName: "Contactos",


		/**
		Template usado pela página

		@property template 
		@type String
		@final
		@protected
		@default "contacts-template"
		**/
		template: ContactsTemplate,


		/**
		Definição dos listeners para os cliques nos botões presentes na
		página de contactos

		@property events
		@type Object
		@protected
		**/
		events: {

			"click .remove-contact"		: "removeContact",
			"click #export-contacts"	: "exportContacts"

		},


		/**
		Carrega os contactos do utilizador e chama o método responsável pelo
		rendering da página. Também cria um event listener para a remoção de
		contactos da colecção, para fazer o rerendering.

		@constructor
		@class ContactsView
		**/
		initialize: function (){

			_.bindAll(this);

			var self = this;

			this.contacts = new Contacts();
			this.contacts.fetch({
				success: function () {
					self.renderLayout();
					self.setElement($("div[data-role=content]"));
					self.render();
				}
			});

			this.listenTo(this.contacts, 'remove', this.render);
		},


		/**
		Faz o rendering dos contactos.

		@method render
		@protected
		@chainable
		**/
		render: function (){

			var context = {
				contacts: this.contacts.toJSON()
			};

			var html = this.compileTextTemplate(this.template, context);

			this.$el.html(html);
			this.enhanceJQMComponentsAPI();

			console.log("contacts rendered");
			
			return this;

		},


		/**
		Função chamada quando o utilizador clica no botão de remover
		um contacto.

		@method removeContact
		@protected
		**/
		removeContact: function (e){

			var $this = $(e.target).parent();
			var userId = parseInt($this.attr("user-id"), 10);

			var user = this.contacts.get(userId);
			user.destroy();
		},


		/**
		Função chamada quando o utilizador clica no botão de 'Exportar Contactos'

		@method exportContacts
		@protected
		**/
		exportContacts: function (){ //TODO: Adicionar um popup de confirmação

			this.contacts.exportContacts();

			this.showErrorOverlay({text: "Contactos Exportados"});
		}


	});

});