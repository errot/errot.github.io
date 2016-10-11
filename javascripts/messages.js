function initialize(){
  loadOrtcFactory(IbtRealTimeSJType, function(factory, error) {
    if (error !== null) {
      console.log("ORTC factory error: " + error.message);
    } else {
      ortcClient = factory.createClient();
      ortcClient.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
      ortcClient.connect('9jmUdu', 'testToken');
      ortcClient.onConnected = function(ortc) {
        console.log("Connected to " + ortcClient.getUrl());



        markers = [];
        initMap();
        ortcClient.subscribe('myChannel', true, function(ortc, channel, message) {
          //Plot positions on map
          var locationObj = JSON.parse(message);
          if(locationObj.latitude && locationObj.longitude){
            var loc = new google.maps.LatLng(locationObj.latitude, locationObj.longitude);
            var mkr = search(locationObj.name, markers);
            if(mkr){
              mkr.animateWobble();
              moveMarker(loc, mkr);
            }else{
              var m = addMarker(loc);
              m.name = locationObj.name;
              markers.push(m);
              m.animateDrop();
            }

          }
          console.log(message);
        });
        // var myMessage = {
        //   foo: "bar"
        // };
        // ortcClient.send('myChannel', JSON.stringify(myMessage));
      };
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
