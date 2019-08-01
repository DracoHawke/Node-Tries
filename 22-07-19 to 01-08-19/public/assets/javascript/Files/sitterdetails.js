$('document').ready(function(){
  var a = document.getElementById('age1').innerHTML;
  console.log(a);
  var today = new Date();
  var birthDate = new Date(a);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
  }
  console.log(age);
  document.getElementById('age1').innerHTML = age;
});

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
