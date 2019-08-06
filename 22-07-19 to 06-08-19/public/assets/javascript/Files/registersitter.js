$('document').ready(function(){
  var today = new Date();
  var date = (today.getFullYear() - 20)+'-'+(today.getMonth()+1)+'-'+today.getDate();
  document.getElementById('dob').setAttribute("max", date);
});

var loadFile = function(event) {
  var output = document.getElementById('imageload');
  output.src = URL.createObjectURL(event.target.files[0]);
  console.log(event);
};
