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
    var email= $('#loginemail');
    var password = $('#loginpass');
    var yes = validate(email,password);
    $.ajax({
      url: '/products',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ name: createInput.val() }),
      success: function(response) {
        console.log(response);
        createInput.val('');
        $('#get-button').click();
      }
    });
  })
})

function validate(email,password){
  var err = 0;
  Pattern = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
  email = email.trim();
  if(email.match(Pattern)){}
  else{
    document.getElementById('emailerr').innerHTML="Invalid Email";
    err = err + 1;
  }
  password= password.toString();
  Pattern = /^(?!.*(?:01|12|23|34|45|56|67|78|89|90|09|98|87|76|65|54|43|32|21|10))(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!.$%]{6,}$/;
  if(!(Str.match(Pattern))) {
    document.getElementById('passerr').innerHTML = "Invalid Password";
    err = err + 1;
  }
  else {
    document.getElementById(b).innerHTML ="";
  }
  if(err == 0){
    var mysql = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'practice1'
    });
    connection.connect();
    connection.query('SELECT * from users where ')
  }
}
