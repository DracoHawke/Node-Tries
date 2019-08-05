$('document').ready(function(){
  var a = document.getElementsByClassName('imgpic');
  //console.log(a);
  for (var key in a) {
   if (a.hasOwnProperty(key)) {
      //console.log(key, a[key]);
      b = a[key];
      c = $(b).attr("src");
      d = $(b).attr("id");
      console.log(c);
      if(!(c == "" || c== "undefined" || typeof c === "undefined")){
        b = document.getElementById(d);
        d = "fileupload"+key;
        //console.log(key);
        //console.log(b);
        d = document.getElementById(d);
        //console.log(d);
        d.value= c;
        if(d.value == ""){
          console.log('empty');
        }
        console.log(d);
        plus = "file0-upload"+(Number(key)+1)+"plus";
        console.log(plus);
        //b.src=URL.createObjectURL(event.target.files[0]);
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
    console.log(x1);
    var formData = new FormData(document.getElementById('myform2'));
    for (var pair of formData.entries()) {
      obj[pair[0]] = pair[1];
      console.log(pair[0]);
      console.log(pair[1]);
      console.log(typeof(pair[1]));
      if(pair[0] == 'form1'){
        items['a'+x1] = obj;
        x1 = x1 + 1;
        obj = {};
      }
      if(pair[0] == 'logedin'){
        if(pair[1] == '1'){
        //console.log("bbbbbbbbbbbbbbbbbq");
          //console.log(obj['u_cpass']);
          //console.log(obj['u_pass']);
          obj['u_cpass'] = obj['u_pass'];
          document.getElementById('u_cpass').value=obj['u_pass'];
        }
      }
    }/*
    items['a'+x1]=obj;
    items['b']=x1+1;
    console.log(items);
    var i = 0;
    var e = [0,0,""];
    var f = "_err";
    while(i <= x1){
      var iter = items['a'+i];
      for (var p in iter){
        e = dogvalidate(p,iter[p],i,e,f);
        //console.log(e);
        if(e[1] == 1){
          iter[p] = Number(iter[p]);
          iter[p] = iter[p].toFixed(1);
          e[1] = 0;
        }
      }
      i = i + 1;
    }
    console.log(items);
    console.log(e);
    if(e[0] == 1) {
      event.preventDefault();
    }*/
  });
});

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

function dogvalidate(a,b,c,e,f){
  if (a == 'dog_name'){
    if(b.length<=0) {
      console.log(a+c);
      document.getElementById(a+c).innerHTML="Please Enter Valid Name";
      e[0] = 1;
    }
    else {
      var regexp = /^[a-zA-Z]{2,}[a-zA-Z\s]*$/;
      if(b.match(regexp)) {
        document.getElementById(a+c).innerHTML="";
      }
      else {
        document.getElementById(a+c).innerHTML="Please Enter Valid Name";
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
  else if(a == "u_fname" || a == "u_lname"){
    if(b.length<=0) {
      console.log(a+f);
      document.getElementById(a+f).innerHTML="Please Enter Valid Name";
      e[0] = 1;
    }
    else {
      regexp = /^[a-zA-Z][a-zA-Z\s]+$/;
      if(b.match(regexp)) {
        document.getElementById(a+f).innerHTML="";
      }
      else {
        document.getElementById(a+f).innerHTML="Please Enter Valid Name";
        console.log("name");
        e[0] = 1;
      }
    }
  }
  else if(a == "u_lname"){
    if(b.length > 0) {
      regexp = /^[a-zA-Z][a-zA-Z\s]+$/;
      if(b.match(regexp)) {
        document.getElementById(a+f).innerHTML="";
      }
      else {
        document.getElementById(a+f).innerHTML="Please Enter Valid Name";
        console.log("name");
        e[0] = 1;
      }
    }
  }
  else if(a == "u_email"){
    regexp = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
    if(b.match(regexp)) {
      document.getElementById(a+f).innerHTML="";
    }
    else {
      document.getElementById(a+f).innerHTML="Please Enter Valid Email Id";
      console.log("name");
      e[0] = 1;
    }
  }
  else if(a == "u_phone"){
    //regexp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    regexp2 = /^(\d{10})$/;
    if(b.match(regexp2)){
      document.getElementById(a+f).innerHTML="";
    }
    else {
      document.getElementById(a+f).innerHTML="Please Enter Valid Phone Number";
      console.log("name");
      e[0] = 1;
    }
  }
  else if(a == "u_city" || a== "u_state"){
    if(b == 'Select') {
      document.getElementById(a+f).innerHTML="Please Select a value";
      e[0] = 1;
    }
    else {
      document.getElementById(a+f).innerHTML="";
    }
  }
  else if(a == "u_zip"){
    regexp = /^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$/
    if(b.match(regexp)){
      document.getElementById(a+f).innerHTML="";
    }
    else {
      document.getElementById(a+f).innerHTML="Please Enter Valid ZIP Code";
      console.log("name");
      e[0] = 1;
    }
  }
  else if(a == "u_pass"){
    regexp = /^(\d{3,4})$|^(?!.*(?:01|12|23|34|45|56|67|78|89|90|09|98|87|76|65|54|43|32|21|10))(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!.$%]{6,}$/
    if(b.match(regexp)){
      document.getElementById(a+f).innerHTML="";
      e[2] = b;
    }
    else {
      document.getElementById(a+f).innerHTML="Please Enter Valid Password";
      console.log("name");
      e[0] = 1;
    }
  }
  else if(a == "u_cpass"){
    if(b == e[2]){
      document.getElementById(a+f).innerHTML="";
    }
    else {
      document.getElementById(a+f).innerHTML="Passwords don't match";
      console.log("name");
      e[0] = 1;
    }
  }
  return e;
}
