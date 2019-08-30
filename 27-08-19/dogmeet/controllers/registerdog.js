dformvalidator = require('./dformvalidator');
dogformvalidator = require('./dogformvalidator');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var db_connect = require('./db-connect');
nodincrement = require('./nodincrement');

var connection=db_connect();

module.exports=function(req,res){

  // function when a user enters information into the dog form and passes js validation

    var nod = {};
    var nod2 = {};
    var flag = 1; // flag for error management.
    var it = 0;
    var b = "form"+it;
    var data_err = {};
    console.log(req.body);
    for(var a in req.body){ // seperating information as required (dogs,user)
      nod2[a] = req.body[a];
      if(a == b){
        nod[it] = nod2;
        nod2 = {};
        it = it + 1;
        b = "form"+it;
      }
    }
    console.log(nod2);
    nod[it] = nod2; // adding user information as last index for variable nod.
    dog = {};
    nods = {};
    var c = nod[0];
    var d = c['dog_name'];
    var len = c['dog_name'].length;
    if(typeof(d) == "string"){ // check if user has input one dog's info or multiple if:single
      len = 1;
      d = 0;
      dog = nod;
    }
    else{ // else: multiple
      d = 0;
      while(d < len){
    // iterate according to number of entries of dogs.
        for(var a in c){
    // iterate using values of dog[0] i.e. dog entries.
          e = c[a];
          if(a == "dog_age"){
      // check if entry is of dog age, if true: convert the value to Number
            e[d] = Number(e[d]);
          }
          nods[a] = e[d];
      // set the value of input feild for each dog.
        }
        dog[d] = nods;
    // set all the information of each dog seperatelly.
        nods = {};
        d = d + 1;
      }
      dog[d]= nod[1];
    }
    nod2 = 0;
    var err = ""; // initial value for the final errors.
    while(nod2 < len){ // validate the dog information.
      data_err[nod2] = dogformvalidator.fval(dog[nod2]);
      c = data_err[nod2];
      if(c['success'] != "Yes"){ // function returns yes feild for success when passes the validation. Therefore if true:
        err = err +"Dog"+ (nod2+1) + ". "; // enter the dog number for which any error may have risen.
        for(i in c){ // iterate through errors
          if(i == "success"){ // skip success feild.
            continue;
          }
          console.log(i);
          err = err + c[i] + ","; // enter the errors returned from the function into err
        }
        flag = 0; // set validation flag to 0.
      }
      nod2 = nod2 + 1; // increment for next dog.
    }
    //console.log(nod2);console.log(flag);
    data_err[nod2] = dformvalidator.fval(dog[nod2]); // function that returns any errors that may have risen for user information (dog[nod2] (final value)).
    c = data_err[nod2];
    //console.log(dog[nod2]);
    if(c['success'] != "Yes"){ // check if we return yes value for success feild. if not(false):
      err = err + "User: "; // set user in err feild for clarification.
      for(i in c){ // iterate in the error feilds.
        if(i == "success"){ // checking if feild is success . if true:
          continue; // skip.
        }
        //console.log(i);
        err = err + c[i] + ","; // add errors that may have returned from the function into var err.
      }
      flag = 0; // set validation flag to 0.
    }
    //console.log(res);
    //console.log(err);
    var pics = req.body.dogpic;  // start validation for files intput by user. get the hidden feilds of dogpic values which contain an array/string depending on number of enteries of dogs. value in this is equal to the number of pictures input by the user for his/her dog.
    var length1 = pics.length; // get the number of entries of dog pics.
    //console.log(pics);console.log(length1);
    var i = 0;
    var flags2 = 0; // flag validator for number of pics for each dog.
    while(i < length1){ // iterate for pics of diff dogs.
      //console.log(pics[i]);
      if(pics[i] <= '0' && flags2 == 0){ // check if number of pic added for each dog is atleast 1 and flags2 is still zero. if true:
        err = err + "You require atleast 1 picture of your dog/s"; // set error for dog pic.
        flags2 = 1; // set dog pic validation flag to 1.
        flag = 0; // set validation flag to 0.
      }
      i = i + 1;
    }
    if(flags2 == 0){ // if user input atleast one pic for their dog.
      for(i = 0; i < length1; i++){ // iterate for the all dog pictures array/object.
        var files1 = req.files['fileUpload['+i+']']; // get dog pic entries for each dogg seperatelly.
        //console.log(files1);
        for (var a in files1) { // iterate in the dog pic array for each dog individually.
          if(files1[a].mimetype == 'application/octet-stream'){ // note this is when user has input no file and our module pics up a default value. if true:
            //console.log(files1[a]);console.log(files1);
            delete files1[a]; // delete that entry out of our array. note that this will leave an empty element.
            continue; // start next iteration.
          }// note that the file name and other values are either default / empty value for these feild, so that is why we delete it and start next iteration.
          if(files1[a].name=='') { // check for file name. if true:
            //console.log(files1[a].name);
            err = "Please select valid files"; // set err feild for file.
            flag = 0; // set validation flag to 0.
          }
          if(files1[a].size> 40000000){
            //console.log(files1[a].size);
            err='File Size Must Be Less Than 40MB'; // set err feild for file.
            flag = 0; // set validation flag to 0.
          }
          if(!(files1[a].mimetype == 'image/png' || files1[a].mimetype == 'image/jpg' || files1[a].mimetype == 'image/jpeg') ){
            //console.log(files1[a].mimetype);
            err = "Please select valid format files"; // set err feild for file.
            flag = 0; // set validation flag to 0.
          }
        }
        files1 = files1.filter(function () { return true }); // filter out any empty values in our array.
        //console.log(files1);
        if(flag == 1){ // check for validation flag. if true:
          b = dog[i]; // take the info for that dog.
          b['files'] = files1; // add new feild 'files' for that dag and assign it the dog pic array of that dog.
          dog[i] = b; // return the updated information to the original array which will now have the dog pic files.
        }
      }
    }
    //console.log(res);console.log(err);console.log(flag);
    var flags = 0; // set input validation flag.
    if(flag == 1){ // check for validation flag. if true:
      var c = dog[nod2]; // let c hold the user information object.
      connection.query('SELECT users.No_of_Dogs, users.Uid, users.Fname, users.status, users.U_password from users where users.Email = "' + c.u_email +'"', function(err, rows, fields) {
        //above, connect to db and extract rows accordng the user email input feild.
        //console.log("i'm in");console.log(res);
        if(rows.length > 0){ // if any rows returned. if true(user already registered):
          if(rows[0].status == 0){ // check the status value of that user.(0 -> not verified, 1-> verified). if true:
            flags = 300; // user not authenticated;
            res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status,sid:'', did: '',login:req.session});
          }
          else if(c.logedin == '1'){ // check if user is logged in from hidden element in the form.
            if(bcrypt.compareSync(c.u_pass, rows[0].U_password.toString())){ // check if user input correct password.
              //console.log("successful1");
              req.session.nod = rows[0].No_of_Dogs;
              req.session.uid = rows[0].Uid; // set seesion uid for current user.
              flags = 1; // user logged in and password correct.
            }
            else{
              console.log(c.u_pass);
              console.log(rows[0].U_password);
              flags = 2; // user logged in but password wrong.
              //console.log("wrong pass");
              res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"}, sid: req.session.sid, did: req.session.did, status: req.session.status,set: "",login:req.session});
            }
          }
          else if(c.logedin == '0' || flags == 1){ // we check if user is successfully loged in / not logged in to see if user has any dogs listed.
            //connection.query("SELECT users.Uid, users.Lname, users.status, sitters.Sid, dogs.Did, users.U_password FROM users LEFT JOIN dogs ON dogs.Uid = users.Uid LEFT JOIN sitters ON sitters.Uid = users.Uid WHERE users.Email='"+mysql.escape(c.u_email)+"'", function(err,rows2,feilds) {
            //if(err) {
            console.error(err);
            flags = 4060; // server database connectivity error.
            //}
            if(rows[0].No_of_Dogs == 0){
              if(bcrypt.compareSync(c.u_pass, rows[0].U_password.toString())) {
                req.session.email = c.u_email;
                req.session.uname = c.u_fname;
                req.session.uid = rows[0].Uid;
                req.session.status = rows[0].status;
                req.session.nod = 0;
                req.session.did = 0;
                flags == 10; // user exists but not loged in and currently has no dogs listed.
              }
              else{
                res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"},sid: req.session.sid, status:req.session.status,did: req.session.did, set:"",login:req.session});
                // user not logged in but input the wrong password while trying to register as sitter.
              }
            }
            else if(rows[0].No_of_Dogs > 0){
              if(bcrypt.compareSync(c.u_pass, rows[0].U_password.toString())) {
                req.session.email = c.u_email;
                req.session.uname = c.u_fname;
                req.session.uid = rows[0].Uid;
                req.session.status = rows[0].status;
                req.session.nod = rows[0].No_of_Dogs;
                req.session.did = 1;
                flags == 20; // user exists but not loged in and currently has one or more dogs listed.
              }
              else{
                res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"}, sid: req.session.sid, did: req.session.did, status: req.session.status,set:"",login:req.session});
                //user not logged in but input the wrong password while trying to register a dog.
              }
            }
          }
          else {
            console.log('hacker');
          }
          if(flags == 1 || flags == 10 || flags == 20){
            var i = 0;
            console.log('dog');
            console.log(nod2);
            while(i < nod2) {
              if(req.session.nod){
                j = req.session.nod;
              }
              else {
                j = i;
              }
              console.log("dogs1");
              d = dog[i];
              e = d['files'];
              console.log(d);
              console.log("c ", c);
              console.log(e);
              if(e.name){
                console.log("yess");
                l = 1;
              }
              else{
                l = e.length;
                console.log(l);
              }
              console.log(l);
              g = 0;
              dpic=[];
              while(g < 5){
                if(g < l){
                  f = req.session.email +'_'+ g;
                  if(e.name){
                    a = e.mimetype;
                  }
                  else{
                    a = e[g].mimetype;
                  }
                  console.log(a);
                  var pos = a.search("/");
                  var res1 = a.slice(pos+1);
                  path1 = 'assets/images/'+req.session.uid+'/dog'+j+'/'+f+'.'+res1;
                  path = 'public/assets/images/'+req.session.uid+'/dog'+j+'/'+f+'.'+res1;
                  if(e.name){
                    e.mv(path, function(err) {
                      if(err)
                        return res.status(500).send(err);
                    })
                  }
                  else{
                    e[g].mv(path, function(err) {
                      if(err)
                        return res.status(500).send(err);
                    })
                  }
                  dpic[g] = path1;
                }
                else{
                  //dpic[g] = ;
                }
                g = g + 1;
              }
              let insertQuery = 'INSERT INTO ??(Uid,DogName,DogBreed,DogGender,DogAge,Description,Address,City,State,ZIP,DogPic1,DogPic2,DogPic3,DogPic4,DogPic5) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                                //"INSERT INTO `dogs` VALUES (75,'eleventh','Nova_Scotia_Duck_Tolling_Retriever','Male',4.9,'eleventh dog','PO Box 35286, fdgbdf',NULL,'Badjerribong', 'New South Wales','200','assets/images/75/dog10/rohangaur073@gmail.com_0.png','assets/images/75/dog10/rohangaur073@gmail.com_1.png',NULL,NULL,NULL)"
              let query = mysql.format(insertQuery,["dogs",req.session.uid,d.dog_name,d.dog_breed,d.dog_gender,d.dog_age,d.dog_info,c.u_add,c.u_city,c.u_state,c.u_zip,dpic[0],dpic[1],dpic[2],dpic[3],dpic[4]]);
              connection.query(query,(err, response) => {
                console.log(query);
                if(err) {
                  console.error(err);
                  flags = 4060; // server database connectivity error;
                }
                else{
                  nodincrement(req,res);
                  console.log('data entered'); // entered user'd dog.
                }
              });
              req.session.nod = req.session.nod + 1;
              console.log("no of dogs new = ", req.session.nod);
              i = i + 1;
            }
            if(req.session.status != 0){
              req.session.did=1;
              res.redirect('/');
            }
            else{
              res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did,login:req.session});
            }
          }
          else{
            console.log(flags);
            console.log("ouch");
          }
        }
        else if(rows.length == 0){
          console.log('newest');
          let insertQuery = 'INSERT INTO ??(Fname,Lname,Email,U_password,Phone,Profile,status,No_of_Dogs) VALUES (?,?,?,?,?,?,?,?)';
          let query = mysql.format(insertQuery,["users",c.u_fname,c.u_lname,c.u_email,c.u_pass,c.u_phone,'users/default.png',0,nod2]);
          connection.query(query,(err, response) => {
              if(err) {
                  console.error(err);
                  flags = 4060; // server database connectivity error;
              }
              else{
                flags = 3; // new user successfully enteres
                req.session.email = c.u_email;
                req.session.uname = c.u_fname;
                req.session.status = 0;
                req.session.sid = 0;
                req.session.did = 0;
                console.log('get uid');
                connection.query('select users.Uid from users where users.Email = "'+c.u_email+'"',function(err,rows3,feilds){
                  if(err){
                    console.error(err);
                    flags = 4060; // server database error;
                  }
                  else{
                    req.session.uid = rows3[0].Uid;
                    console.log('uid');
                  }
                  console.log(flags);
                  if(flags == 1 || flags == 3 || flags == 10){
                    var i = 0;
                    console.log('dog');
                    console.log(nod2);
                    console.log(dog);
                    var dpic = [];
                    while(i < nod2) {
                      console.log("dogs1");
                      d = dog[i];
                      e = d['files'];
                      console.log(d);
                      console.log(e);
                      if(e.name){
                        console.log("yess");
                        l = 1;
                      }
                      else{
                        l = e.length;
                        console.log(l);
                      }
                      console.log(l);
                      g = 0;
                      dpic=[];
                      while(g < 5){
                        if(g < l){
                          f = req.session.email +'_'+ g;
                          if(e.name){
                            a = e.mimetype;
                          }
                          else{
                            a = e[g].mimetype;
                          }
                          console.log(a);
                          var pos = a.search("/");
                          var res1 = a.slice(pos+1);
                          path1 = 'assets/images/'+req.session.uid+'/dog'+i+'/'+f+'.'+res1;
                          path = 'public/assets/images/'+req.session.uid+'/dog'+i+'/'+f+'.'+res1;
                          if(e.name){
                            e.mv(path, function(err) {
                              if(err)
                                return res.status(500).send(err);
                            })
                          }
                          else{
                            e[g].mv(path, function(err) {
                              if(err)
                                return res.status(500).send(err);
                            })
                          }
                          dpic[g] = path1;
                        }
                        else{
                          //dpic[g] = ;
                        }
                        g = g + 1;
                      }
                      console.log(dpic);
                      let insertQuery = 'INSERT INTO ??(Uid,DogName,DogBreed,DogGender,DogAge,Description,Address,City,State,ZIP,DogPic1,DogPic2,DogPic3,DogPic4,DogPic5) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                      let query = mysql.format(insertQuery,["dogs",req.session.uid,d.dog_name,d.dog_breed,d.dog_gender,d.dog_age,d.dog_info,c.u_add,c.u_city,c.u_state,c.u_zip,dpic[0],dpic[1],dpic[2],dpic[3],dpic[4]]);
                      connection.query(query,(err, response) => {
                        if(err) {
                          console.error(err);
                          flags = 4060; // server database connectivity error;
                        }
                        else{
                          req.session.nod = nod2;
                          console.log('data entered');
                        }
                      });
                      console.log('aaaaaaa');
                      i = i + 1;
                    }
                    if(req.session.status == 0){
                      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did,login:req.session});
                    }
                    else if(req.session.status == 1) {
                    }
                    req.session.did=1;
                    res.redirect('/');
                  }
                })
                console.log("successful");
              }
            });
          }
        });
      }
    //console.log("out");
    //console.log('didnt get in');
    console.log(err);
    if(err != ""){
      res.render('registerdog', {uname: " ",body: req.body, data: {error: err}, set:"", sid: req.session.sid, did: req.session.did ,login:req.session});
    }
}
