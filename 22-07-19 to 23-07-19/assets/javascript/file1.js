function highlight1(x){
  var a = x.childNodes;
  var b = a[1].childNodes;
  b[3].style.backgroundColor="rgb(2, 2, 47)";
  b[3].style.color="white";
  x.style.borderColor="rgb(2, 2, 47)";
}

function dehighlight1(x){
  var a = x.childNodes;
  var b = a[1].childNodes;
  b[3].style.backgroundColor="rgb(242, 242, 244)";
  b[3].style.color="rgb(2, 2, 47)";
  x.style.borderColor="rgb(242, 242, 244)";
}

$('document').ready(function(){
  var url =new URLSearchParams(window.location.search);
  //console.log(url);
  //console.log(url.has("signin"))
  if(url.has("signin")){
    $('#modalLoginForm').modal();
  }
  $('#loginbtn').click(function(){
    event.preventDefault();
    var email= $('#loginemail').val();
    var password = $('#loginpass').val();
    var yes = validate(email,password);
  })
  $('#dogregister').click(function(){
    event.preventDefault();
    var items = {};
    var formData = new FormData(document.getElementById('myform2'));
    for (var pair of formData.entries()) {
      items[pair[0]] = pair[1];
      console.log(pair[0]+ ', ' + pair[1]);
    }
    console.log(items.length);
    console.log(items);
  })
  var max_fields = 5; //maximum input boxes allowed
  var wrapper = $("#wrappers"); //Fields wrapper
  var add_button = $("#add_another"); //Add button ID
  var x = 1;
  var y = 1; //initlal text box count
  $(add_button).click(function(e){ //on add input button click
    e.preventDefault();
    if(x < max_fields){ //max input box allowed
      x++; //text box increment
      y++;
      $(wrapper).append('<div class="row"><div class="col"><h3 class="fsize"> Register Your Dogs </h3>'+
      '<span class="underline2"></span></div></div><div class="card-deck cards2"><div class="card crd1 crdleft">'+
      '<div class="card-body"><p class="card-text">Dog Name <span class="text-danger">*</span></p>'+
      '<input type="text" class="form-control sel1" name="dog-name'+y+'" placeholder="Dog Name"></div>'+
      '</div><div class="card crd1"><div class="card-body"><p class="card-text">Breed<span class="text-danger">*</span></p>'+
      '<select name="dog-breed'+y+'" class="custom-select sel1"><option selected>Select</option>'+
      '<option value="volvo">Volvo</option><option value="fiat">Fiat</option><option value="audi">Audi</option>'+
      '</select></div></div><div class="card crd1"><div class="card-body"><p class="card-text">Gender<span class="text-danger">*</span></p>'+
      '<select name="dog-gender'+y+'" class="custom-select sel1"><option selected>Select</option>'+
      '<option value="volvo">Volvo</option><option value="fiat">Fiat</option><option value="audi">Audi</option>'+
      '</select></div></div><div class="card crd1"><div class="card-body"><p class="card-text">Age<span class="text-danger">*</span></p>'+
      '<select name="dog-age'+y+'" class="custom-select sel1" placeholder="Age"><option selected>Select</option>'+
      '<option value="volvo">Volvo</option><option value="fiat">Fiat</option><option value="audi">Audi</option>'+
      '</select></div></div></div><div class="card-group cards2"><div class="card crd1 crdleft">'+
      '<div class="card-body"><p class="card-text">About Me<span class="text-danger" >*</span></p>'+
      '<textarea name="dog-info'+y+'" class="form-control sel1" rows="3" placeholder="Write something about your dog"></textarea>'+
      '</div></div><input type="hidden" name="form1" value="'+y+'"/></div></div>');
    }
  });
  $(wrapper).on("click",".remove_another", function(e){ //user click on remove field
    e.preventDefault();
    var a = $(this).attr('id');
    $(a).remove();
    x--;
  });
});
function success1(){
  console.log("you did it");
  $.ajax({
    url: '/',
    method: 'GET',
    contentType: 'application/json',
    success: function(response) {
      console.log(response);
      //$('#brand01').click();
      window.location.assign('/');
    }
  });
}

function validate(email1,password){
  var err = 0;
  Pattern = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
  console.log(email1);
  if(String(email1).match(Pattern)){
    document.getElementById('emailerr').innerHTML="";
  }
  else{
    document.getElementById('emailerr').innerHTML="Invalid Email";
    err = err + 1;
  }
  password= password.toString();
  Pattern = /^(?!.*(?:01|12|23|34|45|56|67|78|89|90|09|98|87|76|65|54|43|32|21|10))(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!.$%]{6,}$/;
  if(!(password.match(Pattern))) {
    document.getElementById('passerr').innerHTML = "Invalid Password";
    err = err + 1;
  }
  else {
    document.getElementById('passerr').innerHTML ="";
  }
  var errors = "";
  if(err == 0){
    var id = '0';
    var data = {email: email1, password: password};
    $.ajax({
      url: '/pricing/'+ id,
      method: 'GET',
      contentType: 'application/json',
      data: data,
      success: function(response) {
        console.log(response);
        if(String(response) != "Yes"){
          event.preventDefault();
          console.log("im in");
          document.getElementById('passerr').innerHTML = response;
        }
        else{
          success1();
        }
      }
    });
  }
}
