//= require bootstrap
function dogvalidate(a,b,c,e){
  if (a == 'dog_name'){
    if(b.length<=0) {
      console.log(a+c);
      document.getElementById(a+c).innerHTML="Please Enter Valid Name";
      e[0] = 1;
    }
    else {
      var regexp = /^[a-zA-Z]+$/;
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
      var regexp = /^[a-zA-Z]+$/;
      if(b.match(regexp)) {
        document.getElementById(a+c+"err").innerHTML="";
      }
      else {
        document.getElementById(a+c+"err").innerHTML="Please Enter Valid Breed";
        e[0] = 1;
        console.log("breed3");
      }
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
  return e;
}
$('document').ready(function(){
  $('.dog_age').tooltip({title: "Format ex. 0.8 for 8 mn or 1 for 1yr or 1.5 for 1.5yr", trigger: "hover focus", placement: "auto"});
  $('#dogregister').click(function(){
    //event.preventDefault();
    var items = {};
    var obj = {};
    var x1 = 0;
    var formData = new FormData(document.getElementById('myform2'));
    for (var pair of formData.entries()) {
      obj[pair[0]] = pair[1];
      if(pair[0] == 'form1'){
        items['a'+x1] = obj;
        x1 = x1 + 1;
        obj = {};
      }
    }
    items['a'+x1]=obj;
    items['b']=x1+1;
    var i = 0;
    var e = [0,0];
    while(i <= x1){
      var iter = items['a'+i];
      for (var p in iter){
        e = dogvalidate(p,iter[p],i,e);
        console.log(e);
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
    if(e[0] == 0) {
      $.ajax({
        url: '/registerdog',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(items),
        success: function(response) {
          //console.log(response);
          if(String(response) != "Yes"){
            //event.preventDefault();
            console.log("im in");
            document.getElementById('passerr').innerHTML = response;
          }
          else{
            success1();
          }
        }
      });
    }
  })
  var max_fields = 5; //maximum input boxes allowed
  var wrapper = $("#wrappers"); //Fields wrapper
  var add_button = $("#add_another"); //Add button ID
  var x = 1;
  var y = 0; //initlal text box count
  $(add_button).click(function(e){ //on add input button click
    e.preventDefault();
    if(x < max_fields){ //max input box allowed
      x++; //text box increment
      y++;
      $(wrapper).append('<div class="row"><div class="col"><h3 class="fsize"> Register Your Dogs </h3>'+
      '<span class="underline2"></span></div></div><div class="card-deck cards2"><div class="card crd1 crdleft">'+
      '<div class="card-body"><p class="card-text">Dog Name <span class="text-danger">*</span></p>'+
      '<input type="text" class="form-control sel1" name="dog_name" placeholder="Dog Name">'+
      '<p class="red2" id="dog_name'+y+'"></p></div>'+
      '</div><div class="card crd1"><div class="card-body"><p class="card-text">Breed<span class="text-danger">*</span></p>'+
      '<select name="dog_breed" id="dog_breed'+y+'" onchange="if(this.options[this.selectedIndex].value==\'customOption\'){toggleField(this,\'custom-dog_breed'+y+'\');this.selectedIndex=\'0\';}" class="custom-select sel1"><option selected>Select</option>'+
      '<option value="volvo">Volvo</option><option value="fiat">Fiat</option><option value="audi">Audi</option><option value="customOption">type your dog\'s breed</option>'+
      '</select><input name="dog_breed" id="custom-dog_breed'+y+'" class="form-control sel1" style="display:none;" disabled="disabled" onblur="if(this.value==\'\'){toggleField(this,\'dog_breed'+y+'\');}"><p class="red2" id="dog_breed'+y+'err"></p></div></div>'+
      '<div class="card crd1"><div class="card-body"><p class="card-text">Gender<span class="text-danger">*</span></p>'+
      '<select name="dog_gender" class="custom-select sel1"><option selected>Select</option>'+
      '<option value="Male">Male</option><option value="Female">Female</option>'+
      '</select><p class="red2" id="dog_gender'+y+'"></p></div></div><div class="card crd1"><div class="card-body"><p class="card-text">Age<span class="text-danger">*</span></p>'+
      '<input type="text" class="form-control sel1 dog_age" name="dog_age" placeholder="Dog Age"><p class="red2" id="dog_age'+y+'"></p></div></div></div>'+
      '<div class="card-group cards2"><div class="card crd1 crdleft">'+
      '<div class="card-body"><p class="card-text">About Me<span class="text-danger" >*</span></p>'+
      '<textarea name="dog_info" class="form-control sel1" rows="3" placeholder="Write something about your dog"></textarea>'+
      '</div></div><input type="hidden" name="form1" value="'+y+'"/></div></div>');
    }
  });
  $(wrapper).on("click",".remove_another", function(e){ //user click on remove field
    e.preventDefault();
    var a = $(this).attr('id');
    $(a).remove();
    x--;
  });
});
