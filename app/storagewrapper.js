define([
	"backbone",
	"jquery",
	"underscore",
],

/**
Fornece uma camada de abstração para o localStorage

@class StorageWrapper
**/
function (Backbone, $, _) {


	var storage = {

		load: function (id, defaultValue) {

			var valueJson = window.localStorage.getItem(id.toString());
			var value = window.JSON.parse(valueJson);

			value = value || defaultValue;
			return value;
		},

		save: function (id, value) {

			var readJson = window.JSON.stringify(value);
			window.localStorage.setItem(id.toString(), value);

			return value;
		},

	};

	return storage;

});