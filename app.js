
var map;
var mapCenter = {lat: 35.636579, lng: -98.495316};
var mapOptions =  {
            zoom:4 ,
            center:mapCenter,
            mapTypeId: 'roadmap'
        };

function makeTitle(title) {
  var titleResult = document.createElement('h4');
  titleResult.appendChild(document.createTextNode(title));
  return titleResult;
}

$(document).ready(function(){
function initialize() {

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var city = "";

  $('#terrain').click(function () {
    map.setMapTypeId('terrain');
  });
  $('#hybrid').click(function () {
    map.setMapTypeId('hybrid');
  });
  $('#roadmap').click(function () {
    map.setMapTypeId('roadmap');
  });
  $('#satellite').click(function () {
    map.setMapTypeId('satellite');
  });


  $('#buttonSelect').click(function () {
    $('#resultListTitle').empty();
    $('#resultList').empty();
    $('.modals').empty();
    city = $('#selectInput').val();

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
    var allMarkers = [];
    var uikModalFull = [];

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
            a.setAttribute('uk-toggle', '');
            a.setAttribute('href', "#modal-" + i);
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

        // uikModalFull[i] =   '<a class="uk-button uk-button-default" href="#modal-full" uk-toggle>Open</a>'+
        //                     '<div id="modal-full" class="uk-modal-full" uk-modal>'+
        //                         '<div class="uk-modal-dialog">'+
        //                             '<button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>'+
        //                             '<div class="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" uk-grid>'+
        //                                 '<div class="uk-background-cover" style="background-image: url(' + images[i] + ');" uk-height-viewport></div>'+
        //                                 '<div class="uk-padding-large">'+
        //                                     '<h1>' + codeAPI.places[i].name + '</h1>'+
        //                                     '<p>' + codeAPI.places[i].activities[0].description + '</p>'+
        //                                     '<p>' + codeAPI.places[i].directions + '</p>'+
        //                                 '</div>'+
        //                             '</div>'+
        //                         '</div>'+
        //                     '</div>';

        $('.modals').append(
                            '<div id="modal-' + i + '" class="uk-modal-full" uk-modal>'+
                                '<div class="uk-modal-dialog">'+
                                    '<button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>'+
                                    '<div class="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" uk-grid>'+
                                        '<div class="uk-background-cover" style="background-image: url(' + images[i] + ');" uk-height-viewport></div>'+
                                        '<div class="uk-padding-large">'+
                                            '<h1>' + codeAPI.places[i].name + '</h1>'+
                                            '<p>' + codeAPI.places[i].activities[0].description + '</p>'+
                                            '<p>' + codeAPI.places[i].directions + '</p>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>');

        infowindows[i] = new google.maps.InfoWindow({
          content: contents[i],
          maxWidth: 400
        });//new info on map



        map.setZoom(9);
        mapCenter.lat = codeAPI.places[0].lat;
        mapCenter.lng = codeAPI.places[0].lon;
        map.setCenter(mapCenter);

        function newMarkers () {
          console.log(this.index); // this will give correct index
          console.log(i); //this will always give 10 for you
          infowindows[this.index].open(map,markers[this.index]);
          map.panTo(markers[this.index].getPosition());
        };//function create markers

        // google.maps.event.addListener(markers[i], 'click', newMarkers);

        google.maps.event.addListener(markers[i], 'click', function() {
          console.log(this.index);
          var index = this.index;
          UIkit.modal('#modal-' + index).show();
          // console.log('.modals'[this.index]);
          // $('.modals'[this.index]).modal('show');
        });



      }//for loop to codeAPI places

      allMarkers.push(markers);
      console.log(allMarkers);

    });//ajax function

  });//button click

}//initialize

google.maps.event.addDomListener(window, 'load', initialize);

});//document ready
