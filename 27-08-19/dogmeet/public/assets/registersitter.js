$('document').ready(function(){
  var today = new Date();
  var date = (today.getFullYear() - 20)+'-'+("0" + (today.getMonth() + 1)).slice(-2)+'-'+today.getDate();
  var isIE = /*@cc_on!@*/false || !!document.documentMode;
  if(isIE == true){
    var left = document.getElementById('label10').innerHTML;
    left = "<button type='button' id='iebutton1' onclick='loadfileie()'>"+left+"</button>"
    //console.log(left);
    document.getElementById('label10').innerHTML = left;
  }
  $( "#dob" ).datepicker({ dateFormat: 'yy-mm-dd'});
  var dob12 = document.getElementById('dob');
  if(dob12 != null){
    document.getElementById('dob').setAttribute("max", date);
  }
});

function loadfileie(){
  $('#file_upload').click();
}

function error_load(obj){
  obj.src='assets/images/profile.png';
  console.log(document.getElementById("file_upload").value);
  $("#file_upload").val('');
  document.getElementById("file_name").value="";
  console.log(obj.src);
}

var loadFile1 = function(event) {
  var output = document.getElementById('imageload');
  output.src = URL.createObjectURL(event.target.files[0]);
  console.log(event);
  var file1 = document.getElementById('file_upload');
  var filen = document.getElementById('file_upload').value;
  if(filen != null) {
    if(filen == "") {
      document.getElementById('file_err').innerHTML = "Cannot Be Left Empty";
    }
    else {
      var allowed_extensions = new Array("jpg","png","gif");
      var n = filen.lastIndexOf(".");
      if(n < 1) {
        document.getElementById('file_err').innerHTML = "Enter Valid file(jpg,jpeg,png).";
      }
      else {
        var file_extension = filen.substr(n+1, filen.length).toLowerCase();
        console.log(file_extension);
        var flag2 = 1;
        for(var i = 0; i <= allowed_extensions.length; i++) {
            if(allowed_extensions[i]==file_extension) {
                 flag2 = 0;// valid file extension
            }
        }
        console.log(flag2);
        if(flag2 != 0) {
          document.getElementById('file_err').innerHTML = "Enter Valid file(jpg,jpeg,png).";
        }
        else {
          document.getElementById('file_err').innerHTML = "";
          document.getElementsByClassName('className')
        }
      }
    }
  }
  else{
    document.getElementById('file_err').innerHTML = "Cannot Be Left Empty";
  }
};

function validateform(){
var orm = document.getElementsByName("myform")[0];
var formData = new FormData(orm);
var fname = document.myform.fname.value;
var lname = document.myform.lname.value;
var email = document.myform.email.value;
var phone = document.myform.phone.value;
var file1 = document.myform.fileUpload;
var filen = document.myform.fileUpload.value;
console.log('success');
var flag = 0;
var regexp = /^[a-zA-Z][a-zA-Z\s]+$/;
if(fname==''){
  document.getElementById("fname_err").innerHTML="First Name Cannot Be Left Empty";
  flag = 1;
}
else if(!fname.match(regexp)){
  document.getElementById("fname_err").innerHTML="No White Spaces and Numbers are allowed in Name Field";
  flag = 1;
}
else{
  document.getElementById("fname_err").innerHTML="";
}
if(lname==''){
  document.getElementById("lname_err").innerHTML="Last Name Cannot Be Left Empty";
  flag = 1;
}
else if(!fname.match(regexp)){
  document.getElementById("lname_err").innerHTML="No White Spaces and Numbers are allowed in Name Field";
  flag = 1;
}
else{
  document.getElementById("lname_err").innerHTML="";
}
regexp = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
if(email==''){
  document.getElementById("email_err").innerHTML="E-mail Cannot Be Left Empty";
  flag = 1;
}
else if(!email.match(regexp)){
  document.getElementById("email_err").innerHTML="Please enter a valid E-mail address";
  flag = 1;
}
else{
  document.getElementById("email_err").innerHTML="";
}
regexp = /^(\d{10})$/;
if(phone == ''){
  document.getElementById("phone_err").innerHTML="Phone number Cannot Be Left Empty";
  flag = 1;
}
else if(!phone.match(regexp)){
  document.getElementById("phone_err").innerHTML="Please enter a valid Phone Number";
  flag = 1;
}
else{
  document.getElementById("phone_err").innerHTML="";
}
if(document.myform.password!=null){
var pass = document.myform.password.value;
var conpass = document.myform.confirmPass.value;
regexp = /^(\d{3,4})$|^(?!.*(?:01|12|23|34|45|56|67|78|89|90|09|98|87|76|65|54|43|32|21|10))(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!.$%]{6,}$/;
if(pass == ''){
  document.getElementById("password_err").innerHTML="Password Cannot Be Left Empty";
  flag = 1;
}
else if(!pass.match(regexp)){
  document.getElementById("password_err").innerHTML="The Password must contain 1 Capital letter,1 Small letter,1 Special Character,1 Number and there should be no trailing/sequential numbers.";
  flag = 1;
}
else{
  document.getElementById("password_err").innerHTML="";
  if(conpass == pass){
    document.getElementById("confirm_err").innerHTML="";
  }
  else {
    document.getElementById("confirm_err").innerHTML="Does not match the Password";
  }
}}
if(document.myform.dob != null){
  var dob = document.myform.dob.value;
    if(dob == ''){
        document.getElementById("dob_err").innerHTML="Date of Birth cannot be left Empty.";
        flag = 1;
    }
}
if(filen != null){
  if(filen == ""){
    document.getElementById('file_err').innerHTML = "Cannot Be Left Empty";
    flag = 1;
  }
  else {
    var allowed_extensions = new Array("jpg","png","gif");
    var n = filen.lastIndexOf(".");
    if(n < 1) {
      document.getElementById('file_err').innerHTML = "Enter Valid file(jpg,jpeg,png).";
      flag = 1;
    }
    else {
      var file_extension = filen.substr(n+1, filen.length).toLowerCase();
      console.log(file_extension);
      var flag2 = 1;
      for(var i = 0; i <= allowed_extensions.length; i++) {
          if(allowed_extensions[i]==file_extension) {
               flag2 = 0;// valid file extension
          }
      }
      console.log(flag2);
      if(flag2 != 0) {
        document.getElementById('file_err').innerHTML = "Enter Valid file(jpg,jpeg,png).";
        flag = 1;
      }
      else {
        document.getElementById('file_err').innerHTML = "";
      }
    }
  }
  console.log(filen);
}
if(flag == 1) {
  console.log(file1);
  console.log(filen);
  return false;
}
else {
  console.log(file1);
  console.log(filen);
  return false;
  }
}
