define([
	'handlebars',
	'jquery'
], 

function (Handlebars, $) {

    return function () {

        Handlebars.registerHelper('whatis', function (param) {
            console.log(param);
        });

        //Partial da informação de um utilizador (avatar, nome, instituiçao, area)
        Handlebars.registerPartial('userinfo', $("#user-info-partial").html());

        //Partial de um comentario
        Handlebars.registerPartial('comment', $("#comment-partial").html());

        //Dado o nome do utilizador, devolve todo o nome exceptuando o último
        Handlebars.registerHelper('getFirstName', function (param) {
            var name = param.toString();

            var first = name.substring(0, name.lastIndexOf(" ") + 1);
            return first;
        });

        //Devolve o último nome do utilizador
        Handlebars.registerHelper('getLastName', function (param) {
            var name = param.toString();

            var last = name.substring( name.lastIndexOf(" ") + 1, name.length);
            return last;
        });

	};

});