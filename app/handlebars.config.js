define([
	'handlebars',
	'jquery',
    "underscore",
    'moment',

    "app.config",

    "text!events/templates/_comment.html",
    "text!informations/_generalresults.html",
    "text!informations/_eventsresult.html",
    "text!informations/_usersresult.html",
    "text!agenda/_calendar.html",
    "text!profile/_userinfo.html"
], 

/**
Classe que trata de inicializar os partials e os helpers do Handlebars

@class HandlebarsConfig
**/
function (Handlebars, $, _, Moment, App, CommentPartial, GeneralResultsPartial, EventsResultsPartial, UsersResultsPartial, CalendarPartial, UserInfoPartial) {

    return function () {

        //Imprime o parâmetro na consola
        Handlebars.registerHelper('whatis', function (param) {
            console.log(param);
        });


        /*PARTIALS*/

        //Partial da informação de um utilizador (avatar, nome, instituiçao, area)
        Handlebars.registerPartial('userinfo', UserInfoPartial);

        //Partial de um comentario
        Handlebars.registerPartial('comment', CommentPartial);

        //Partial do calendar
        Handlebars.registerPartial('calendar', CalendarPartial);
        
        //Partial de resultados da pesquisa geral
        Handlebars.registerPartial('generalresults', GeneralResultsPartial);

        //Partial de listagem de eventos 
        Handlebars.registerPartial('eventsresult', EventsResultsPartial);

        //Partial  de listagem de users
        Handlebars.registerPartial('usersresult', UsersResultsPartial);

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


        //Verifica se a propriedade se encontra definida
        Handlebars.registerHelper('isDefined', function (param, body) {
            if(param != null)
                return body.fn(this);
        });

        //Verifica se o utilizador está registado
        Handlebars.registerHelper('isLogged', function (param, body) {
            if(App.account.isLogged())
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