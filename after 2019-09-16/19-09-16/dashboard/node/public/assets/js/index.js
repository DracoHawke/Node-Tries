function getknownroutes(a){
  if(a == "current"){
    a = 1;
  }
  $.ajax({
    url: "/getknownroutes?pageno="+a,
    type: "GET",
    success: function(response) {
      var substr = response.substr(0,11);
      var content = response.substr(11);
      //console.log(substr);
      if(substr == "successful1"){
          console.log(content);
          document.getElementById('known_routes').innerHTML = "";
          document.getElementById('known_routes').innerHTML = content;
          $('#known_routes').modal('show');
      }
    }
  });
}

$('document').ready(function(){
  $('button.btn.btn-danger').click(function(){
    alert("clicked");
    $('.modal').modal("hide");
  })
})
