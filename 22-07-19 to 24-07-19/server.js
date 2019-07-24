var express = require('express');
var url = require('url');
var formvalidator=require('./assets/javascript/formvalidator');
var dogformvalidator=require('./assets/javascript/dogformvalidator');
var bodyparser = require('body-parser');
var mysql      = require('mysql');
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
app.get('/',function(req,res) {
  console.log("ok");
  if(req.session.uname){
    res.render('index', {uname: req.session.uname});
  }
  else{
    res.render('index', {uname: " "});
  }
});

app.get('/pricing',function(req,res){
  if(req.session.uname){
    console.log("im in 1");
    res.render('pricing', {
      uname: req.session.uname
    });
  }
  else{
    res.render('pricing', {uname:" "});
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
			res.redirect('/', {uname: " "});
		}
	});
});

app.get('/registerdog',function(req,res){
  if(req.session.uname){
    res.render('registerdog', {uname : req.session.uname, data: ""});
  }
  else{
    res.render('registerdog', {uname: " ",data: ""});
  }
})

app.post('/registerdog',function(req,res){
  if(req.session.uname){
    res.render('registerdog', {uname : req.session.uname, data: ""});
  }
  else{
    console.log(req.body.b);
    var nod = req.body.b;
    var flag = 0;
    var it = 0;
    while(it < nod-1){
      console.log(req.body);
      var data_err=formvalidator.fval(req.body);
      if(data_err.success != "Yes"){
        flag = 1;
      }
      it = it + 1;
    }
    console.log(flag);
    if(flag == 0){
      res.render('Success', {uname:" ",data: ""});
    }
    else {
      res.render('registerdog', {uname: " ", data: data_err})
    }
  }
})

app.get('/registersitter',function(req,res){
  if(req.session.uname){
    res.render('registersitter', {uname : req.session.uname, data: ""});
  }
  else{
    res.render('registersitter', {uname: " ", data: ""});
  }
})

app.listen(3000);
console.log('listening on port 3000...');
