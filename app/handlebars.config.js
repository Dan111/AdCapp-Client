define([
	'handlebars',
	'jquery',
    "underscore",
    'moment'
], 

/**
Classe que trata de inicializar os partials e os helpers do Handlebars

@class HandlebarsConfig
**/
function (Handlebars, $, _, Moment) {

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

        //Partial do calendar
        Handlebars.registerPartial('calendar', $("#calendar-partial").html());



        /* HELPER */

        //Dado o nome do utilizador, devolve todo o nome exceptuando o último
        Handlebars.registerHelper('getFirstName', function (param) {
            var name = param.toString();

            var first = name.substring(0, name.lastIndexOf(" ") + 1);
            return first;
        });

        //Dado o nome do utilizador, devolve apenas o primeiro nome e o último nome
        Handlebars.registerHelper('getFirstAndLastName', function (param) {
            var name = param.toString();

            var first = name.substring(0, name.indexOf(" "));
            var last = name.substring( name.lastIndexOf(" ") + 1, name.length);
            return first +" "+ last;
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
            return formattedDate.utc().format("DD/MM HH:mm");

        });


        //Devolve a data formatada para as notificações
        Handlebars.registerHelper('formatDate', function (date) {
            var date = date.toString();

            var formattedDate = Moment(date); //TODO: pôr em português
            return formattedDate.utc().calendar();

        });


        //Verifica se a propriedade se encontra definida
        Handlebars.registerHelper('isDefined', function (param, body) {
            if(param != null)
                return body.fn(this);
        });



        //Faz o rendering do bloco caso o vetor tenha um length 
        //superior ao especificado
        Handlebars.registerHelper('ifLengthGreater', function (array, len, body) {
            if(array.length > len)
                return body(this);
        });


	};

});