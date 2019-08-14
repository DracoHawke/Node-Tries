var bcrypt = require('bcryptjs');
var mysql = require('mysql');
const fileUpload = require('express-fileupload');
db_connect = require('./db-connect');
const dogformvalidator = require('./dogformvalidator');

connection = db_connect();

module.exports = function(req, res){
  dog = req.body;
  console.log(req.query.did);
  console.log(dog.did);
  console.log(req.session.currdog);
  if(req.query.did == dog.did && req.query.did == req.session.currdog){
    console.log(dog);
    console.log(req.files)
    var flag = 1;
    var flag2 = 1;
    var length1 = req.files.length;
    var err = "";
    if((dog.fileupload0 == "") && (dog.fileupload1 == "") && (dog.fileupload2 == "") && (dog.fileupload3 == "") && (dog.fileupload4 == "") ){
      flag2 = 0;
    }
    var error1 = dogformvalidator.fval(dog);
    if(error1.success != "Yes"){
      flag2 = 0;
    }
    if(flag2 == 1){
      console.log("flag2 pass");
      var files1 = req.files['fileUpload[0]'];
      var i = 0;
      for (var a in files1) { // iterate in the dog pic array for each dog individually.
        c = 'fileupload'+i;
        i = i + 1;
        console.log("c ", c, "dog[c]: ", dog[c]);
        if(dog[c] != "updated" && files1[a].name==''){
          if(dog[c].charAt(0) == "/"){
            dog[c] = dog[c].substr(1);
          }
          var d = {
            name: dog[c],
            size: 10,
            mimetype: 'image/png',
          }
          console.log("d now is : ", dog[c]);
        }
        else if(dog[c] != "updated" && files1[a].name!=''){
          if(!(files1[a].mimetype == 'image/png' || files1[a].mimetype == 'image/jpg' || files1[a].mimetype == 'image/jpeg')){
            flag = 0;
            err = "Please select valid format files";
            error1.file_err = "file"+(i)+" "+err;
            error1.success = "";
            break;
          }
        }
        if(files1[a].mimetype == 'application/octet-stream'){ // note this is when user has input no file and our module pics up a default value. if true:
          //console.log(files1[a], " files ",files1);
          //delete files1[a];// delete that entry out of our array. note that this will leave an empty element.
          files1[a] = d;
          continue; // start next iteration.
        }// note that the file name and other values are either default / empty value for these feild, so that is why we delete it and start next iteration.
        if(files1[a].name=='') { // check for file name. if true:
          //console.log(files1[a].name);
          err = "Please select valid files"; // set err feild for file.
          flag = 0; // set validation flag to 0.
          error1.file_err = "file"+(i)+" "+err;
          error1.success = "";
        }
        if(files1[a].size> 40000000){
          //console.log(files1[a].size);
          err = 'File Size Must Be Less Than 40MB'; // set err feild for file.
          flag = 0; // set validation flag to 0.
          error1.file_err = "file"+(i)+" "+err;
          error1.success = "";
        }
        if(!(files1[a].mimetype == 'image/png' || files1[a].mimetype == 'image/jpg' || files1[a].mimetype == 'image/jpeg') ){
          //console.log(files1[a].mimetype);
          err = "Please select valid format files"; // set err feild for file.
          flag = 0; // set validation flag to 0.
          error1.file_err = "file"+(i)+" "+err;
          error1.success = "";
        }
      }
      files1 = files1.filter(function () { return true }); // filter out any empty values in our array.
      if(flag == 1){ // check for validation flag. if true:
        b = dog; // take the info for that dog.
        b['files'] = files1; // add new feild 'files' for that dag and assign it the dog pic array of that dog.
        dog = b; // return the updated information to the original array which will now have the dog pic files.
      }
    }
    if(flag2 == 1 && flag == 1){
      var i = 0;
      e = dog['files'];
      var dpic = [];
      console.log(e);
      while(i < e.length){
        c = 'fileupload'+i;
        f = req.session.email +'_'+ i;
        if(e.name) { // check if array or single entry.
          if(dog[c] != "updated") { // check for old/new entry
            if(dog[c] == "") { // check for no entry
              dpic[i] = null;
            }
            else { // if old entry.
              dpic[i] = dog[c];
            }
            i = i + 1;
            continue;
          }
          a = e.mimetype;
        }
        else { // if array entry.
          if(dog[c] != "updated") { // check for old/new entry
            if(dog[c] == "") { // check for no entry
              dpic[i] = null;
            }
            else { // if old entry.
              dpic[i] = dog[c];
            }
            i = i + 1;
            continue;
          }
          a = e[i].mimetype;
        }
        //console.log(a);
        var pos = a.search("/"); // get position of '/' in mimetype of the file.
        var res1 = a.slice(pos+1); // get the extention i.e. the porition after '/' in mimetype, of the file.
        path1 = 'assets/images/'+req.session.uid+'/dog'+dog.dno+'/'+f+'.'+res1; // declare path1 which is put in our db entry of that dog.
        path = 'public/assets/images/'+req.session.uid+'/dog'+dog.dno+'/'+f+'.'+res1; // declare path which is used to move the uploaded pic from temp to correct path.
        if(e.name) {
          e.mv(path, function(err) {
            if(err)
              return res.status(500).send(err);
            console.log("e ", e);
          })
        }
        else {
          e[i].mv(path, function(err) {
            if(err)
              return res.status(500).send(err);
            console.log("e[i] path: ", path);
          })
        }
        dpic[i] = path1; // set path to be used in the query.
        i = i + 1;
      }
      let updatequery = "update ??,?? set DogName = ?, DogBreed = ?, DogGender = ?, DogAge = ?, Description = ?, DogPic1 = ?, DogPic2 = ?, DogPic3 = ?, DogPic4 = ?, DogPic5 = ? where ??.`Uid` = ??.`Uid` and ??.`Did` = ? and ??.`email` = "+mysql.escape(req.session.email);
      let query = mysql.format(updatequery,["dogs","users",dog.dog_name,dog.dog_breed,dog.dog_gender,dog.dog_age,dog.dog_info, dpic[0], dpic[1], dpic[2], dpic[3], dpic[4], `users`,`dogs`,`dogs`,dog.did,`users`]);
      //console.log(query);
      connection.query(query,(err, response) => {
        console.log(query);
        if(err) {
          console.error(err);
          flags = 4060; // server database connectivity error;
        }
        else{
          console.log('data entered'); // updated user's dog.
          res.redirect("/dashboard/myacc");
        }
      });
    }
    else if(flag2 == 0 || flag == 0){
      console.log("errors?", error1);
      error1 = JSON.stringify(error1);
      query1 = "?did="+dog.did+"&dno="+dog.dno;
      res.redirect("/dogdetails/"+error1+query1);
    }
  }
  else {
    console.log("Changing data?");
    res.redirect("/dashboard/myacc");
  }
}
