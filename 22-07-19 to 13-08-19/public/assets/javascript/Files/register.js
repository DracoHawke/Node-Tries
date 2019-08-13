var loadFile = function(event) {
  var output = document.getElementById('imageload');
  output.src = URL.createObjectURL(event.target.files[0]);
  console.log(event);
};
