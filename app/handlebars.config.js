define([
	'handlebars',
	'jquery'
], 

function (Handlebars, $) {

    return function () {

        Handlebars.registerHelper('whatis', function (param) {
            console.log(param);
        });

        Handlebars.registerPartial('userinfo', $("#user-info-partial").html());

        Handlebars.registerHelper('getFirstName', function (param) {
            var name = param.toString();

            var first = name.substring(0, name.lastIndexOf(" ") + 1);
            return first;
        });

        Handlebars.registerHelper('getLastName', function (param) {
            var name = param.toString();

            var last = name.substring( name.lastIndexOf(" ") + 1, name.length);
            return last;
        });

	};

});