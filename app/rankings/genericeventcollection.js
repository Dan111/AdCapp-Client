define([
    "jquery",
    "backbone",
    "backbone.localStorage",
    "events/paper/paper",
    "events/keynote/keynote",
    "events/session/session",
    "events/workshop/workshop",
    "app.config"
], 

function ($, Backbone, LocalStorage, Paper, Keynote, Session, Workshop, App) {

	/**
    Coleção para todos os tipos de eventos

    @class rankings.GenericEventCollection
    @alternateClassName GenericEventCollection
    @extends Backbone.Collection
    **/
	return Backbone.Collection.extend({

		/**
        Tipo do modelo utilizado na collection

        @property model 
        @type Backbone.Model
        @readonly
        @protected
        
        **/
		model: null,

        url: "",

        typesCollectionInfo: {
                                "papers"    :{model: Paper, url: "papers"},
                                "keynotes"  :{model: Keynote, url: "keynotes"},
                                "sessions"  :{model: Session, url: "sessions"},
                                "workshops" :{model: Workshop, url: "workshops"}
        },

		initialize: function (args){

            var type = this.typesCollectionInfo[args.type];
            this.model = type.model;
            this.url = App.URL + type.url;
            this.sync =  Backbone.cachingSync(Backbone.sync, 'rankings-'+type.url);
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