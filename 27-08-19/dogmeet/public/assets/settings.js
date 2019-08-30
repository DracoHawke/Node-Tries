function set(){
  document.getElementById('yourlocation').style.display = "none";
  document.getElementById('changeyourloc').style.display = "inline-flex";
  var val = document.getElementById('yourlocationset').innerHTML;
  val = val.trim();
  document.getElementById('Location').value = val;
}

$('document').ready(function(){
  $('#cancel').click(function(){
    document.getElementById('yourlocation').style.display = "inline-flex";
    document.getElementById('changeyourloc').style.display = "none";
    event.preventDefault();
  })
  $('#MyLocation').click(function(){
      if (location.protocol == 'http:') {
          alert("Unable to Get Location, Please Input Location Manually");
      }
      else if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          $("#address").val("");
          var Long = position.coords.longitude;
          var Latt = position.coords.latitude;
          $("#Long").val(position.coords.longitude);
          $("#Lat").val(position.coords.latitude);
          $.get('https://api.opencagedata.com/geocode/v1/json?key=65bcb077ca9f4ef29eb2d9c49a26df32&q='+Latt+'+'+Long,function(data){
            //console.log(data);
            alert(data.results[0].formatted);
            $("#Location").val(data.results[0].formatted);
          });
          //Make_Map(Long,Latt);
        });
      }
  });
});
