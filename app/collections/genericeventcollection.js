define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "models/paper",
    "models/keynote",
    "models/session",
    "models/workshop",
    "app.config"
], 

function ($, Backbone, LocalStorage, Paper, Keynote, Session, Workshop, App) {

	/**
    Coleção para todos os tipos de eventos

    @class GenericEventCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @final
        @protected
        @default null
        **/
		model: null,

		//url: App.URL + "papers",
        url: "",

        typesCollectionInfo: {
                                "papers"    :{model: Paper, url: "http://danielmagro.apiary.io/papers"},
                                "keynotes"  :{model: Keynote, url: "http://danielmagro.apiary.io/keynotes"},
                                "sessions"  :{model: Session, url: "http://danielmagro.apiary.io/sessions"},
                                "workshops" :{model: Workshop, url: "http://danielmagro.apiary.io/workshops"}
        },

		initialize: function (args){

            var type = this.typesCollectionInfo[args.type];
            this.model = type.model;
            this.url = type.url;

		},


        /**
        Devolve os modelos da collection que tem como id os ids
        passados no array

        @method getByIds
        @protected
        @param {Array} arrayOfIds array de ids
        @return {Array} array de modelos Paper
        **/
        getByIds: function(arrayOfIds){
            that = this;
            return _.map(arrayOfIds, function(id){
                return that.get(id) ;
            });
        }


	});

});