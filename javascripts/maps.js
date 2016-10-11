function initMap() {
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
       mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
      }, // here´s the array of controls
      disableDefaultUI: true, // a way to quickly hide all controls
      mapTypeControl: false,
      scaleControl: true,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP
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
     };
     var control = document.getElementById('floating-panel');
      control.style.display = 'block';
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
     document.getElementById('submit').addEventListener('click', onChangeHandler);
    //Self marker
    var marker = new CustomMarker(coords, map, {});
    markers.push(marker);
   });

 }else{
   //Sorry, no cookies. Click to action to access geolocation
   alert('Location unavailable');
 }
}

// Ads markers on Map
function addMarker(location){
  var marker = new CustomMarker(location, map, {
  marker_id: '123'
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
  // map.panTo(location);
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}
