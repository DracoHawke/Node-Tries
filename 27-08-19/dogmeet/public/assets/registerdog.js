//= require bootstrap
function dogvalidate(a,b,c,e,f){
  if (a == 'dog_name'){
    if(b.length<=0) {
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
    var c = b.value;
    c = Number(c);
    c = c + 1;
    b.value = c;
  }
  img1.src=URL.createObjectURL(event.target.files[0]);
  img1.style.display = "block";
  document.getElementById(plus).style.display = "none";
}

$('document').ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $('.dog_age').tooltip({title: "Format ex. 0.8 for 8 mn or 1 for 1yr or 1.5 for 1.5yr", trigger: "hover focus", placement: "auto"});
  $('#dogregister').click(function(){
    var items = {};
    var obj = {};
    //console.log("i'm here in click");
    var x1 = 0;
    //console.log(x1);
    var formData = new FormData(document.getElementById('myform2'));
    for (var pair of formData.entries()) {
      obj[pair[0]] = pair[1];
      //console.log(pair[0]);
      //console.log(pair[1]);
      //console.log(typeof(pair[1]));
      if(pair[0] == 'form1'){
        items['a'+x1] = obj;
        x1 = x1 + 1;
        obj = {};
      }
      if(pair[0] == 'logedin'){
        if(pair[1] == '1'){
        ////console.log("bbbbbbbbbbbbbbbbbq");
          ////console.log(obj['u_cpass']);
          ////console.log(obj['u_pass']);
          obj['u_cpass'] = obj['u_pass'];
          document.getElementById('u_cpass').value=obj['u_pass'];
        }
      }
    }
    items['a'+x1]=obj;
    items['b']=x1+1;
    //console.log(items);
    var i = 0;
    var e = [0,0,""];
    var f = "_err";
    while(i <= x1){
      var iter = items['a'+i];
      for (var p in iter){
        e = dogvalidate(p,iter[p],i,e,f);
        ////console.log(e);
        if(e[1] == 1){
          iter[p] = Number(iter[p]);
          iter[p] = iter[p].toFixed(1);
          e[1] = 0;
        }
      }
      i = i + 1;
    }
    //console.log(items);
    //console.log(e);
    if(e[0] == 1) {
      event.preventDefault();
    }
  });
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
      document.getElementById('add_another').removeAttribute("disabled", "");
      $(wrapper).append('<div id="x'+y+'"><div class="row"><div class="col">'+
      '<a href="" id="'+y+'" class="display1 remove_another"><div class="circleBase type2"><span class="fontplus">-</span></div>'+
      '<p class="red2">Remove Dog</p></a></div></div><div class="row"><div class="col" style="line-height:2;">'+
      '<span class=" registeration-head" style="border-bottom: solid rgb(236, 54, 100) 2px;">Re</span>'+
      '<span class=" registeration-head">gister</span><span class=" registeration-head" style="border:0;"> Your Dog</span>'+
      '</div></div><div class="card-deck cards2"><div class="card crd1 crdleft">'+
      '<div class="card-body crdpad1"><p class="card-text">Dog Picture(s) <span class="red2">*</span></p><div class="row">'+
      '<label for="file'+y+'-upload1" class="imgupload"><p class="plus" id="file'+y+'-upload1plus">+'+
      '</p><img id="file'+y+'-upload1img" class="imgpic"></img></label>'+
      '<input hidden style="width:1%; height:1%;" type="file" class="form-control size-1 fileUpload" name="fileUpload['+y+']" id="file'+y+'-upload1" accept="image/*" value="" onchange="loadFile(this.id)">'+
      '<label for="file'+y+'-upload2" class="imgupload"><p class="plus" id="file'+y+'-upload2plus">+</p>'+
      '<img id="file'+y+'-upload2img" class="imgpic"></img></label>'+
      '<input hidden style="width:1%; height:1%;" type="file" class="form-control size-1 fileUpload" name="fileUpload['+y+']" id="file'+y+'-upload2" accept="image/*" value="" onchange="loadFile(this.id)">'+
      '<label for="file'+y+'-upload3" class="imgupload"><p class="plus" id="file'+y+'-upload3plus">+</p>'+
      '<img id="file'+y+'-upload3img" class="imgpic"></img></label>'+
      '<input hidden style="width:1%; height:1%;" type="file" class="form-control size-1 fileUpload" name="fileUpload['+y+']" id="file'+y+'-upload3" accept="image/*" value="" onchange="loadFile(this.id)">'+
      '<label for="file'+y+'-upload4" class="imgupload"><p class="plus" id="file'+y+'-upload4plus">+</p>'+
      '<img id="file'+y+'-upload4img" class="imgpic"></img></label>'+
      '<input hidden style="width:1%; height:1%;" type="file" class="form-control size-1 fileUpload" name="fileUpload['+y+']" id="file'+y+'-upload4" accept="image/*" value="" onchange="loadFile(this.id)">'+
      '<label for="file'+y+'-upload5" class="imgupload"><p class="plus" id="file'+y+'-upload5plus">+</p>'+
      '<img id="file'+y+'-upload5img" class="imgpic"></img></label>'+
      '<input hidden style="width:1%; height:1%;" type="file" class="form-control size-1 fileUpload" name="fileUpload['+y+']" id="file'+y+'-upload5" accept="image/*" value="" onchange="loadFile(this.id)">'+
      '<span class="red2">*</span></div><span class="red2" id="fileUpload'+y+'"></span><input type="hidden" id="dog_pic'+y+
      '" name="dogpic" value="0"></div></div></div>'+
      '<div class="card-deck cards2"><div class="card crd1 crdleft">'+
      '<div class="card-body"><p class="card-text">Dog Name <span class="text-danger">*</span></p><div class="display2">'+
      '<input type="text" class="form-control sel1" name="dog_name" placeholder="Dog Name">'+
      '<a data-toggle="tooltip" data-placement="auto" title="The Name must be atleast 2 in length and may contain spaces">'+
      '<i class="fas fa-info-circle red2 icon7"></i></a></div>'+
      '<p class="red2" id="dog_name'+y+'"></p></div>'+
      '</div><div class="card crd1"><div class="card-body"><p class="card-text">Breed<span class="text-danger">*</span></p>'+
      '<select name="dog_breed" id="dog_breed0" class="custom-select sel1">'+
      '<option value="Select">Select Dog</option>'+
      '<option value="affenpinscher-dog-breed">Affenpinscher	</option>'+
      '<option value="afghan">Afghan</option>'+
      '<option value="Airedale_Terrier">Airedale Terrier</option>'+
      '<option value="akita-dog-breed">Akita Dog Breed</option>'+
      '<option value="alaskan-malamute-dogs">Alaskan Malamute Dogs</option>'+
      '<option value="american-eskimo-dog">American Eskimo Dog</option>'+
      '<option value="American_Foxhound">American Foxhound</option>'+
      '<option value="American_Staffordshire_Terrier">American Staffordshire Terrier</option>'+
      '<option value="American_Water_Spaniel">American Water Spaniel</option>'+
      '<option value="anatolian-shepherd-dogs">Anatolian Shepherd Dogs</option>'+
      '<option value="Australian_Cattle_Dog">Australian Cattle Dog</option>'+
      '<option value="Australian_Shepherd">Australian Shepherd</option>'+
      '<option value="AustralianTerrier">Australian Terrier</option>'+
      '<option value="basenji">Basenji</option>'+
      '<option value="Basset_Hound">Basset Hound</option>'+
      '<option value="Beagle">Beagle</option>'+
      '<option value="Bearded_Collie">Bearded Collie</option>'+
      '<option value="Bedlington_Terrier">Bedlington Terrier</option>'+
      '<option value="Belgian_Malinois">Belgian Malinois</option>'+
      '<option value="Belgian_Sheepdog">Belgian Sheepdog</option>'+
      '<option value="Belgian_Tervuren">Belgian Tervuren</option>'+
      '<option value="bernese-mountain-dogs">Bernese Mountain Dogs</option>'+
      '<option value="bichon-frise">Bichon Frise</option>'+
      '<option value="Black-And-Tan-Coonhound">Black And Tan Coonhound</option>'+
      '<option value="black-russian-terriers">Black Russian Terriers</option>'+
      '<option value="Bloodhound">Bloodhound</option>'+
      '<option value="Border_Collie">Border Collie</option>'+
      '<option value="Border_Terrier">Border Terrier</option>'+
      '<option value="Borzoi">Borzoi</option>'+
      '<option value="boston-terrier">Boston Terrier</option>'+
      '<option value="Bouvier_des_Flandres">Bouvier_des_Flandres</option>'+
      '<option value="Briard">Briard</option>'+
      '<option value="Brittany">Brittany	</option>'+
      '<option value="toydogs-BrusselsGriffon">Brussels Griffon</option>'+
      '<option value="english-bull-dogs">Bulldog</option>'+
      '<option value="bull-mastiff-dog">Bull Mastiff Dog</option>'+
      '<option value="Bull_Terrier">Bull Terrier</option>'+
      '<option value="Cairn_Terrier">Cairn Terrier</option>'+
      '<option value="Canaan_Dog">Canaan Dog</option>'+
      '<option value="C">Cardigan Welsh Corgi</option>'+
      '<option value="king-charles-cavalier-spaniel">Cavalier King Charles Spaniel</option>'+
      '<option value="Chesapeake_Bay_Retriever">Chesapeake Bay Retriever</option>'+
      '<option value="chihuahua-dog-breed">Chihuahua</option>'+
      '<option value="chinese-crested-dog-breed">Chinese Crested</option>'+
      '<option value="chinese-shar-pei">Chinese Shar Pei</option>'+
      '<option value="chow-chow-dog">Chow Chow</option>'+
      '<option value="Clumber_Spaniel">Clumber Spaniel</option>'+
      '<option value="Cocker_Spaniel">Cocker Spaniel</option>'+
      '<option value="Collie">Collie</option>'+
      '<option value="Curly-coated_Retriever">Curly-coated Retriever</option>'+
      '<option value="Dachshund">Dachshund	</option>'+
      '<option value="dalmatian-dogs">Dalmatian	</option>'+
      '<option value="Dandie_Dinmont_Terrier">Dandie Dinmont Terrier</option>'+
      '<option value="doberman-pinscher-dogs">Doberman Pinscher Dogs</option>'+
      '<option value="english-bull-dogs">English Bull Dogs</option>'+
      '<option value="English_Cocker_Spaniel">English Cocker Spaniel</option>'+
      '<option value="English_Foxhound">English Foxhound</option>'+
      '<option value="English_Setter">English Setter</option>'+
      '<option value="English_Springer_Spaniel">	English Springer Spaniel</option>'+
      '<option value="english-toy-spaniels">English Toy Spaniel</option>'+
      '<option value="Field_Spaniel">Field Spaniel</option>'+
      '<option value="finnish-spitz-dog">Finnish Spitz</option>'+
      '<option value="Flat-Coated_Retriever">Flat-Coated Retriever</option>'+
      '<option value="french-bull-dogs">French Bull Dogs</option>'+
      '<option value=" german_shepherd_dog">German Shepherd Dog</option>'+
      '<option value="German_Wirehaired_Pointer">German Wirehaired Pointer</option>'+
      '<option value="Glen_of_Imaal_Terrier">Glen of Imaal Terrier</option>'+
      '<option value=" Gordon_Setter">Gordon Setter</option>'+
      '<option value="Greyhound">Greyhound</option>'+
      '<option value="Harrier">Harrier</option>'+
      '<option value="toydogs-havanese">Havanese </option>'+
      '<option value="herding_group">Herding Dog Breeds</option>'+
      '<option value="Hounds">	Hound Dog Breeds</option>'+
      '<option value="IbizanHound">Ibizan Hound</option>'+
      '<option value="Irish_Setter">Irish Setter</option>'+
      '<option value="Irish_Terrier">Irish Terrier</option>'+
      '<option value="Irish_Water_Spaniel">Irish Water Spaniel</option>'+
      '<option value="Irish_Wolfhound">Irish Wolfhound</option>'+
      '<option value="miniature-italian-greyhound">Italian Greyhound</option>'+
      '<option value="japanese-chin-dog">Japanese Chin</option>'+
      '<option value="Kerry_Blue_Terrier">	Kerry Blue Terrier</option>'+
      '<option value="keeshonds">Keeshonds</option>'+
      '<option value="labrador-retriever">	Labrador Retriever</option>'+
      '<option value="Lakeland_Terrier">Lakeland Terrier</option>'+
      '<option value="landseer-newfoundland">Landseer Newfoundland</option>'+
      '<option value="lhasa-apso-dogs">Lhasa Apso Dogs</option>'+
      '<option value="maltese-dog-breed">Maltese</option>'+
      '<option value="Manchester_Terrier">Manchester Terrier </option>'+
      '<option value="toydogs-ManchesterTerrier">Toy Manchester Terrier</option>'+
      '<option value="Miniature_Bull_Terrier">Miniature Bull Terrier</option>'+
      '<option value="MiniatureDogBreeds">Miniature Dog Breeds</option>'+
      '<option value="toydogs-MiniaturePinscher">Miniature Pinscher</option>'+
      '<option value="Miniature_Schnauzer">Miniature Schnauzer</option>'+
      '<option value="Non-Sporting_Group">non-sporting group</option>'+
      '<option value="Norfolk_Terrier">Norfolk Terrier</option>'+
      '<option value="Norwegian_Elkhound">Norwegian Elkhound</option>'+
      '<option value="Norwich_Terrier">Norwich Terrier</option>'+
      '<option value="Nova_Scotia_Duck_Tolling_Retriever">Nova Scotia Duck Tolling Retriever</option>'+
      '<option value="Old_English_Sheepdog">Old English Sheepdog</option>'+
      '<option value="Otterhound">Otterhound</option>'+
      '<option value="papillon-dog-breed">Papillon </option>'+
      '<option value="Parson_Russell_Terrier">Parson Russell Terrier</option>'+
      '<option value="pekingese-dogs">Pekingese</option>'+
      '<option value="Pembroke_Welsh_Corgi">Pembroke Welsh Corgi</option>'+
      '<option value="Petit-Basset-Griffon-Vendeen">Petit Basset Griffon Vendeen</option>'+
      '<option value="Pharaoh_Hound">Pharaoh Hound</option>'+
      '<option value="polish_lowland_sheepdog">Polish Lowland Sheepdog</option>'+
      '<option value="pomeranian-care">Pomeranian</option>'+
      '<option value="toy-poodle-dog">Poodle</option>'+
      '<option value="pug-dog-breed">Pug</option>'+
      '<option value="Puli">Puli</option>'+
      '<option value="rare-mastiff-dog-breeds">Rare Mastiff Dog Breeds</option>'+
      '<option value="RhodesianRidgeback">Rhodesian Ridgeback</option>'+
      '<option value="rottweiler-dogs">Rottweiler Dogs</option>'+
      '<option value="saint-bernard-dogs">Saint Bernard Dogs</option>'+
      '<option value="Saluki">Saluki</option>'+
      '<option value="Scottish_Deerhound">Scottish Deerhound</option>'+
      '<option value="Scottish_Terrier">Scottish Terrier</option>'+
      '<option value="Sealyham_Terrier">Sealyham Terrier</option>'+
      '<option value="Shetland_Sheepdog">Shetland Sheepdog</option>'+
      '<option value="shih-tzu-dogs">Shih Tzu Dogs</option>'+
      '<option value="toydogs-SilkyTerrier">Silky Terrier</option>'+
      '<option value="Skye_Terrier">Skye Terrier </option>'+
      '<option value="Smooth_Fox_Terrier">Smooth Fox Terrier </option>'+
      '<option value="Soft_Coated_Wheaten_Terrier">Soft Coated Wheaten Terrier </option>'+
      '<option value="Spinone-Italiano">Spinone Italiano </option>'+
      '<option value="sporting_group">Sporting Dog Breeds</option>'+
      '<option value="Staffordshire_Bull_Terrier">Staffordshire Bull Terrier </option>'+
      '<option value="SussexSpaniel">Sussex Spaniel</option>'+
      '<option value="terrier-group">Terrier Dog Breeds</option>'+
      '<option value="MiniatureDogBreeds">Toy Dog Breeds</option>'+
      '<option value="toy-fox-terriers">Toy Fox Terrier</option>'+
      '<option value="Vizsla">Vizsla</option>'+
      '<option value="Weimaraner">Weimaraner</option>'+
      '<option value="Welsh_Springer_Spaniel">Welsh Springer Spaniel</option>'+
      '<option value="Welsh_Terrier">Welsh Terrier </option>'+
      '<option value="West_Highland_White_Terrier">West Highland White Terrier</option>'+
      '<option value="Whippet">Whippet</option>'+
      '<option value="Wire_Fox_Terrier">Wire Fox Terrier</option>'+
      '<option value="wirehaired-pointing-griffon">Wirehaired Pointing Griffon</option>'+
      '<option value="working_dog_group">Working Dog Breeds</option>'+
      '<option value="rare-dog-breeds-Xoloitzcuintle">Xoloitzcuintle</option>'+
      '<option value="miniature-yorkshire-terrier">Yorkshire Terrier</option></select>'+
      '<p class="red2" id="dog_breed'+y+'err"></p></div></div><div class="card crd1"><div class="card-body">'+
      '<p class="card-text">Gender<span class="text-danger">*</span></p><select name="dog_gender" class="custom-select sel1">'+
      '<option selected>Select</option><option value="Male">Male</option><option value="Female">Female</option>'+
      '</select><p class="red2" id="dog_gender'+y+'"></p></div></div><div class="card crd1"><div class="card-body">'+
      '<p class="card-text">Age<span class="text-danger">*</span></p>'+
      '<input type="text" class="form-control sel1 dog_age" name="dog_age" placeholder="Dog Age">'+
      '<p class="red2" id="dog_age'+y+'"></p></div></div></div>'+
      '<div class="card-group cards2"><div class="card crd1 crdleft">'+
      '<div class="card-body"><p class="card-text">About Me<span class="text-danger" >*</span></p>'+
      '<textarea name="dog_info" class="form-control sel1" rows="3" placeholder="Write something about your dog"></textarea>'+
      '<p class="red2" id="dog_info'+y+'"></p></div></div><input type="hidden" name="form0" value="'+y+'"/></div></div></div>');
    }
    if(x >= max_fields){
      document.getElementById('add_another').setAttribute("disabled", "");
    }
  });
  $(wrapper).on("click",".remove_another", function(e){ //user click on remove field
    e.preventDefault();
    var a = $(this).attr('id');
    a = 'x' + a;
    a = document.getElementById(a);
    a.parentNode.removeChild(a);
    //$(a).remove();
    x--;
    //y--;
  });
  var img = $('.fileUpload')
  $(img).on("change",img,function(event){
    //event.preventDefault();

    //var x = a.parentNode.nodeName;
    ////console.log(x);
  });
});
