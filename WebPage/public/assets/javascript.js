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
})
// DASHBOARD AJAX
//posting form data
function update()
{
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
//links
function dlt(url)
{
	 if (typeof (history.pushState) != "undefined") {
		$.ajax({
			url: url,
			type: "GET",
			success: function(data) {
				var data1 = jQuery(data).filter("#list").html();
				if(typeof(data1)=="undefined")
				{
			     data1 = jQuery("#list > *", data);
				}
				jQuery("#list").html(data1);
			}
		});
	}
	else  {
		window.location.href=url;
	}
	return false;
}

$(document).ready(function(){
$(document).on('click','.for_ajax',function(){
    var href = $(this).attr('href');
    dlt(href);
    return false;
});
});
// dashboard ajax finish
//dog
function addmore()
{
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
      window.location.assign('/');
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

function reset_rating(){
  var x=document.getElementsByClassName("rate");
  var c =x[0].children;
  for(var i=0;i<5;i++)
  {
    c[i].classList.remove("fas");
    c[i].classList.add("far");
  }
}

//star-rating finish
