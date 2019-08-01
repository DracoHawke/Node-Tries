var express = require('express');
var url = require('url');
var bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const formidable = require('formidable');
var db_connect = require('./public/assets/javascript/controllers/db-connect');
var formvalidator = require('./public/assets/javascript/controllers/formvalidator');
var dformvalidator = require('./public/assets/javascript/controllers/dformvalidator');
var dogformvalidator = require('./public/assets/javascript/controllers/dogformvalidator');
var checkval = require('./public/assets/javascript/controllers/checkval');
confirmation = require('./public/assets/javascript/controllers/confirmation');
sitter = require('./public/assets/javascript/controllers/sittersignup');
sittervalid = require('./public/assets/javascript/controllers/sittervalid');
fileval = require('./public/assets/javascript/controllers/fileval');
insert_db = require('./public/assets/javascript/controllers/insert_db');
login = require('./public/assets/javascript/controllers/login');
dashboard = require('./public/assets/javascript/controllers/dashboard');
update_form = require('./public/assets/javascript/controllers/update_form');
findsitter = require('./public/assets/javascript/controllers/findsitters');
sitterdetails = require('./public/assets/javascript/controllers/sitterdetails');
findmate = require('./public/assets/javascript/controllers/findmate');
matedetails = require('./public/assets/javascript/controllers/matedetails');
mydogs = require('./public/assets/javascript/controllers/mydogs');

var app = express();

app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: "/public/assets/temp"
}));

var urlencodedParser=bodyparser.urlencoded({extended:false});
var connection = db_connect();
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'dogmate',
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 60000,
    // The maximum age of a valid session; milliseconds:
    expiration: 600000,
};

var sessionStore = new MySQLStore(options);
app.use(session({
    //cookie: {maxAge: 60000},
    key: 'key1',
    secret: '566b0505a274977df423ff34031fdeb3722d480c01ab74702448927cd65854e3',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: 'id'
}));

//connection.connect();
app.use(express.static('./public'))
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get('/',urlencodedParser,function(req,res) {
  console.log("ok");
  if(req.session.uname){
    if(req.session.sid){
      var sid = req.session.sid;
    }
    else{
      sid="0";
    }
    if(req.session.did){
      var did = req.session.did;
    }
    else{
      var did = "0";
    }
    res.render('index', {uname: req.session.uname, status: req.session.status, sid: sid, did: did});
  }
  else{
    res.render('index', {uname: " ",status: "", sid: "0", did: "0"});
  }
});

app.get('/pricing/:id',urlencodedParser,function(req,res){
  console.log("i'm in");
  var id = req.params.id;
  if (Number(id)==0){
    var email = req.query.email;
    var password = req.query.password;
    connection.query('SELECT users.status, users.Fname, dogs.Did, sitters.Sid, users.U_password FROM users LEFT JOIN dogs ON dogs.Uid = users.Uid LEFT JOIN sitters ON sitters.Uid = users.Uid where users.Email = "' + email +'"', function(err, rows, fields) {
      if (!err){
        var error = 0;
        if(rows.length > 0){
          if(bcrypt.compareSync(password, rows[0].U_password.toString())) {
            req.session.email = email;
            req.session.uname =rows[0].Fname;
            req.session.status = rows[0].status;
            var a = rows.length;
            var i = 0;
            var flag1 = 0;
            var flag2 = 0;
            while(i < a){
              if(rows[i].Sid != null){
                req.session.sid = 1;
                flag1 = 1;
                console.log(rows[i].Sid);
              }
              if(rows[i].Did != null){
                req.session.did = 1;
                flag2 = 1;
                console.log(rows[i].Did);
              }
              if(flag1 == 1 && flag2 == 1){
                break;
              }
              i = i + 1;
            }
          }
          else{
            error= 1;
          }
        }
        else{
          error = 1;
        }
        if(error == 0){
          res.send('Yes');
        }
        else{
          res.send('Wrong Email/Password');
        }
      }
      else{
        console.log('Error while performing Query.');
        console.log(err);
      }
    });
  }
});

