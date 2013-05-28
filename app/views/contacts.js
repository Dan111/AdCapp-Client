define([
    "jquery",
    "backbone",
    "handlebars",
    "models/contact",
    "collections/contacts",
    "views/basicview"
], function ($, Backbone, Handlebars, ContactModel, Contacts, BasicView) {

	return BasicView.extend({

		el: "div[data-role=content]",

		id: "contacts-page",
		pageName: "Contactos",

		template: "contacts-template",

		events: {

			"click .remove-contact"		: "removeContact",
			"click #export-contacts"	: "exportContacts"

		},

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


		render: function (){

			var context = {
				contacts: this.contacts.toJSON()
			};

			var html = this.compileTemplate(this.template, context);

			this.$el.html(html);
			this.enhanceJQMComponentsAPI();

			console.log("contacts rendered");
			
			return this;

		},


		removeContact: function (e){

			var $this = $(e.target).parent();
			var userId = parseInt($this.attr("user-id"), 10);

			var user = this.contacts.get(userId);
			user.destroy();
		},


		exportContacts: function (){ //TODO: Adicionar um popup de confirmação

			this.contacts.exportContacts();

			this.showErrorOverlay({text: "Contactos Exportados"});

			// var c = navigator.contacts.create();
			// c.displayName = "Antonio Mendes";
			// c.emails = [new ContactField('work', 'mendes@mail.com', false)];
			// c.note = "AdCapp";
			// var org = new ContactOrganization(false, '', 'FCT', 'IA', '');
			// c.organizations = [org];
			// c.save(function(){}, function(){});

		}


	});

});