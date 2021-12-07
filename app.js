var view;
var map;
var geolocation;

$(document).ready(function() {
    init_map();
    $("#current_position").click(function(){
        set_current_position();
    });
});

function  init_map() {
    view = new ol.View({
        center: ol.proj.fromLonLat([16.8554, 41.11148]), // centrata di default su Bari
        zoom: 9
    });

    map = new ol.Map({
        layers: [
        new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url:'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=f038eed9b9944285888511304cc28d0a'
                })
            })
        ],
        target: 'map',
        view: view
    });

    geolocation = new ol.Geolocation({
        trackingOptions: {
            enableHighAccuracy: true
        },
        projection: view.getProjection()
    });
}

function set_current_position() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        var crd = pos.coords;
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);

        var view = new ol.View({
            center: ol.proj.fromLonLat([crd.longitude, crd.latitude]),
            zoom: 17
          });
          map.setView(view);
          add_marker_point(crd.longitude, crd.latitude);
      }
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      navigator.geolocation.getCurrentPosition(success, error, options);    
}

function add_marker_point(lon, lat) {
    var centerLongitudeLatitude = ol.proj.fromLonLat([lon, lat]);
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            projection: 'EPSG:4326',
            features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 50))]
        }),
        style: [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
        })
        ]
    });
    map.addLayer(layer);
}
