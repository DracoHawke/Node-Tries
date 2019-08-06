$('document').ready(function(){
  var count1 = 0;
  var count2 = 0;
  var check1 = 0;
  var check2 = 0;
  $(".focus1").focusin(function(){
    check1 = $(this).val();
  });
  $(".focus1").focusout(function(){
    check2 = $(this).val();
    if(check1 != check2){
      count1 = count1 + 1;
      console.log(count1);
    }
  });
  $(".focus2").click(function(){
      count2 = count2 + 1;
      console.log(count2);
  });
  var a = document.getElementsByClassName('imgpic');
  for (var key in a) {
   if (a.hasOwnProperty(key)) {
      b = a[key];
      c = $(b).attr("src");
      d = $(b).attr("id");
      console.log(c);
      if(!(c == "" || c== "undefined" || typeof c === "undefined")){
        b = document.getElementById(d);
        d = "fileupload"+key;
        d = document.getElementById(d);
        d.value= c;
        if(d.value == ""){
          console.log('empty');
        }
        console.log(d);
        plus = "file0-upload"+(Number(key)+1)+"plus";
        console.log(plus);
        b.style.display = "block";
        d = "imgupload"+key;
        d = document.getElementById(d);
        d.style.paddingTop = "2.4vw";
        d.style.backgroundColor = "rgb(248, 248, 253)";
        document.getElementById(plus).style.display = "none";
      }
    }
  }
  $('#dogregister').click(function(){
    var items = {};
    var obj = {};
    console.log("i'm here in click");
    var x1 = 0;
    var formData = new FormData(document.getElementById('myform2'));
    for (var pair of formData.entries()) {
      obj[pair[0]] = pair[1];
    }
    var i = 0;
    var e = [0,0,"",0];
    var f = "_err";
    while(i <= x1){
      for (var p in obj){
        //console.log(p," = ",obj[p]);
        g = p.slice(0,p.length-1);
        h = p.charAt(p.length - 1);
        //console.log(g, " ", h);
        if(g == "fileupload"){
          console.log(obj[p]);
          if(obj[p] == "updated"){
            e[3] = 1;
          }
        }
        e = dogvalidate(p,obj[p],i,e,f);
        if(e[1] == 1){
          iter[p] = Number(iter[p]);
          iter[p] = iter[p].toFixed(1);
          e[1] = 0;
        }
      }
      i = i + 1;
    }
    console.log("count1 ", count1, " count2 ", count2);
    //console.log(items);
    console.log(e);
    if(e[0] == 1 || e[3] != 1) {
      console.log(e[0], " ", e[3]);
      event.preventDefault();
    }
    if(count1 == 0 && count2 == 0){
      console.log("No Change");
      event.preventDefault();
    }
  });
});

function dogvalidate(a,b,c,e,f){
  if (a == 'dog_name'){
    if(b.length <= 0) {
      console.log(a+c);
      document.getElementById(a + c).innerHTML="Please Enter Valid Name";
      e[0] = 1;
    }
    else {
      var regexp = /^[a-zA-Z]{2,}[a-zA-Z\s]*$/;
      if(b.match(regexp)) {
        document.getElementById(a + c).innerHTML="";
      }
      else {
        document.getElementById(a + c).innerHTML="Please Enter Valid Name";
        console.log("name");
        e[0] = 1;
      }
    }
  }
  else if(a == 'dog_breed'){
    if(b == 'Select'){
      document.getElementById(a+c+"err").innerHTML="Please Select a breed";
      e[0] = 1;
      console.log("breed1");
    }
    else if(b.length <=0 ){
      document.getElementById(a+c+"err").innerHTML="Please Select a breed";
      e[0] = 1;
      console.log("breed2");
    }
    else {
      document.getElementById(a+c+"err").innerHTML="";
    }
  }
  else if(a == "dog_gender"){
    if(b == 'Select'){
      document.getElementById(a+c).innerHTML="Please Select a gender";
      e[0] = 1;
    }
    else{
      document.getElementById(a+c).innerHTML="";
    }
  }
  else if(a == "dog_age"){
    if(b == ''){
      document.getElementById(a+c).innerHTML="Please enter Age";
      e[0] = 1;
    }
    else{
      b = Number(b);
      d = Math.ceil(b);
      if(isNaN(b)) {
        document.getElementById(a+c).innerHTML="Please enter Valid Age";
        e[0] = 1;
      }
      else if(d < 1 || d > 20){
        document.getElementById(a+c).innerHTML="Please enter Valid Age";
        e[0] = 1;
      }
      else{
        document.getElementById(a+c).innerHTML="";
        e[1] = 1;
      }
    }
  }
  else{
    console.log("i am ", a, " = ", b);
  }
  return e;
}

function loadFile(a){
  console.log(a);
  var pos = a.search("-");
  var res = a.slice(pos-1,pos);
  var b = "dog_pic"+res;
  console.log(b);
  b = document.getElementById(b);
  console.log(b);
  var img1 = a+"img";
  var plus = a+"plus";
  var res2 = a.charAt(a.length - 1);
  console.log(res2);
  var label = "imgupload"+(Number(res2)-1);
  label = document.getElementById(label);
  img1 = document.getElementById(img1);
  console.log(img1.src);
  e = "fileupload"+ (Number(res2)-1);
  f = document.getElementById(e).value;
  if(img1.src != f){
    var c = b.value;
    c = Number(c);
    c = c + 1;
    b.value = c;
    document.getElementById(e).value="updated";
  }
  img1.src=URL.createObjectURL(event.target.files[0]);
  img1.style.display = "block";
  label.style.paddingTop = "2.4vw";
  label.style.backgroundColor = "rgb(248, 248, 253)";
  console.log(img1.style.display);
  document.getElementById(plus).style.display = "none";
}