app.get('/logout',urlencodedParser,function(req,res){
  req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

app.get('/registeration',urlencodedParser,function(req,res){
  if(req.session.uname)
    res.redirect('/');
  else{
    var uname=' ';
    var sid='';
    var did = '';
    console.log(req.query);
    res.render('registeration',{data:req.query,uname:uname,sid:sid,did: did,status: ''});
  }
})

app.post('/registeration',function(req,res){
  //console.log(req);
    console.log(req.files);
    console.log(req.body);
    if(req.session.uname)
      res.redirect('/');
    else{
      var uname='';
      var sid='';
      var did = '';
    }
    var data_err=formvalidator.fval(req.body);
    data_err=fileval(req.files,data_err);
    console.log(data_err);
    if(data_err.success==''){
      res.render('registeration',{data: data_err,uname: uname,sid: sid, did: did, status: ''});
    }
    else {
      req.body.pack='none';
      var uid='';
       insert_db(req,res);
      //res.end();
    }
  });
//});

app.get('/registerdog',urlencodedParser,function(req,res){
  if(req.session.uname){
    if(req.session.sid){
      var sid = req.session.sid;
    }
    else{
      sid="0";
    }
    if(req.session.did){
      var did = req.session.did;
    }
    else{
      var did = "0";
    }
    res.render('registerdog', {uname : req.session.uname, sid: sid, did: did, status: req.session.status, data: {
        Email: req.session.email
      }
    });
  }
  else{
    res.render('registerdog', {uname: " ",data: "", status: '', sid: "", did: ''});
  }
})

app.post('/registerdog',function(req,res){ // function when a user enters information into the dog form and passes js validation
  //console.log(res);console.log(req);console.log('yes2');console.log(req.body);console.log(req.files);
  var nod = {};
  var nod2 = {};
  var flag = 1; // flag for error management.
  var it = 0;
  var b = "form"+it;
  var data_err = {};
  for(var a in req.body){ // seperating information as required (dogs,user)
    nod2[a] = req.body[a];
    if(a == b){
      nod[it] = nod2;
      nod2 = {};
      it = it + 1;
      b = "form"+it;
    }
  }
  nod[it] = nod2; // adding user information as last index for variable nod.
  //console.log(nod);console.log(it);
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
    //console.log(len);
    while(d < len){ // iterate according to number of entries of dogs.
      for(var a in c){ // iterate using values of dog[0] i.e. dog entries.
        e = c[a];
        //console.log(e);
        if(a == "dog_age"){ // check if entry is of dog age, if true: convert the value to Number
          e[d] = Number(e[d]);
          //console.log(e[d]);
        }
        nods[a] = e[d]; // set the value of input feild for each dog.
      }
      dog[d] = nods; // set all the information of each dog seperatelly.
      nods = {};
      //console.log('increment');
      d = d + 1;
    }
    dog[d]= nod[1];
  }
  nod2 = 0;
  //console.log(dog);console.log(d);console.log(res);
  var err = ""; // initial value for the final errors.
  while(nod2 < len){ // validate the dog information.
    data_err[nod2]=dogformvalidator.fval(dog[nod2]);
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
    err = err +"User: "; // set user in err feild for clarification.
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
    connection.query('SELECT users.Uid,users.Fname,users.status,users.U_password from users where users.Email = "' + c.u_email +'"', function(err, rows, fields) {
      //above, connect to db and extract rows accordng the user email input feild.
      //console.log("i'm in");console.log(res);
      if(rows.length > 0){ // if any rows returned. if true(user already registered):
        if(rows[0].status == 0){ // check the status value of that user.(0 -> not verified, 1-> verified). if true:
          flags = 300; // user not authenticated;
          res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status});
        }
        else if(c.logedin == '1'){ // check if user is logged in from hidden element in the form.
          if(c.u_pass == rows[0].U_password){ // check if user input correct password.
            //console.log("successful1");
            req.session.uid = rows[0].Uid; // set seesion uid for current user.
            flags = 1; // user logged in and password correct.
          }
          else{
            flags = 2; // user logged in but password wrong.
            //console.log("wrong pass");
            res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"}, sid: req.session.sid, did: req.session.did, status: req.session.status});
          }
        }
        else if(c.logedin == '0' || flags == 1){ // we check if user is successfully loged in / not logged in to see if user has any dogs listed.
          connection.query("SELECT users.Uid, users.status, sitters.Sid, dogs.Did, users.U_password FROM users LEFT JOIN dogs ON dogs.Uid = users.Uid LEFT JOIN sitters ON sitters.Uid = users.Uid WHERE users.Email='"+mysql.escape(c.u_email)+"'", function(err,rows2,feilds) {
            if(err) {
              console.error(err);
              flags = 4060; // server database connectivity error.
            }
            else if(rows.length == 0){
              if(c.u_pass == rows[0].U_password){
                req.session.email = c.u_email;
                req.session.uname = c.u_fname;
                req.session.uid = rows[0].Uid;
                req.session.status = rows[0].status;
                req.session.did = 0;
                flags == 10; // user exists but not loged in and currently has no dogs listed.
              }
              else{
                res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"}, status:req.session.status,did: req.session.did});
                // user not logged in but input the wrong password while trying to register as sitter.
              }
            }
            else if(rows.length > 0){
              if(c.u_pass == rows2[0].U_password){
                req.session.email = c.u_email;
                req.session.uname = c.u_fname;
                req.session.uid = rows2[0].Uid;
                req.session.status = rows2[0].status;
                var a = rows.length;
                var i = 0;
                var flag1 = 0;
                var flag2 = 0;
                while(i < a){
                  if(rows[i].Sid != null){
                    req.session.sid = 1;
                    flag1 = 1;
                    console.log(rows[i].Sid);
                  }
                  if(rows[i].Did != null){
                    req.session.did = 1;
                    flag2 = 1;
                    console.log(rows[i].Did);
                  }
                  if(flag1 == 1 && flag2 == 1){
                    break;
                  }
                  i = i + 1;
                }
                if(flag2 == 1){
                  flags == 20; // user exists but not loged in and currently has one or more dogs listed.
                }
                else{
                  flags == 10; // user exists but not loged in and currently has no dogs listed.
                }
              }
              else{
                res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"}, sid: req.session.sid, did: req.session.did, status: req.session.status});
                //user not logged in but input the wrong password while trying to register as sitter.
              }
            }
          });
        }
        else {
            console.log('hacker');
        }
        if(flags == 1 || flags == 10 || flags == 20){
          var i = 0;
          console.log('dog');
          console.log(nod2);
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
                path = 'assets/images/'+req.session.uid+'/dog'+i+'/'+f+'.'+res1;
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
                dpic[g] = path;
              }
              else{
                //dpic[g] = ;
              }
              g = g + 1;
            }
            let insertQuery = 'INSERT INTO ??(Uid,DogName,DogBreed,DogGender,DogAge,Description,Address,City,State,ZIP,DogPic1,DogPic2,DogPic3,DogPic4,DogPic5) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            let query = mysql.format(insertQuery,["dogs",req.session.uid,d.dog_name,d.dog_breed,d.dog_gender,d.dog_age,d.dog_info,c.u_add,c.u_city,c.u_state,c.u_zip,dpic[0],dpic[1],dpic[2],dpic[3],dpic[4]]);
            connection.query(query,(err, response) => {
              if(err) {
                console.error(err);
                flags = 4060; // server database connectivity error;
              }
              else{
                console.log('data entered'); // entered user'd dog.
              }
            });
            i = i + 1;
          }
          if(req.session.status != 0){
            res.render('success',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did});
          }
          else{
            res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did});
          }
        }
        else{
          console.log("ouch");
        }
      }
      else if(rows.length == 0){
        console.log('newest');
        let insertQuery = 'INSERT INTO ??(Fname,Lname,Email,U_password,Phone,Profile,status) VALUES (?,?,?,?,?,?,?)';
        let query = mysql.format(insertQuery,["users",c.u_fname,c.u_lname,c.u_email,c.u_pass,c.u_phone,'users/default.png',0]);
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
                        path = 'assets/images/'+req.session.uid+'/dog'+i+'/'+f+'.'+res1;
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
                        dpic[g] = path;
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
                        console.log('data entered');
                      }
                    });
                    console.log('aaaaaaa');
                    i = i + 1;
                  }
                  if(req.session.status == 0){
                    res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did});
                  }
                  else if(req.session.status == 1) {
                    res.render('success',{uname: req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did});
                  }
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
    res.render('registerdog', {uname: " ",body: req.body, data: {error: err}});
  }
});

app.get('/registersitter',urlencodedParser,function(req,res){
  sitter(res,req);
})

app.post('/registersitter',function(req,res){
  sittervalid(req,res);
});

app.get('/findsitter',function(req,res){
  findsitter(req,res);
});

app.get('/sitterdetails',function(req,res){
  sitterdetails(req,res);
})

app.get('/findmate',function(req,res){
  findmate(req,res);
});

app.get('/matedetails',function(req,res){
  matedetails(req,res);
})

//dashboard
app.get('/dashboard',function(req,res){
  var error1={};
  dashboard(req,res,error1);
});

app.post('/dashboard',function(req,res){
  var error1={};
  dashboard(req,res,error1);
});

app.get('/myacc',function(req,res){
  console.log(req.url);
  res.redirect('/dashboard');
});

app.post('/myacc',function(req,res){
  update_form(req,res);
});

app.get('/chat',function(req,res){
  console.log(req.url);
  res.render('chat');
});

app.get('/settings',function(req,res){
  console.log(req.url);
  res.render('settings');
});

app.get('/mydogs',function(req,res){
  console.log(req.url);
  var error1 = {};
  mydogs(req,res,error1);
});

app.listen(3000);
console.log('listening on port 3000...');
