var map;
var mapCenter = {lat: 35.636579, lng: -98.495316};
var mapOptions =  {
            zoom:4 ,
            center:mapCenter,
            // mapTypeId:google.maps.MapTypeId.ROADMAP
        };

function makeUL(array) {
    var list = document.createElement('ul');
    for(var i = 0; i < array.length; i++) {
        var item = document.createElement('li');
        item.appendChild(document.createTextNode(array[i]));
        list.appendChild(item);
    }
    return list;
}



$(document).ready(function(){

  // var mapCenter = {lat: 35.636579, lng: -98.495316};
  map = new google.maps.Map(document.getElementById('map'), mapOptions)
  // {
    // zoom: 4,
    // center: mapCenter
  // });
  // var marker = new google.maps.Marker({
  //   position: mapCenter,
  //   map: map
  // });



  var city = "";

  $('#buttonSelect').click(function () {
    city = $('#selectInput').val();
    // console.log(city);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://trailapi-trailapi.p.mashape.com/?q%5Bactivities_activity_type_id_eq%5D=5&q%5Bcountry_cont%5D=United%20States&q%5Bcity_cont%5D=" + city,
      "method": "GET",
      "headers": {
        "x-mashape-key": "M5BD7Ke1jqmshM8HrPJBBeX85Svdp18mX1djsnMU5qML3ekWTj",
        "cache-control": "no-cache",
        "postman-token": "2a73aedd-4c25-24bb-9a9b-ee56e8d5ed7b"
      }
    };

var codeAPI = "";
var markers = [];
var contents = [];
var myLatLng = [];
var infowindows = [];
var images = [];

    $.ajax(settings).done(function (response) {
      codeAPI = response;
      console.log(response);

      // document.getElementById('resultList').appendChild(makeUL(codeAPI.places[i].name));

      for (var i = 0; i < codeAPI.places.length; i++) {

        document.getElementById('resultList').appendChild(makeUL(codeAPI.places[i].name));

        myLatLng[i] = {lat: codeAPI.places[i].lat, lng: codeAPI.places[i].lon};

        markers[i] = new google.maps.Marker({
          position: myLatLng[i],
          map: map,
          title: codeAPI.places[i].name
        });

        images[i] = '<img src='+codeAPI.places[i].activities[0].thumbnail+' height="340" width="340">';
        markers[i].index = i; //add index property
        contents[i] = '<div class="popup_container">'+'<b>Name: </b>'+codeAPI.places[i].name+'<br>'+'<br>'+
                      '<b>Length: </b>'+codeAPI.places[i].activities[0].length+' miles<br>'+
                      '<b>Description: </b>'+'<br>'+codeAPI.places[i].activities[0].description+'<br>'+'<br>'+
                      '<b>Directions: </b>'+'<br>'+codeAPI.places[i].directions+'<br>'+
                      images[i]+'</div>';


        infowindows[i] = new google.maps.InfoWindow({
        content: contents[i],
        maxWidth: 400
        });

      // map = new google.maps.Map(document.getElementById('map'), mapOptions);
      map.setZoom(9);
      mapCenter.lat = codeAPI.places[0].lat;
      mapCenter.lng = codeAPI.places[0].lon;
      map.setCenter(mapCenter);

      google.maps.event.addListener(markers[i], 'click', function() {
        console.log(this.index); // this will give correct index
        console.log(i); //this will always give 10 for you
        infowindows[this.index].open(map,markers[this.index]);
        map.panTo(markers[this.index].getPosition());
      });


//Test

//more

    }

    });

  });

});
