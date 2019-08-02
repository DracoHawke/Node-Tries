// sitter matedetails
function change(obj){
  document.getElementById("about-mate").setAttribute("hidden", true);
  document.getElementById("give-rating").setAttribute("hidden", true);
  document.getElementById("image-mate").setAttribute("hidden", true);
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

//function show_images(obj,a,b){
  //document.getElementById(a).setAttribute("hidden", true);
  //document.getElementById(b).setAttribute("hidden", true);

//}

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

//submit your Rating
function submit_rating(){
  var x=document.getElementsByClassName("rate");
  var c =x[0].children;
  for(var i=4;i>=0;i--) {
    var y=JSON.stringify(c[i].classList);
    if(y.lastIndexOf("fas")!=-1)
      break;
  }
  if(i==-1) {
    alert("Please Rate Before Submiting")
  }
  else {
    var url=window.location.href;
    var data={stars:(i+1).toString()};
    alert(url);
    $.ajax({
      url: url,
      type: "GET",
      data:data,
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
