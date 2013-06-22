define([
	"backbone",
	"jquery",
	"underscore",
],

/**
Fornece uma camada de abstração para o localStorage

@class common.StorageWrapper
@alternateClassName StorageWrapper
**/
function (Backbone, $, _) {


	var storage = {

		/**
		Carrega da localStorage o valor associado à chave passada como parâmetro.

		@method load
		@static
		@param {Object} id Chave do valor que se pretende carregar.
		@param {Object} defaultValue Valor predefinido para ser retornado caso a chave não se encontre presente na localStorage.
		@return {Object} Valor associado à chave no localStorage ou defaultValue caso não esteja definido.
		@example
			StorageWrapper.load("points", 0)
		**/
		load: function (id, defaultValue) {

			var valueJson = window.localStorage.getItem(id.toString());
			var value = window.JSON.parse(valueJson);

			value = value || defaultValue;
			return value;
		},

		/**
		Grava na localStorage o par chave e valor passado como parâmetro.

		@method save
		@static
		@param {Object} id Chave do valor que se pretende guardar.
		@param {Object} value Valor que se quer guardar na localStorage.
		@return {Object} Valor passado como parâmetro.
		@example
			StorageWrapper.save("points", 7)
		**/
		save: function (id, value) {

			var readJson = window.JSON.stringify(value);
			window.localStorage.setItem(id.toString(), value);

			return value;
		},

	};

	return storage;

});