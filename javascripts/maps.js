function initMap() {
  // var directionsService = new google.maps.DirectionsService;
  // var directionsDisplay = new google.maps.DirectionsRenderer;
  // map = new google.maps.Map(document.getElementById('map'), {
  //   zoom: 7,
  //   center: {lat: 41.85, lng: -87.65}
  // });
  // directionsDisplay.setMap(map);
  //First init the marker


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
    var marker = new CustomMarker(position, map, {draggable: true});

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
  var marker = new CustomMarker(location, map, {draggable: true});
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
  // map.panTo(location);
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}
