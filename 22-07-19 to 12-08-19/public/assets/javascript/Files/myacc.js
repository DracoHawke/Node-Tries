function loadFile(a){
  console.log(a);/*
  //var str = "file0-upload1plus";
  var pos = a.search("-");
  //var str = "Apple, Banana, Kiwi";
  var res = a.slice(pos-1,pos);
  var b = "dog_pic"+res;
  console.log(b);
  b = document.getElementById(b);
  console.log(b);*/
  var img1 = "imageload";
  img1 = document.getElementById(img1);
  console.log(img1.src);
  img1.src = URL.createObjectURL(event.target.files[0]);
  img1.style.display = "block";
}
