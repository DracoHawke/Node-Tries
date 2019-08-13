$('document').ready(function(){
  var today = new Date();
  var date = (today.getFullYear() - 20)+'-'+(today.getMonth()+1)+'-'+today.getDate();
  document.getElementById('dob').setAttribute("max", date);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  function showPosition(position) {
    var x = [];
    x["longitude"] = position.coords.longitude;
    x["latitude"] = position.coords.latitude;
    document.getElementById('Location').value = x;
  }
});

var loadFile = function(event) {
  var output = document.getElementById('imageload');
  output.src = URL.createObjectURL(event.target.files[0]);
  console.log(event);
};
