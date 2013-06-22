define("map/mapview",
    [
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "requirejs-plugins/async!http://maps.google.com/maps/api/js?sensor=false",
    "common/basicview",
    "./locals/locals",

    "text!./maps.html",
], function ($, Backbone, _, Handlebars, GoogleMaps, BasicView, LocalCollection, MapsTemplate) {


  /**
  View da página do mapa

  @class map.MapView
  @alternateClassName MapView
  @extends BasicView
  **/
  return BasicView.extend({

    el: $("[data-role=content]"),

    id: "mapsId",
    pageName: "Maps",

    template: MapsTemplate,

    events: {

      'click #submit' : 'search',

    },

    locals: null,

    localId: null,

    infoWindow: null,

    infoContent: null,

    markers: null,

    map: null,

    types: null,



    initialize: function (args)
    {
      console.log("alert0");
      _.bindAll(this);

      

      var self = this;

      infoWindow = new google.maps.InfoWindow({
          content: null
      });
      infoContent = new Array();
      markers = new Array();
      types = new Array();

      var _this = this;

      this.localId = args.localId;

      this.locals = new LocalCollection();

      this.locals.fetch().done(
                function () {
                    self.renderLayout();
                    self.render();
                    setTimeout(function() { _this.renderMap() }, 0);
                }); 
      
    },

    center: function(lat, lng)
    {
       
        var newCenter = new google.maps.LatLng(lat, lng);

        map.setCenter(newCenter);

    },



    search: function()
    {
        var param = $("#search").val();
        var locals = this.locals;
        var that = this;
        var searchTypes = new Array();

        types.forEach(function(type){ 
          if ($("#" + type).is(":checked")) {
            searchTypes = _.union(searchTypes, type);
          }
        });

        console.log(searchTypes);

        var firstLocal = locals.find(function(model) { 

          return model.get("name").toUpperCase() == param.toUpperCase(); 

        });

        locals.forEach(function(model) { 
          if(_.contains(searchTypes, model.get("type")))
            markers[model.get("id")].setVisible(true);
          else
            markers[model.get("id")].setVisible(false);
        });

        if(typeof firstLocal != 'undefined') {
          markers[firstLocal.get("id")].setVisible(true);
          this.center(firstLocal.get("coord_x"),firstLocal.get("coord_y"));
          infoWindow.setContent(infoContent[firstLocal.get("id")]);
          infoWindow.open(map, markers[firstLocal.get("id")]);
          console.log(firstLocal.get("type"));
        }

        else
          this.showErrorOverlay({text: "Não foram encontrados resultados para a sua pesquisa", time: 3000});

        $( "#searchpanel" ).panel( "close" ); 
        
    },




    

     renderMap: function() {
 console.log("renderMap");
          
          var mapCenter = new google.maps.LatLng(38.661009, -9.204413);

              
          var locId = this.localId;

          var centerLoc = this.locals.find(function(model) { 
            return model.get("id") == locId;
                                           
          });

          if(typeof centerLoc != 'undefined')
            mapCenter = new google.maps.LatLng(centerLoc.get("coord_x"), centerLoc.get("coord_y"));


            var myOptions = {
                zoom:15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: mapCenter
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            var locals = this.locals;

            var link;

            locals.forEach(function(model){ 
              var markerPos = new google.maps.LatLng(model.get("coord_x"), model.get("coord_y"));

              var marker = new google.maps.Marker({
                  position: markerPos,
                  map: map,
                  title: model.get("name")
              });

              infoContent[model.get("id")] = "<br> <a href=local/" + model.get("id") + ">" + marker.title + "</a> <br> Tipo: " + model.get("type");

              google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(infoContent[model.get("id")]);
                infoWindow.open(map,marker);
              });

            markers[model.get("id")] = marker;

            var hasType = _.find(types, function(t){ return t.toUpperCase() == model.get("type").toUpperCase() });

            if(!hasType)
              types = _.union(types, model.get("type"));

             });
                       
      },


    render: function () {
      console.log("alert3");

      this.locals.forEach(function(model){

        var hasType = _.find(types, function(t){ return t.toUpperCase() == model.get("type").toUpperCase() });

        if(!hasType)
          types = _.union(types, model.get("type"));

        });

      

      console.log(types);

      var context = {localTypes : types};
      var html = this.compileTextTemplate(this.template, context);

      $("[data-role=content]").append(html);
      this.enhanceJQMComponentsAPI();

      
      this.setElement($("[data-role=content]"));
console.log("alert4");
      return this;

    },



  });

});