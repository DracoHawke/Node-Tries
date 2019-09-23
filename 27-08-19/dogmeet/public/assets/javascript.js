$('document').ready(function(){
  var isIE = /*@cc_on!@*/false || !!document.documentMode;
  if(isIE == true){
    $.urlParam = function(name){
      var results = new RegExp('[\?&]' + name).exec(window.location.href);
      console.log("results: ",results);
      if (results == null){
         return null;
      }
      else {
         return "yes";
      }
    }
    var signin = $.urlParam('signin');
    if(signin == "yes"){
      $('#modalLoginForm').modal();
    }
  }
  else{
    var url = new URLSearchParams(window.location.search);
    //console.log(url);
    //console.log(url.has("signin"))
    if(url.has("signin")){
      $('#modalLoginForm').modal();
    }
  }
  $('#loginbtn').click(function(){
    event.preventDefault();
    var email= $('#loginemail').val();
    var password = $('#loginpass').val();
    var yes = validate(email,password);
  })
})
// DASHBOARD AJAX
//posting form data
function update() {
  event.preventDefault();
	var fd=$("form")[0];
	var formdata=new FormData(fd);
	//var queryString = new URLSearchParams(formdata).toString();
	var h="/myacc";
  //console.log(formdata);
	$.ajax({
		url: h,
		type: "POST",
    processData: false,
    contentType: false,
    data:formdata,
		success: function(data) {
			var data1 = jQuery(data).filter("#list").html();
			if(typeof(data1)=="undefined")
			{
		     data1 = jQuery("#list > *", data);
			}
			jQuery("#list").html(data1);
			}
	});
	return false;
}
//links// dashboard ajax finish
//dog
function addmore() {
  event.preventDefault();
  var div = document.createElement('div');
  div.innerHTML = document.getElementById('repeat').innerHTML;
div.setAttribute('class', 'something');
document.getElementById("change").appendChild(div);
    return false;
}
//dog end
function success1(){
  console.log("you did it");
  $.ajax({
    url: '/',
    method: 'GET',
    contentType: 'application/json',
    success: function(response) {
      console.log(response);
      //$('#brand01').click();
      location.reload();
    }
  });
}
  var loadFile = function(event) {
    var output = document.getElementById('imageload');
    output.src = URL.createObjectURL(event.target.files[0]);
    console.log(event);
  };
  //if(document)

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
// sitter sitterdetails
function change(obj){
  document.getElementById("about-sitter").setAttribute("hidden", true);
  document.getElementById("give-rating").setAttribute("hidden", true);
  //document.getElementById(res).style.display="none";
  var element = document.getElementsByClassName("active");
    element[0].classList.remove("active");
    var x=obj.parentElement
    x.classList.add("active");
    var l = obj.href.length;
    var n = obj.href.lastIndexOf("#");
    var res = obj.href.slice(n+1, l);
    document.getElementById(res).removeAttribute("hidden");
}
//star Rating
function star_rating(obj){
  var x=obj.id;
  var rating=Number(x);
  for(var i=1;i<=rating;i++){
    var ele=document.getElementById(i.toString());
    ele.classList.remove("far");
    ele.classList.add("fas");
  }
  for(var i=rating+1;i<=5;i++)
  {
    var ele=document.getElementById(i.toString());
    ele.classList.remove("fas");
    ele.classList.add("far");
  }
}
//reset rating


// sitter update rating
function update_rating(e){
  var x = document.getElementsByClassName("rate");
  var c = x[0].children;
  for(var i = 4;i >= 0; i--) {
    var y=JSON.stringify(c[i].classList);
    if(y.lastIndexOf("fas")!=-1)
      break;
  }
  if(i == e-1){
    alert("please enter new value to update");
  }
  else if(i==-1) {
    alert("Please Rate Before Submiting");
  }
  else {
    var url = window.location.href;
    var data = {stars:(i+1).toString(),update: e};
    $.ajax({
      url: url,
      type: "GET",
      data: data,
      success: function(response) {
        console.log(response);
        if(String(response)=="yes") {
          console.log("rated successfully");
          location.reload();
        }
        else {
          console.log('oops something went wrong');
        }
      }
    });
  }
}
//star-rating finish


function reset_rating(){
  var x=document.getElementsByClassName("rate");
  var c =x[0].children;
  for(var i=0;i<5;i++)
  {
    c[i].classList.remove("fas");
    c[i].classList.add("far");
  }
}
//submit your Rating
function submit_rating(){
  var x=document.getElementsByClassName("rate");
  var c =x[0].children;
  for(var i=4;i>=0;i--)
  {
     var y=JSON.stringify(c[i].classList);
    if(y.lastIndexOf("fas")!=-1)
      break;
  }
  if(i==-1)
  {
    alert("Please Rate Before Submiting")
  }
  else{
    var url=window.location.href;
    var data={stars:(i+1).toString()};
    //alert(url);
     $.ajax({
       url: url,
       type: "GET",
       data:data,
       success: function(response) {
         console.log(response);
         if(String(response)=="yes")
         {
           console.log("rated successfully");
           location.reload();
         }
         else{
           console.log('oops something went wrong');
         }
       }
     });
   }
  }

//star-rating finish
//contact form validation
function contact_form() {
    document.getElementById('contact_formbtn1').setAttribute("disabled","disabled");
    var orm = document.getElementsByName("myform")[0];
    var formData = new FormData(orm);
    var name = document.myform.name.value;
    var mess = document.myform.message.value;
    var email = document.myform.email.value;
    var flag = 0;
    var regexp = /^[a-zA-Z][a-zA-Z\s]+$/;
    if(name == ''){
        document.getElementById("name_err").innerHTML = "Name Cannot Be Left Empty";
        flag = 1;
    }
    else{
        document.getElementById("name_err").innerHTML = "";
    }
    regexp = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
    if(email == ''){
        document.getElementById("email_err").innerHTML = "E-mail Cannot Be Left Empty";
        flag = 1;
    }
    else if(!email.match(regexp)){
        document.getElementById("email_err").innerHTML = "Please enter a valid E-mail address";
        flag = 1;
    }
    else{
        document.getElementById("email_err").innerHTML = "";
    }
    if(mess==''){
        document.getElementById("mess_err").innerHTML = "Please type in a message to send.";
        flag = 1;
    }
    else{
        document.getElementById("mess_err").innerHTML = "";
    }
    if(flag==1) {
      document.getElementById('contact_formbtn1').removeAttribute("disabled");
        return false;
    }
    else {
        return true;
    }
}
//contact form validation finish
