var err = 0;
var err1 = 0;
var result = "a";
function myfunction(a,b,c,d,e,f,g){
  //document.getElementById('Main').innerHTML = "I'm In";
  var stri = document.getElementById(a).value;
  if(c == 'name'){
    Str = stri.toString();
    if(Str.length<=0) {
      document.getElementById(b).innerHTML="Please Enter Valid Name";
      window.err = window.err + 1;
    }
    else {
      var regexp = /^[a-zA-Z]+$/;
      if(Str.match(regexp)) {
        document.getElementById(b).innerHTML="";
        if(window.err > 0){
          window.err = window.err - 1;
        }
      }
      else {
        document.getElementById(b).innerHTML="Please Enter Valid Name";
        window.err = window.err + 1;
      }
    }
  }
  else if(c == 'email') {
    //var comment = document.getElementById('Main').innerHTML;
    Pattern = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
    Str = stri.toString();
    Str = Str.trim();
    if(Str.match(Pattern)) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.result = this.responseText;
            //console.log(window.result);
            if(window.result.trim()=="present"){
              //console.log(window.result);
              document.getElementById(b).innerHTML="Email already taken";
              window.err = window.err + 1;
            }
            else {
              if(window.err > 0){
                document.getElementById(b).innerHTML="";
                window.err = window.err - 1;
              }
            }
        }
      };
      xmlhttp.open("GET", "checkmail.php?email=" + Str, true);
      xmlhttp.send();
      document.getElementById(b).innerHTML="";
      if(window.err > 0){
        window.err = window.err - 1;
      }
    }
    else {
      document.getElementById(b).innerHTML="Please Enter Valid Email";
      window.err = window.err + 1;
    }
  }
  else if(c == 'password'){
    Str = stri.toString();
    Pattern = /^(?!.*(?:01|12|23|34|45|56|67|78|89|90|09|98|87|76|65|54|43|32|21|10))(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!.$%]{6,}$/;
    if(!(Str.match(Pattern))) {
      document.getElementById(b).innerHTML = "PASSWORD must be minimum 6 characters long, must have a special character, a number, a character, a uppercase letter, do not contain series of numbers like 123 or 654";
      window.err = window.err + 1;
    }
    else {
      document.getElementById(b).innerHTML ="";
      if(window.err > 0){
        window.err = window.err - 1;
      }
    }
    if(!(d === undefined)) {
      //document.getElementById('Main').innerHTML = "I'm In 2";
      var s1 = document.getElementById(d).value;
      var str1 = s1.toString();
      if(str1==Str) {
        document.getElementById(b).innerHTML="";
        if(window.err > 0){
          window.err = window.err - 1;
        }
      }
      else {
        document.getElementById(b).innerHTML="Passwords dont match";
        window.err = window.err + 1;
      }
    }
  }
  else if(c == "subjects"){
    if(!(document.getElementById(d).checked || document.getElementById(e).checked || document.getElementById(f).checked || document.getElementById(g).checked)){
      document.getElementById(b).innerHTML="Please Select Atleast One subject";
      window.err = window.err + 1;
    }
    else {
      document.getElementById(b).innerHTML="";
      if(window.err > 0){
        window.err = window.err - 1;
      }
    }
  }
  else if(c == "select"){
    if(!(stri=="Football" || stri == "Cricket" || stri == "Baseball")){
      document.getElementById(b).innerHTML="Please Select Atleast One Sports";
      window.err = window.err + 1;
    }
    else {
      document.getElementById(b).innerHTML="";
      if(window.err > 0){
        window.err = window.err - 1;
      }
    }
  }
  else if(c == "login"){
    Pattern = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
    Str = stri.toString();
    Str = Str.trim();
    if(Str.match(Pattern)){
      document.getElementById(b).innerHTML="";
      if(window.err1 > 0){
        window.err1 = window.err1 - 1;
      }
    }
    else{
      document.getElementById(b).innerHTML="Please Enter Valid Email";
      window.err1 = window.err + 1;
    }
  }
}
function Validate(a){
  if(a == "submit"){
    myfunction('fname','FnameErr','name');
    myfunction('lname','LnameErr','name');
    myfunction('email','EmailErr','email');
    myfunction('password','PassError','password');
    myfunction('cpassword','cpasserror','password','password');
    myfunction('fname','SubErr','subjects','Eng','Sc','Math','CSc');
    myfunction('Sports','SportsErr','select');
    if(window.err > 0){
      alert("Please Update Fields Accordingly");
      return false;
    }
    else {
      //alert("i'm in");
      var formData=new FormData(document.getElementById('Signup'));
      $.ajax({url: "insert.php",
        type:'POST',
        data: formData,
        processData: false,
        contentType:false,
        success:function(data,status) {
          alert(data);
        }
      });
      alert("Success");
      getElementById('Signup').reset();
    }
  }
  else if(a == "login"){
    myfunction('email1','EmailErr1','login');
    if(window.err1 > 0){
      alert("Please Update Fields Accordingly");
      return false;
    }
    else {
      //alert("i'm in");
      var formData=new FormData(document.getElementById('Login'));
      $.ajax({url: "insert.php",
        type:'POST',
        data: formData,
        processData: false,
        contentType:false,
        success:function(data,status) {
          alert(data);
          window.location.href = "http://localhost/My%20files/Form/Home2.php?";
        }
      });
    }
    return false;
  }
}
