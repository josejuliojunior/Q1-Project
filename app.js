var map;
var mapCenter = {lat: 35.636579, lng: -98.495316};
var mapOptions =  {
            zoom:4 ,
            center:mapCenter,
        };

/*
function makeUL(array) {
    var list = document.createElement('ul');
    var item = document.createElement('li');
    item.appendChild(document.createTextNode(array));
    list.appendChild(item);
    item.setAttribute('id', 'trail');
    return list;
}//function make list
*/

function makeTitle(title) {
  var titleResult = document.createElement('h4');
  titleResult.appendChild(document.createTextNode(title));
  return titleResult;
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
    var gmarkers ;

    $.ajax(settings).done(function (response) {
      codeAPI = response;
      console.log(response);

      document.getElementById('resultListTitle').appendChild(makeTitle('Trails found:'));

      for (var i = 0; i < codeAPI.places.length; i++) {

        function makeUL(array) {
            var list = document.createElement('ul');
            var a = document.createElement('a');
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(array));
            a.appendChild(item);
            list.appendChild(a);
            item.setAttribute('id', 'trail'+[i]);
            a.setAttribute('id', 'trail'+[i]);
            // a.setAttribute('onclick', 'myClick'+[i]);
            // a.setAttribute('href', "javascript:google.maps.event.trigger(gmarkers["+[i]+"],'click');");
            return list;
        }//function make list

        document.getElementById('resultList').appendChild(makeUL(codeAPI.places[i].name));

        myLatLng[i] = {lat: codeAPI.places[i].lat, lng: codeAPI.places[i].lon};

        markers[i] = new google.maps.Marker({
          position: myLatLng[i],
          map: map,
          title: 'trail'+[i]
        });//markers

        images[i] = '<img src='+codeAPI.places[i].activities[0].thumbnail+' height="340" width="340">';
        markers[i].index = i;
        contents[i] = '<div class="popup_container">'+'<b>Name: </b>'+codeAPI.places[i].name+'<br>'+'<br>'+
                      '<b>Length: </b>'+codeAPI.places[i].activities[0].length+' miles<br>'+
                      '<b>Description: </b>'+'<br>'+codeAPI.places[i].activities[0].description+'<br>'+'<br>'+
                      '<b>Directions: </b>'+'<br>'+codeAPI.places[i].directions+'<br>'+
                      images[i]+'</div>';


        infowindows[i] = new google.maps.InfoWindow({
          content: contents[i],
          maxWidth: 400
        });//new info on map


/*
        // function markerFunction(id){
        //   for (var i in markers){
        //     var markerID = markers[i].options.title;
        //     if (markerID == id){
        //         google.maps.event.addListener(markers[i],'click', function() {
        //           infowindow.open(map, marker[i]);
        //           console.log(this.index); // this will give correct index
        //           console.log(i); //this will always give 10 for you
        //           infowindows[this.index].open(map,markers[this.index]);
        //           map.panTo(markers[this.index].getPosition());
        //         });//listener
        //     }//if
        //   }//for loop in marker
        // }//function markerFunction
        //
        // $("a").click(function(){
        // markerFunction($(this)[i].id);
        // });
*/

        map.setZoom(9);
        mapCenter.lat = codeAPI.places[0].lat;
        mapCenter.lng = codeAPI.places[0].lon;
        map.setCenter(mapCenter);

/*
        google.maps.event.addListener(markers[i], 'click', function() {
          console.log(this.index); // this will give correct index
          console.log(i); //this will always give 10 for you
          infowindows[this.index].open(map,markers[this.index]);
          map.panTo(markers[this.index].getPosition());
        });//function create markers
*/

        function newMarkers () {
          console.log(this.index); // this will give correct index
          console.log(i); //this will always give 10 for you
          infowindows[this.index].open(map,markers[this.index]);
          map.panTo(markers[this.index].getPosition());
        };//function create markers

        google.maps.event.addListener(markers[i], 'click', newMarkers);
/*
        function markerFunction(id){
          for (var i in markers){
            var markerID = markers[i].title;
            if (markerID == id){
                infowindows[this.index].open(map,markers[this.index]);
            }//if
          }//for loop in marker
        }//function markerFunction

        $("a").click(function(){
          console.log($(this.id));
        markerFunction($(this).id);
        });
*/





      }//for loop to codeAPI places

    });//ajax function

  });//button click

});//document ready
