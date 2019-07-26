var express = require('express');
var url = require('url');
var formvalidator = require('./assets/javascript/formvalidator');
var dogformvalidator = require('./assets/javascript/dogformvalidator');
var checkval = require('./assets/javascript/checkval');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
app.use(bodyparser());
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'dogmate'
});
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
connection.connect();
app.use(express.static('./assets'))
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
Object.defineProperty(global, '__line', {
    get: function(){
        return ((new Error()).stack.split("\n")[2].trim().replace(/^(at\s?)(.*)/gim, "$2 >").replace(__dirname, ""))
    }
})
function render1(req,res,err){
  if(err == "an"){
    res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status});
    res.end();
  }
}
app.get('/',function(req,res) {
  console.log("ok");
  if(req.session.uname){
    res.render('index', {uname: req.session.uname, status: req.session.status});
  }
  else{
    res.render('index', {uname: " ",status: ""});
  }
});

app.get('/pricing',function(req,res){
  if(req.session.uname){
    console.log("im in 1");
    res.render('pricing', {
      uname: req.session.uname,
      status: req.session.status
    });
  }
  else{
    res.render('pricing', {uname:" ", status: req.session.status});
  }
});

app.get('/pricing/:id',function(req,res){
  console.log("i'm in");
  var id = req.params.id;
  if (Number(id)==0){
    var email = req.query.email;
    var password = req.query.password;
    connection.query('SELECT users.U_password,users.Name,users.status from users where users.Email = "' + email +'"', function(err, rows, fields) {
      if (!err){
        var error = 0;
        if(rows.length == 1){
          if(String(rows[0].U_password) == String(password)){
            req.session.email = email;
            req.session.uname =rows[0].Name;
            req.session.status = rows[0].status;
          console.log()
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

app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

app.get('/registerdog',function(req,res){
  if(req.session.uname){
    res.render('registerdog', {uname : req.session.uname, data: {
        Email: req.session.email
      }
    });
  }
  else{
    res.render('registerdog', {uname: " ",data: "", status: req.session.status});
  }
})

app.post('/registerdog',function(req,res){
  console.log(req.body);
  var nod = {};
  var nod2 = {};
  var flag = 1;
  var it = 0;
  var b = "form"+it;
  var data_err = {};
  for(var a in req.body){
    nod2[a] = req.body[a];
    if(a == b){
      nod[it] = nod2;
      nod2 = {};
      it = it + 1;
      b = "form"+it;
    }
  }
  nod[it] = nod2;
  console.log(nod);
  console.log(it);
  dog = {};
  nods = {};
  var c = nod[0];
  var d = c['dog_name'];
  var len = c['dog_name'].length;
  if(typeof(d) == "string"){
    len = 1;
    d = 0;
    dog = nod;
  }
  else{
    d = 0;
    console.log(len);
    while(d < len){
      for(var a in c){
        e = c[a];
        console.log(e);
        if(a == "dog_age"){
          e[d] = Number(e[d]);
          console.log(e[d]);
        }
        nods[a] = e[d];
      }
      dog[d] = nods;
      nods = {};
      console.log('increment');
      d = d + 1;
    }
    dog[d]= nod[1];
  }
  nod2 = 0;
  console.log(dog);
  console.log(d);
  var err = "";
  while(nod2 < len){
    data_err[nod2]=dogformvalidator.fval(dog[nod2]);
    c = data_err[nod2];
    if(c['success'] != "Yes"){
      err = err +"Dog"+ (nod2+1) + ". ";
      for(i in c){
        if(i == "success"){
          continue;
        }
        console.log(i);
        err = err + c[i] + ",";
      }
      flag = 0;
    }
    nod2 = nod2 + 1;
  }
  console.log(nod2);
  console.log(flag);
  data_err[nod2] = formvalidator.fval(dog[nod2]);
  c = data_err[nod2];
  console.log(dog[nod2]);
  if(c['success'] != "Yes"){
    err = err +"User: ";
    for(i in c){
      if(i == "success"){
        continue;
      }
      console.log(i);
      err = err + c[i] + ",";
    }
    flag = 0;
  }
  if(err == '\n'){
    console.log("baaaaaa");
    err = "";
  }
  console.log(err);
  var flags = 0;
  if(flag == 1){
    var c = dog[nod2];
    connection.query('SELECT users.Uid,users.Name,users.status,users.U_password from users where users.Email = "' + c.u_email +'"', function(err, rows, fields) {
      console.log("i'm in");
      if(rows.length > 0){
        if(rows[0].status == 0){
          flags = 300; // user not authenticated;
          res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status});
        }
        else if(c.logedin == '1'){
          if(c.u_pass == rows[0].U_password){
            console.log("successful1");
            req.session.uid = rows[0].Uid;
            flags = 1; // user logged in and password correct
          }
          else{
            flags = 2; // user logged in but password wrong
            console.log("wrong pass");
            res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"}});
          }
        }
        else if(c.logedin == '0' || flags == 1){ // we check if user is successfully loged in / not logged in to see if user has any dogs listed.
          connection.query("SELECT users.Uid,users.status,users.U_password FROM users LEFT JOIN dogs ON dogs.Uid = users.Uid WHERE users.Email='"+mysql.escape(c.u_email)+"'", function(err,rows2,feilds) {
            if(err) {
              console.error(err);
              flags = 4060; // server database connectivity error.
            }
            else if(rows.length == 0){
              if(c.u_pass == rows[0].U_password){
                req.session.email = c.u_email;
                req.session.uname = c.u_name;
                req.session.uid = rows[0].Uid;
                req.session.status = rows[0].status;
                flags == 10; // user exists but not loged in and currently has no dogs listed.
              }
              else{
                res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"}});
                // user not logged in but input the wrong password while trying to register as sitter.
              }
            }
            else if(rows.length > 0){
              if(c.u_pass == rows2[0].U_password){
                req.session.email = c.u_email;
                req.session.uname = c.u_name;
                req.session.uid = rows2[0].Uid;
                req.session.status = rows2[0].status;
                flags == 20; // user exists but not loged in and currently has one or more dogs listed.
              }
              else{
                res.render('registerdog',{uname : req.session.uname, data: {error1: "Wrong Password"}});
                // user not logged in but input the wrong password while trying to register as sitter.
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
            console.log("dogs");
            d = dog[i];
            let insertQuery = 'INSERT INTO ??(Uid,DogName,DogBreed,DogGender,DogAge,Description,Address,City,State,ZIP) VALUES (?,?,?,?,?,?,?,?,?,?)';
            let query = mysql.format(insertQuery,["dogs",req.session.uid,d.dog_name,d.dog_breed,d.dog_gender,d.dog_age,d.dog_info,c.u_add,c.u_city,c.u_state,c.u_zip]);
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
          if(req.session.status == 0){
            res.render('success',{uname : req.session.uname, data: "", status: req.session.status});
          }
          else{
            res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status});
          }
        }
        else{
          console.log("ouch");
        }
      }
      else if(rows.length == 0){
        console.log('newest');
        let insertQuery = 'INSERT INTO ??(Name,Email,U_password) VALUES (?,?,?)';
        let query = mysql.format(insertQuery,["users",c.u_name,c.u_email,c.u_pass]);
        connection.query(query,(err, response) => {
            if(err) {
                console.error(err);
                flags = 4060; // server database connectivity error;
            }
            else{
              flags = 3; // new user successfully enteres
              req.session.email = c.u_email;
              req.session.uname = c.u_name;
              req.session.status = 0;
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
                  while(i < nod2) {
                    console.log("dogs");
                    d = dog[i];
                    let insertQuery = 'INSERT INTO ??(Uid,DogName,DogBreed,DogGender,DogAge,Description,Address,City,State,ZIP) VALUES (?,?,?,?,?,?,?,?,?,?)';
                    let query = mysql.format(insertQuery,["dogs",req.session.uid,d.dog_name,d.dog_breed,d.dog_gender,d.dog_age,d.dog_info,c.u_add,c.u_city,c.u_state,c.u_zip]);
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
                    res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status});
                  }
                  else if(req.session.status == 1) {
                    res.render('success',{uname: req.session.uname, data: "", status: req.session.status});
                  }
                }
              })
              console.log("successful");
            }
          });
        }
      });
    }
  console.log("out");
  console.log('didnt get in');
  console.log(err);
  if(err != ""){
    res.render('registerdog', {uname: " ",body: req.body, data: {error: err}});
  }
})

app.get('/registersitter',function(req,res){
  if(req.session.uname){
    res.render('registersitter', {uname : req.session.uname, data: "", status: req.session.status});
  }
  else{
    res.render('registersitter', {uname: " ", data: "", status: req.session.status});
  }
})

app.listen(3000);
console.log('listening on port 3000...');
