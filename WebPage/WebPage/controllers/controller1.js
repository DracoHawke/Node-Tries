var bodyParser=require('body-parser');
var formvalidator=require('./formvalidator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
insert_db=require('./insert_db');

confirmation=require('./confirmation');
var bcrypt = require('bcryptjs');
var session = require('express-session');

module.exports=function(app){

  app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

  var urlencodedParser=bodyParser.urlencoded({extended:false});
  var path=[];
  app.post('/',urlencodedParser,function(req,res){
    console.log(req.body);
    res.render('index',{data:req.body});
  });
  app.get('/',urlencodedParser,function(req,res){
    console.log(req.body);
    res.render('index',{data:req.body});
  });
  app.get('/about',urlencodedParser,function(req,res){
    res.render('about',{data:req.body});
  });
  app.get('/faq',urlencodedParser,function(req,res){
    res.render('faq',{data:req.body});
  });
  app.get('/blog',urlencodedParser,function(req,res){
    res.render('blog',{data:req.body});
  });
  app.get('/verify',urlencodedParser,function(req,res){
    var status='';
    //console.log(req.query);
    if(req.query.id && req.query.check){
      //console.log(req.query.id,req.query.check);
   status=confirmation(req.query.id,req.query.check);}
    var data={id:status};
    res.render('verify',{data:data});
  });
  app.get('/pricing',urlencodedParser,function(req,res){
    var decryptedString='';
    if(req.query.id){
   decryptedString = cryptr.decrypt(req.query.id);
    console.log(decryptedString);}
    var data={id:decryptedString};
    res.render('pricing',{data:data});
  });
  app.get('/contact',urlencodedParser,function(req,res){
    res.render('contact',{data:req.body});
  });
  app.get('/dog',urlencodedParser,function(req,res){
    res.render('registerdog',{data:req.body});
  });
  app.get('/sitter',urlencodedParser,function(req,res){
    res.render('registersitter',{data:req.body});
  });
  app.get('/register',urlencodedParser,function(req,res){
    console.log(req.query);
    res.render('registeration',{data:req.query});
  });
  app.post('/register',urlencodedParser,function(req,res){
    var data_err=formvalidator.fval(req.body);
    if(data_err.success==''){
    res.render('registeration',{data:data_err});
  }
  else {
    req.body.pack='none';
    var uid='';
    insert_db(req);
    const encryptedString = cryptr.encrypt(req.body.name);
    //console.log(encryptedString);
      var data_pricing={name:req.body.name,pack:'none',succes:'/pricing'}
      res.redirect('/pricing?id='+encryptedString);
      res.end();
  }
  });
  app.listen(1212);
};
