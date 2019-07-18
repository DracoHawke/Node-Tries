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
