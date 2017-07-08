$(document).ready(function() {
  navigator.geolocation.getCurrentPosition(success, error, options);

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  var currentLat;
  var currentLong;

  function success(pos) {
    console.log('success');
    var crd = pos.coords;
    console.log('current location: ' + pos.coords);
    currentLat = crd.latitude;
    currentLong = crd.longitude;
    console.log(currentLat, currentLong);
    loadMap();
  }
    function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
    function loadMap() {
    console.log('loadMap');
    var accessToken = 'pk.eyJ1IjoicGl4aWVwaHJlYWsiLCJhIjoiY2oydng0ZXJrMDA2YTJycW9kdWUza3ZrMSJ9.m2fu1nocZw5xQjz1F6ZvqQ';
    var locations = {
      center: [currentLong, currentLat]
    };
    //create map
    mapboxgl.accessToken = accessToken;
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: locations.center, // starting position
      zoom: 7 // starting zoom
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // Add geolocate control to the map.
    // Not all browsers support geolocation, and some users may disable the feature.
    // Geolocation support for modern browsers including Chrome requires sites to be served over HTTPS.
    // If geolocation support is not available, the GeolocateControl will not be visible.
    var geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 6000
      },
      watchPosition: true
    });

    map.addControl(geolocate);

    //fail gracefully. where should this go? Or is this handled nativley by mb api?
    if (!navigator.geolocation) {
      output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    }
    //show user locaiton on initial load
    map.on('load', function() {

      map.addSource('single-point', {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": locations.center
            }
          }]
        }
      });

      map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
          "circle-radius": 5,
          "circle-color": "#007cbf"
        }
      });

    var geojson = {
    "type": "FeatureCollection",
    "features": [

    ]
};


      // Listen for the `geocoder.input` event that is triggered when a user
      // makes a selection and update the geojson obj to show user icon at current location.
      geolocate.on('geolocate', function(res) {
        var lat = res.coords.latitude;
        var lng = res.coords.longitude;

        var point = {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [lng, lat]
            }
          }]
        };

        map.getSource('single-point').setData(point);

        $.get("/api/task", function(data) {
          var custGeometry;
          tasks = data;
          if (!tasks || !tasks.length) {
            console.log('There are no active requests in your area');
            //add to dom for graceful failure
          } else {
            var allTasks = data;
            allTasks.forEach(function(task) {
              taskTitle = task.title;
              taskDescription = task.description;
              taskTimeframe = task.timeframe;
              taskPayment = task.payment;
              var thisCust = task.customerId;
              $.get("/api/customer/" + thisCust, function(data) {
                custAddressArr = data[0].streetaddress.split(' ');
                custAddress = custAddressArr.join('+');
                custCity = data[0].city;
                custState = data[0].state;
                custZip = data[0].zip;
                console.log('new customer: ', custAddress);
                //use address to put marker on page;
                var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + custAddress + "+" + custCity + "+" + custState + ".json?proximity=" + locations.center[0] + ',' + locations.center[1] + "&access_token=" + accessToken;
                var settings = {
                  "async": true,
                  "crossDomain": true,
                  "url": url,
                  "method": "GET"
                };
                $.ajax(settings).done(function(response) {
                  custGeometry = response.features[0].geometry.coordinates;
                  console.log(custGeometry);
                  geojson.features.push({
                      "type": "Feature",
                      "properties": {
                          "message": `Title: ${taskTitle},
                           Description: ${task.description},
                           Time Frame: ${task.timeframe},
                           Payment: ${task.payment}`,
                          "iconSize": [30, 30]
                      },
                      "geometry": {
                          "type": "Point",
                          "coordinates": custGeometry
                      }
                  });
                  console.log(geojson.features);
                  // add markers to map
                  geojson.features.forEach(function(marker) {
                      // create a DOM element for the marker
                      var el = document.createElement('div');
                      el.className = 'marker';
                      el.style.backgroundImage = 'url(https://placekitten.com/g/' + marker.properties.iconSize.join('/') + '/)';
                      el.style.width = marker.properties.iconSize[0] + 'px';
                      el.style.height = marker.properties.iconSize[1] + 'px';

                      el.addEventListener('click', function() {
                          window.alert(marker.properties.message);
                      });

                      // add marker to map
                      new mapboxgl.Marker(el, {offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]})
                          .setLngLat(marker.geometry.coordinates)
                          .addTo(map);
                  });
                });
              });
            });
          }
        });

      });
    });
  }
});
