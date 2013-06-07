// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file and the JamJS
  // generated configuration file.
	deps: ["../vendor/jam/require.config", "main"],

	paths: {
		'jquerymobile' 			: "../vendor/libs/jquerymobile",
		'backbone.localStorage' : "../vendor/libs/backbone.localStorage",
		'fullcalendar'			: "../vendor/libs/fullcalendar",
		'jquerymobile.config' 	: 'jquerymobile.config',
		'handlebars.config' 	: 'handlebars.config',
		'app.config'			: 'app.config'
	 
	},

	shim: {
		// Put shims here.
		'jquerymobile.config'	: ['jquery'],
		'jquerymobile'			: ['jquery','jquerymobile.config'],
		'handlebars.config' 	: ['handlebars']
	}

});