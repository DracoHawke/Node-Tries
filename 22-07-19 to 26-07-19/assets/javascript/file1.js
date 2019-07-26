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

function toggleField(hideObj,showObj){
 hideObj.disabled=true;
 hideObj.style.display='none';
 document.getElementById(showObj).disabled=false;
 document.getElementById(showObj).style.display='inline';
 document.getElementById(showObj).focus();
}

$('document').ready(function(){
  var url =new URLSearchParams(window.location.search);
  if(url.has("signin")){
    $('#modalLoginForm').modal();
  }
  $('#loginbtn').click(function(){
    event.preventDefault();
    var email= $('#loginemail').val();
    var password = $('#loginpass').val();
    var yes = validate(email,password);
  })
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
