var bodyParser=require('body-parser');
var formvalidator=require('./formvalidator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
insert_db=require('./insert_db');
login=require('./login');
var db_connect = require('./db-connect');
confirmation=require('./confirmation');
sitter=require('./sittersignup');
sittervalid=require('./sittervalid');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const fileUpload = require('express-fileupload');
const formidable = require('formidable');
fileval=require('./fileval');
dashboard=require('./dashboard');
update_form=require('./update_form');
findsitter=require('./findsitters');
sitterdetails=require('./sitterdetails');

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'dogmate',
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 600000,
    // The maximum age of a valid session; milliseconds:
    expiration: 6000000,
};

var sessionStore = new MySQLStore(options);

module.exports=function(app){
  var server = require('http').Server(app);
  var chat = require('rs-chat')(server);

  chat.init({
    host     : 'localhost', // DB host
    user     : 'root', // DB User
    password : '', // DB Password
    database : 'dogmate' // DB Name
  });

server.listen(1212);
//app.use(formidableMiddleware());
//app.use(fileUpload());
  app.use(session({
      //cookie: {maxAge: 60000},
      key: 'key1',
      secret: '566b0505a274977df423ff34031fdeb3722d480c01ab74702448927cd65854e3',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      name: 'id'
  }));

  var con=db_connect();
  var urlencodedParser=bodyParser.urlencoded({extended:false});
  var path=[];

  app.post('/',urlencodedParser,function(req,res){
    console.log(req.body);
    res.render('registerdog', {data: ""});
  });

  app.get('/',urlencodedParser,function(req,res){
    console.log(req.session);
    console.log(req.session.uname);
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    console.log(sid);
    res.render('index', {uname:uname,sid:sid});
  });

  app.get('/about',urlencodedParser,function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render('about',{uname:uname,sid:sid});
  });

  app.get('/faq',urlencodedParser,function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render('faq',{uname:uname,sid:sid});
  });

  app.get('/blog',urlencodedParser,function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render('blog',{uname:uname,sid:sid});
  });

  app.get('/verify',urlencodedParser,function(req,res){
    var status='';
    //console.log(req.query);
    if(req.query.id && req.query.check){
      //console.log(req.query.id,req.query.check);
   status=confirmation(req,res);}
   else{
   console.log(status);
    var data={id:status};
    res.render('verify',{data:data,uname:'',sid:''});}
  });

  app.get('/pricing/:id',function(req,res){
    login(res,req);
    });

  app.get('/contact',urlencodedParser,function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render('contact',{uname:uname,sid:sid});
  });

  app.get('/dog',urlencodedParser,function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render('registerdog',{uname:uname,sid:sid});
  });

//signup as sitter
  app.get('/sitter',urlencodedParser,function(req,res){
    sitter(res,req);
  });

  app.post('/sitter',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
      req.body=fields;
      console.log(files);
      req.files=files;
      console.log(req.body);
      sittervalid(req,res);
    });
  });

//signup
  app.get('/register',urlencodedParser,function(req,res){
    if(req.session.uname)
      res.redirect('/');
    else{
      var uname='';
      var sid='';
    console.log(req.query);
    res.render('registeration',{data:req.query,uname:uname,sid:sid});
  }
  });

  app.post('/register',function(req,res){
  var form = new formidable.IncomingForm();
  form.parse(req,function (err, fields, files) {
    //console.log(fields);
    req.body=fields;
    req.files=files;
    //console.log(req.fields);
      console.log(req.files);
      console.log(req.body);
    if(req.session.uname)
      res.redirect('/');
    else{
      var uname='';
      var sid='';
    }
    var data_err=formvalidator.fval(req.body);
    data_err=fileval(req.files,data_err);
    console.log(data_err);
  if(data_err.success==''){
    res.render('registeration',{data:data_err,uname:uname,sid:sid});
  }
  else {
    req.body.pack='none';
    var uid='';
     insert_db(req,res);
    //res.end();
    }
  });
});

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
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
      req.body=fields;
      req.files=files;
      update_form(req,res);
  });
  });
  app.get('/chat',function(req,res){
    console.log(req.url);
    res.render('chat');
  });
  app.get('/settings',function(req,res){
    console.log(req.url);
    res.render('settings');
  });
//find Mate
app.get('/findmate',function(req,res){
  if(req.session.uname){
    if(req.session.sid)
      var sid=req.session.sid;
    else
      var sid='';
    var uname=req.session.uname;
  }
  else
    var uname='';
  res.render('findmate',{uname:uname,sid:sid});
})
app.post('/findmate',function(req,res){
  res.render('findmate');
})

//find sitters
app.get('/findsitter',function(req,res){
  findsitter(req,res);
})
app.post('/findsitter',function(req,res){
  res.render('findsitter');
})

//sitter details
app.get('/sitterdetails',function(req,res){
  sitterdetails(req,res);
})
app.post('/findsitter',function(req,res){
  res.render('findsitter');
})

//logout
  app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

  //app.listen(1212);
};
