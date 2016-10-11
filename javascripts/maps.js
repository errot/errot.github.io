function initMap() {
  // var directionsService = new google.maps.DirectionsService;
  // var directionsDisplay = new google.maps.DirectionsRenderer;
  // map = new google.maps.Map(document.getElementById('map'), {
  //   zoom: 7,
  //   center: {lat: 41.85, lng: -87.65}
  // });
  // directionsDisplay.setMap(map);
  //First init the marker
  CustomMarker.prototype = new google.maps.OverlayView();

  function CustomMarker(latlng, map, args) {
  	this.latlng = latlng;
  	this.args = args;
  	this.setMap(map);
  }

  CustomMarker.prototype.setPosition = function(latlng) {
    this.latlng = latlng;
  };
  CustomMarker.prototype.draw = function() {
      var self = this;
      var div = this.div;
      if (!div) {
          div = this.div = $('' +
              '<div>' +
              '<div class="shadow"></div>' +
              '<div class="pulse"></div>' +
              '<div class="pin-wrap">' +
              '<div class="pin"></div>' +
              '</div>' +
              '</div>' +
              '')[0];
          this.pinWrap = this.div.getElementsByClassName('pin-wrap');
          this.pin = this.div.getElementsByClassName('pin');
          this.pinShadow = this.div.getElementsByClassName('shadow');
          div.style.position = 'absolute';
          div.style.cursor = 'pointer';
          var panes = this.getPanes();
          panes.overlayImage.appendChild(div);
          google.maps.event.addDomListener(div, "click", function(event) {
              google.maps.event.trigger(self, "click", event);
          });
      }
      var point = this.getProjection().fromLatLngToDivPixel(this.position);
      if (point) {
          div.style.left = point.x + 'px';
          div.style.top = point.y + 'px';
      }
  };

  CustomMarker.prototype.animateDrop = function() {
      dynamics.stop(this.pinWrap);
      dynamics.css(this.pinWrap, {
          'transform': 'scaleY(2) translateY(-'+$('#map').outerHeight()+'px)',
          'opacity': '1',
      });
      dynamics.animate(this.pinWrap, {
          translateY: 0,
          scaleY: 1.0,
      }, {
          type: dynamics.gravity,
          duration: 1800,
      });

      dynamics.stop(this.pin);
      dynamics.css(this.pin, {
          'transform': 'none',
      });
      dynamics.animate(this.pin, {
          scaleY: 0.8
      }, {
          type: dynamics.bounce,
          duration: 1800,
          bounciness: 600,
      })

      dynamics.stop(this.pinShadow);
      dynamics.css(this.pinShadow, {
          'transform': 'scale(0,0)',
      });
      dynamics.animate(this.pinShadow, {
          scale: 1,
      }, {
          type: dynamics.gravity,
          duration: 1800,
      });
  }

  CustomMarker.prototype.animateBounce = function() {
      dynamics.stop(this.pinWrap);
      dynamics.css(this.pinWrap, {
          'transform': 'none',
      });
      dynamics.animate(this.pinWrap, {
          translateY: -30
      }, {
          type: dynamics.forceWithGravity,
          bounciness: 0,
          duration: 500,
          delay: 150,
      });

      dynamics.stop(this.pin);
      dynamics.css(this.pin, {
          'transform': 'none',
      });
      dynamics.animate(this.pin, {
          scaleY: 0.8
      }, {
          type: dynamics.bounce,
          duration: 800,
          bounciness: 0,
      });
      dynamics.animate(this.pin, {
          scaleY: 0.8
      }, {
          type: dynamics.bounce,
          duration: 800,
          bounciness: 600,
          delay: 650,
      });

      dynamics.stop(this.pinShadow);
      dynamics.css(this.pinShadow, {
          'transform': 'none',
      });
      dynamics.animate(this.pinShadow, {
          scale: 0.6,
      }, {
          type: dynamics.forceWithGravity,
          bounciness: 0,
          duration: 500,
          delay: 150,
      });
  }

  CustomMarker.prototype.animateWobble = function() {
      dynamics.stop(this.pinWrap);
      dynamics.css(this.pinWrap, {
          'transform': 'none',
      });
      dynamics.animate(this.pinWrap, {
          rotateZ: -45,
      }, {
          type: dynamics.bounce,
          duration: 1800,
      });

      dynamics.stop(this.pin);
      dynamics.css(this.pin, {
          'transform': 'none',
      });
      dynamics.animate(this.pin, {
          scaleX: 0.8
      }, {
          type: dynamics.bounce,
          duration: 800,
          bounciness: 1800,
      });
  }

  if (navigator.geolocation) { //Checks if browser supports geolocation
   navigator.geolocation.getCurrentPosition(function (position) {                                                              //This gets the
     var latitude = position.coords.latitude;                    //users current
     var longitude = position.coords.longitude;                 //location
     var coords = new google.maps.LatLng(latitude, longitude); //Creates variable for map coordinates
     var directionsService = new google.maps.DirectionsService();
     var directionsDisplay = new google.maps.DirectionsRenderer();
     var mapOptions = //Sets map options
     {
       zoom: 15,  //Sets zoom level (0-21)
       center: coords, //zoom in on users location
       mapTypeControl: true, //allows you to select map type eg. map or satellite
       navigationControlOptions:
       {
         style: google.maps.NavigationControlStyle.SMALL //sets map controls size eg. zoom
       },
       mapTypeId: google.maps.MapTypeId.ROADMAP //sets type of map Options:ROADMAP, SATELLITE, HYBRID, TERRIAN
     };
     map = new google.maps.Map( /*creates Map variable*/ document.getElementById("map"), mapOptions /*Creates a new map using the passed optional parameters in the mapOptions parameter.*/);
     directionsDisplay.setMap(map);
     directionsDisplay.setPanel(document.getElementById('right-panel'));
     var request = {
       origin: coords,
       destination: 'Forum Mall, Koramangala, Bangalore',
       travelMode: google.maps.DirectionsTravelMode.DRIVING
     };
     var onChangeHandler = function() {
       //Here, publish current location object to myChannel
       function geo_success(position) {
         var myMessage = {
           name: document.getElementById('name').value,
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
         };
         ortcClient.send('myChannel', JSON.stringify(myMessage));
          // do_something(position.coords.latitude, position.coords.longitude);
        }

        function geo_error() {
          alert("Sorry, no position available.");
        }

        var geo_options = {
          enableHighAccuracy: true,
          maximumAge        : 30000,
          timeout           : 27000
        };

        var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
      //  calculateAndDisplayRoute(directionsService, directionsDisplay);
     };
     var control = document.getElementById('floating-panel');
      control.style.display = 'block';
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
     document.getElementById('submit').addEventListener('click', onChangeHandler);
    //  document.getElementById('end').addEventListener('change', onChangeHandler);
    //  directionsService.route(request, function (response, status) {
    //    if (status == google.maps.DirectionsStatus.OK) {
    //      directionsDisplay.setDirections(response);
    //    }
    //  });
    var marker = new CustomMarker({
            position: coords,
            map: map,
            draggable:true
        });
    var marker2 = new google.maps.Marker({
            position: coords,
            map: map,
            draggable:true
        });
   });

 }else{
   //Sorry, no cookies. Click to action to access geolocation
 }
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

// Ads markers on Map
function addMarker(location){
  var marker = new CustomMarker({
          position: location,
          map: map,
          draggable:true
      });
	// marker = new google.maps.Marker({
	// 	position:location,
	//     map:map,
	//     draggable:true,
	//     animation: google.maps.Animation.DROP
  // 	});
  	return marker;
}

// Ads markers on Map
function moveMarker(location,marker){
  marker.setPosition(location);
  map.panTo(location);
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}
