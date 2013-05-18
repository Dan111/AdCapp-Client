define([
	'handlebars',
	'jquery',
    'moment'
], 

function (Handlebars, $, Moment) {

    return function () {

        //Imprime o parâmetro na consola
        Handlebars.registerHelper('whatis', function (param) {
            console.log(param);
        });


        /*PARTIALS*/

        //Partial da informação de um utilizador (avatar, nome, instituiçao, area)
        Handlebars.registerPartial('userinfo', $("#user-info-partial").html());

        //Partial de um comentario
        Handlebars.registerPartial('comment', $("#comment-partial").html());

        //Partial da lista de speakers
        Handlebars.registerPartial('speaker', $("#speaker-partial").html());
        
        //Partial da lista de participants
        Handlebars.registerPartial('participant', $("#participant-partial").html());




        /* HELPER */

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

        //Devolve a data formatada para as páginas dos eventos
        Handlebars.registerHelper('parseDate', function (date) {
            var date = date.toString();

            var formattedDate = Moment(date);
            return formattedDate.local().format("DD/MM HH:mm");

        });

	};

});