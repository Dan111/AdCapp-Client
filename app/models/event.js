define([
    "jquery",
    "backbone",
    "views/basicview"
], 

function ($, Backbone, BasicView) {

	/**
    Modelo que representa um evento

    @class Event
    @extends Backbone.Model
    **/
	return Backbone.Model.extend({

		/**
        Url do servidor para fazer fecth do modelo

        @property url 
        @type String
        @static
        @final
        @default "http://danielmagro.apiary.io/events/"
        **/
		url: "http://danielmagro.apiary.io/events/",

        /**
        Tipo do evento

        @attribute type
        @type String
        @protected
        **/

		/**
        Defaults dos atributos do modelo

        @property defaults
        @type Object
        @static
        @final
        @protected
        **/
		defaults: {

			id: 0,
			typeId: 0,
			name: null,
			hours: 0, 
			duration: 0, //em minutos
			type: null,
			local_id: -1,
			users_id_array: null

		},

		/**
        Construtor do modelo Event. Adiciona à url o id
        do modelo a fazer fetch do servidor

        @constructor
        @protected
        @class Event
        **/
		initialize: function (){

			//adiciona o id do modelo ao url, para o Backbone poder fazer fetch da informação
			this.url += this.id;
		},


        /**
        Submete um novo comentário na página do evento

        @method submitComment
        @protected
        @async
        @param {Object} options Configuração do comentário
            @param {String} options.url Onde o comentário deve ser colocado.
            @param {Integer} options.text Conteúdo do comentário.
            @param {Function()} options.success Função de callbak em caso de 
                                                sucesso.
        @example
            submitComment(  'comments',
                            'Isto é um comentário',
                            function () { 
                                console.log("Comentário submetido");
                            })
        **/
        submitComment: function (options){ //TODO: factorizar método

            var self = this;

            $.ajax({
                method: "POST",

                async: false,

                timeout: 5000,

                url: this.url + "/" + options.url,

                //TODO: alterar email e password quando o registo do dispositivo funcionar
                data: { 
                    "email"     : "fa@gmail.com", 
                    "password"  : "123456", 
                    "content"   : options.text, 
                    "id"        : this.id, 
                    type        : this.type
                },

                beforeSend: function () {
                    $.mobile.loading( 'show', {
                            text: "A enviar",
                            textVisible: true
                    });
                },

                complete: function () {
                    //override do ajaxsetup para nao fazer hide do load spinner
                },

                success: function () {
                    $.mobile.loading( 'hide' );
                    options.success();
                },

                error: function (){
                    BasicView.prototype.showErrorOverlay({text: "Erro no envio"});
                }
            });


        }

	});

});
