//= require bootstrap
function dogvalidate(a,b,c,e,f){
  var regex_file = /(fileupload)/i;
  var v = a.match(regex_file);
  if(v != null) {
    var count = 0;
    var pos1 = a.indexOf('[');
    var pos2 = a.indexOf(']');
    var dogno = a.substr(pos1+1,1);
    var count = 0;
    var flag1 = 0;
    var dogerr = "";
    for(i = 0;i<5;i++) {
      var id = 'file'+dogno+'-upload'+(i+1);
      var dogpic = document.getElementById(id);
      var filen = dogpic.value;
      if(filen != null) {
        if(filen == ""){
          continue;
        }
        var allowed_extensions = new Array("jpg","png","gif");
        var n = filen.lastIndexOf(".");
        if(n < 1) {
          flag1 = 1;
          count = count + 1;
          dogerr = dogerr + "Pic"+i+": Enter Valid file(jpg,jpeg,png). ";
          document.getElementById('fileUpload'+dogno).innerHTML = dogerr;
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
            count = count + 1;
            flag1 = 1;
            dogerr = dogerr + "Pic"+i+": Enter Valid file(jpg,jpeg,png). ";
            document.getElementById('fileUpload'+dogno).innerHTML = dogerr;
          }
          else {
            document.getElementById('fileUpload'+dogno).innerHTML = "";
            count = count + 1;
          }
        }
      }
      else{
        flag1 = 1;
        dogerr = dogerr + "Pic"+i+": Enter Valid file(jpg,jpeg,png). ";
        document.getElementById('fileUpload'+dogno).innerHTML = dogerr;
      }
    }
    if(count < 1 || flag1 == 1){
      e[0] = 1;
      if(count < 1){
        document.getElementById('fileUpload'+dogno).innerHTML = "Please Enter Atleast 1 picture.";
      }
    }
  }
  else if (a == 'dog_name'){
    if(b.length <=0) {
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

        e[0] = 1;
      }
    }
  }
  else if(a == 'dog_breed'){
    if(b == 'Select'){
      document.getElementById(a+c+"err").innerHTML="Please Select a breed";
      e[0] = 1;
    }
    else if(b.length <=0 ){
      document.getElementById(a+c+"err").innerHTML="Please Select a breed";
      e[0] = 1;
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
    if(b.length == 3){
      if(b < 1000){
        b = '0'+b;
      }
    }
    regexp = /^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$/
    if(b.match(regexp)){
      document.getElementById(a+f).innerHTML="";
    }
    else {
      document.getElementById(a+f).innerHTML="Please Enter Valid ZIP Code";

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

      e[0] = 1;
    }
  }
  else if(a == "u_cpass"){
    if(b == e[2]){
      document.getElementById(a+f).innerHTML="";
    }
    else {
      document.getElementById(a+f).innerHTML="Passwords don't match";

      e[0] = 1;
    }
  }
  return e;
}

function loadFile(a){
  //var str = "file0-upload1plus";
  var pos = a.search("-");
  //var str = "Apple, Banana, Kiwi";
  var res = a.slice(pos-1,pos);
  var b = "dog_pic"+res;
  //console.log(b);
  b = document.getElementById(b);
  //console.log(b);
  var img1 = a+"img";
  var plus = a+"plus";
  img1 = document.getElementById(img1);
  //console.log(img1.src);
  if(img1.src == ""){
    var c1 = b.value;
    c1 = Number(c1);
    c1 = c1 + 1;
    b.value = c1;
  }
  var editid = a.substr(a.length-1,1);
  editid = 'file'+res+'-div'+editid;
  img1.src=URL.createObjectURL(event.target.files[0]);
  img1.style.display = "block";
  document.getElementById(plus).style.display = "none";
  document.getElementById(editid).classList.add("imgthere");
  //type validation.
  var file1 = document.getElementById(a);
  var filen = document.getElementById(a).value;
  var pos2 = a.slice(a.length-1,a.length);
  if(filen != null) {
    if(c1 == 0) {
      document.getElementById('fileUpload'+res).innerHTML = "Cannot Be Left Empty";
    }
    else {
      var allowed_extensions = new Array("jpg","png","gif");
      var n = filen.lastIndexOf(".");
      if(n < 1) {
        document.getElementById('fileUpload'+res).innerHTML = "Pic"+pos2+": Enter Valid file(jpg,jpeg,png).";
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
          document.getElementById('fileUpload'+res).innerHTML = "Pic"+pos2+": Enter Valid file(jpg,jpeg,png).";
        }
        else {
          document.getElementById('fileUpload'+res).innerHTML = "";
        }
      }
    }
  }
  else{
    document.getElementById('fileUpload'+res).innerHTML = "Cannot Be Left Empty";
  }
}
