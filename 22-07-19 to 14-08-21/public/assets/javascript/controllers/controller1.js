var url = require('url');
var bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const formidable = require('formidable');
var Joi = require('@hapi/joi');

enterdata = require('./enterdata');
renderpassrec = require('./renderpassrec');
send_mail_pass = require('./send_mail_pass')
mes = require('./derrmes');
db_connect = require('./db-connect');
formvalidator = require('./formvalidator');
checkval = require('./checkval');
confirmation = require('./confirmation');
sitter = require('./sittersignup');
sittervalid = require('./sittervalid');
fileval = require('./fileval');
insert_db = require('./insert_db');
login = require('./login');
dashboard = require('./dashboard');
update_form = require('./update_form');
findsitter = require('./findsitters');
sitterdetails = require('./sitterdetails');
findmate = require('./findmate');
matedetails = require('./matedetails');
mydogs = require('./mydogs');
searchmate = require('./searchmate');
dogdetails = require('./dogdetails');
registerdogmore = require('./registerdogmore');
registerdogfirst = require('./registerdogfirst');
getlocation = require('./getlocation');
setvalues = require('./setvalues');
searchsitter = require('./searchsitter');
chat_list = require('./chat_list');
message_db = require('./message_db');
chatroom = require('./chatroom');
ins_notif = require('./ins_notif');
read_noti = require('./read_noti');
get_notification = require('./get_notification');
updateinfo = require("./updateinfo");
registerdogpost = require("./registerdogpost");
about = require("./about");
faq = require("./faq");
blog = require("./blog");
dogdetails_post = require('./dogdetails_post');

//admin modules
admin_login = require('./admin_login');
admin_home = require('./admin_home');
admin_messages = require("./admin_messages");
allsitters = require('./allsitters');
allusers = require('./allusers');
alldogs = require('./alldogs');
details = require('./details');
dogsofuser = require('./dogsofuser');
admin_about = require('./admin_about');
admin_faq = require('./admin_faq');
admin_blog = require('./admin_blog');
site_home = require('./site_home');
newsteller = require('./newsteller');
templater = require('./templater');

var count = 0;

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

module.exports = function(app) {
  var urlFile = fileUpload({
   createParentPath: true,
   useTempFiles: true,
   tempFileDir: "/public/assets/temp"
  });
  var server = require('http').Server(app);
  var io = require('socket.io')(server);

  server.listen(12122);
  console.log('listening on port 12122...');

  app.use(session({
      //cookie: {maxAge: 60000},
      key: 'key1',
      secret: '566b0505a274977df423ff34031fdeb3722d480c01ab74702448927cd65854e3',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      name: 'id'
  }));

  var urlencodedParser = bodyparser.urlencoded({extended:false});

  var connection = db_connect();

  var path = [];

  function myMiddleware (req, res, next) {
    connection.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`='+mysql.escape(req.session.email)+' and `seen`=0', function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
      req.session.notifications=rows;
      console.log('success and here');
      next()
    });
  }

  app.use(myMiddleware);

  app.get('/',urlencodedParser,function(req,res) {
    console.log("ok");
    if(req.session.uname){
      if(req.session.sid){
        var sid = req.session.sid;
      }
      else{
        sid = "0";
      }
      if(req.session.did){
        var did = req.session.did;
      }
      else{
        var did = "0";
      }
      res.render('index', {uname: req.session.uname, status: req.session.status, sid: sid, did: did, login:req.session});
    }
    else{
      res.render('index', {login:req.session ,uname: " ",status: "", sid: "0", did: "0"});
    }
  });
  //read notifications
  app.get('/read_noti',function(req,res){
    read_noti(req,res);
  })
  //get notification
  app.get('/about',urlencodedParser,function(req,res){
    about(req,res);
  });

  app.get('/faq',urlencodedParser,function(req,res){
    faq(req,res);
  });

  app.get('/blog',urlencodedParser,function(req,res){
    blog(req,res);
  });

  app.get('/verify',urlencodedParser,function(req,res){
    var status='';
    //console.log(req.query);
    if(req.query.id && req.query.check){
      //console.log(req.query.id,req.query.check);
      status = confirmation(req,res);
    }
    else{
      console.log(status);
      var data={id:status};
      res.render('verify',{data:data,uname:'',sid:'',did:""});
    }
  });

  app.get('/contact',urlencodedParser,function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      if(req.session.did){
        var did = req.session.did;
      }
      else{
        var did = "";
      }
      var uname=req.session.uname;
    }
    else
      var uname = ' ';
    res.render('contact',{uname:uname,did:did,sid:sid,login:req.session});
  });

  app.get('/pricing/:id',urlencodedParser,function(req,res){
    console.log("i'm in");
    var id = req.params.id;
    if (Number(id)==0){
      var email = req.query.email;
      var password = req.query.password;
      connection.query('SELECT `users`.`Profile`,`users`.`Uid`,users.No_of_Dogs ,users.status, users.Fname, dogs.Did, sitters.Sid, users.U_password FROM users LEFT JOIN dogs ON dogs.Uid = users.Uid LEFT JOIN sitters ON sitters.Uid = users.Uid where users.Email = "' + email +'"', function(err, rows, fields) {
        if (!err){
          var error = 0;
          if(rows.length > 0){
            if(bcrypt.compareSync(password, rows[0].U_password.toString())) {
              req.session.email = email;
              req.session.uname =rows[0].Fname;
              req.session.status = rows[0].status;
              req.session.nod = rows[0].No_of_Dogs;
              req.session.uid = rows[0].Uid;
              req.session.profile = rows[0].Profile;
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

  app.get('/AuthenticationNeeded',urlencodedParser,function(req,res){
    res.render("AuthenticationNeeded",{uname : req.session.uname, data: "", status: req.session.status, sid:'', did: '', login:req.session});
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
      var uname = ' ';
      var sid = '';
      var did = '';
      console.log(req.query);
      res.render('registeration',{data:req.query,uname:uname,sid:sid,did: did,status: ''});
    }
  })

  app.post('/registeration',urlFile,function(req,res){
    console.log(req.files);
    console.log(req.body);
    if(req.session.uname)
      res.redirect('/');
    else{
      var uname='';
      var sid='';
      var did = '';
    }
    var data_err = formvalidator.fval(req.body);
    data_err = fileval(req.files,data_err);
    console.log(data_err);
    if(data_err.success==''){
      res.render('registeration',{data: data_err,uname: uname,sid: sid, did: did, status: ''});
    }
    else {
      req.body.pack='none';
      var uid='';
       insert_db(req,res);
    }
  });

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
        registerdogmore(req,res);
      }
      else{
        registerdogfirst(req,res);
      }
    }
    else{
      res.render('registerdog', {uname: " ",data: "", status: '', sid: "", did: '', set: ""});
    }
  })

  app.post('/registerdog',urlFile,function(req,res){ // function when a user enters information into the dog form and passes js validation
    registerdogpost(req,res);
  });

  app.get('/registersitter',urlencodedParser,function(req,res){
    sitter(res,req);
  })

  app.post('/registersitter',urlFile,function(req,res){
    sittervalid(req,res);
  });

  app.get('/findsitter',urlFile,function(req,res){
    findsitter(req,res);
  });

  app.get('/sitterdetails',urlFile,function(req,res){
    sitterdetails(req,res);
  })

  app.get('/findmate',urlFile,function(req,res){
    findmate(req,res);
  });

  app.get('/matedetails',urlFile,function(req,res){
    matedetails(req,res);
  })

  //dashboard
  app.get('/dashboard',function(req,res){
    var error1={};
    console.log("normal dashboard");
    dashboard(req,res,error1,"myacc");
  });

  app.get('/dashboard/:page',urlFile,function(req,res){
    var page = req.params.page;
    var error1 = {};
    if (Object.keys(req.query).length != 0){
      error1 = req.query;
      for (i in error1){
        if(i == "d"){
          error1 = error1["d"];
        }
      }
    }
    if(page == "chat"){
      chat_list(req,res);
    }
    else if(page == "mydogs"){
      dashboard(req,res,error1,"mydogs");
    }
    else if(page == "myacc"){
      dashboard(req,res,error1,"myacc");
    }
    else if(page == "settings"){
      dashboard(req,res,error1,"settings");
    }
    else if(page == "location"){
      //dashboard(req,res,error1,"Location");
    }
    else{
      var error1={};
      dashboard(req,res,error1);
    }
  });

  app.post('/dashboard/:page',urlencodedParser,urlFile,function(req,res){
    var page = req.params.page;
    if("location" == page){
      if(req.body.locationnew){
        getlocation(req,res,"newlocation");
      }
      else if(req.body.rangebar){
        setvalues(req,res);
      }
      else if(req.body.location){
        getlocation(req,res);
      }
      else{
        res.redirect('/dashboard/settings');
      }
    }
    else if(page == "myacc"){
      if(typeof req.body.password !== "undefined"){
        if(req.body.password == ""){
          updateinfo(req,res,"nopass");
        }
        else{
          updateinfo(req,res,"passpresent");
        }
      }
      else{
        res.redirect("/logout");
      }
    }
  });

  app.get('/searchmate',urlFile,function(req,res){
    if(!req.session.uname){
      console.log('in no status');
      res.render('AuthenticationNeeded',{uname : " ", data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes'});
    }
    else if(req.session.status == 0){
      console.log('in zero status');
      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
    }
    else{
      console.log(req.query);
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      var error1 = {};
      if(Object.keys(req.query).length == 2){
        if(req.query.name == ""){
          res.redirect('/findmate');
        }
        else{
          console.log(Object.keys(req.query).length);
          searchmate(req,res,error1);
        }
      }
      else if((Object.keys(req.query).length > 2)){
        console.log(Object.keys(req.query).length);
        searchmate(req,res,error1);
      }
      else{
        console.log("somehow, length less than 2: ", Object.keys(req.query).length);
        res.redirect("/findmate");
      }
    }
  });

  app.post('/searchmate',urlFile,function(req,res){
    // somehow in searchmate post, just redirect to intial page.
    res.redirect("/findmate");
  });

  app.get('/searchsitter',urlFile,function(req,res){
    if(!req.session.uname){
      // check if logged in.
      res.render('AuthenticationNeeded',{uname : " ", data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
    }
    else if(req.session.status == 0){
      // check if verified.
      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
    }
    else{
      var error1 = {};
      if(Object.keys(req.query).length == 3 || (Object.keys(req.query).length == 4 && req.query.pageno)){
      // check if contains 3 items or 4 items with page number (3 is the default which should be recieved from the form).
        if(req.query.name == "" && req.query.Location == ""){
          // if name and location empty redirect to get request of initial page.
          res.redirect('/findsitter');
        }
        else if(req.query.Location != ""){
          // if only location present, show results using geolocator module queries.
          getsitterloc(req,res,"single");
        }
        else {
          // no location then search results with other filters without location.
          searchsitter(req,res,error1);
        }
      }
      else if((Object.keys(req.query).length > 3)){
        // more than 3 keys set.
        if(req.query.Location != ""){
          // if keys > 3 and location set, get results using geoencoder queries, other filters included.
          getsitterloc(req,res,"multiple");
        }
        else if(req.query.Location == "" && req.query.name == "" && req.query.sort_by=="Rating" && req.query.days[0] == "All"){
          // no specific filters set after other searches, redirect to get request to intial page(it has same filters).
          res.redirect("/findsitter");
        }
        else{
          // get results with filters other than location.
          searchsitter(req,res,error1);
        }
      }
      else{
        // unusual behaviour ?
        res.redirect("/findsitter");
      }
    }
  });

  app.post('/searchsitter',urlFile,function(req,res){
    // somehow in searchsitter post, redirect to initial page.
    res.redirect("/findsitter");
  });

  app.get('/dogdetails',urlFile,function(req,res){
    if(!req.session.uname){
      console.log('in no status');
      res.render('AuthenticationNeeded',{uname : " ", data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes'});
    }
    else if(req.session.status == 0){
      console.log('in zero status');
      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
    }
    else{
      console.log(req.query);
      console.log('in dogdetails');
      var error1 = {};
      if(Object.keys(req.query).length == 2){
        console.log(Object.keys(req.query).length);
        dogdetails(req,res,error1);
      }
      else{
        console.log('no / too many keys ', Object.keys(req.query).length);
        res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
      }
    }
  });

  app.get('/dogdetails/:page',function(req,res){
    var page = JSON.parse(req.params.page);
    var query1 = req.query;
    console.log(page," page, query1 ",query1);
    if(!req.session.uname){
      console.log('in no status');
      res.render('AuthenticationNeeded',{uname : " ", data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes'});
    }
    else if(req.session.status == 0){
      console.log('in zero status');
      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
    }
    else{
      console.log(req.query);
      console.log('in dogdetails');
      var error1 = page;
      if(Object.keys(req.query).length == 2){
        console.log(Object.keys(req.query).length);
        dogdetails(req,res,error1);
      }
      else{
        console.log('no / too many keys ', Object.keys(req.query).length);
        res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
      }
    }
  })

  app.post('/dogdetails',urlFile,function(req,res){
    dogdetails_post(req,res);
  });

  app.get("/check",function(req,res){
    if(req.session.uname){
      res.send("Yes");
    }else{
      res.send("Nope");
    }
  });

  app.get('/chatroom',function(req,res){
    chatroom(req,res);
  });
  //socket EventListener
  var users={};
  var users_arr=[];
  io.on('connection',socket => {
    socket.on('new-user',name => {
      users[name]=socket;
      var users_arr=[];
      for(var propt in users){
        users_arr.push(propt);
      }
      console.log(users_arr);
      socket.broadcast.emit('user-connected',users_arr)
    })
    //check if online
    socket.on('online',to=>{
      var users_arr=[];
      for(var propt in users){
        users_arr.push(propt);
      }
      console.log(users_arr);
      if(users_arr.indexOf(to)!=-1){
        socket.emit('yes');
      }
    });
    // send message
    socket.on('send-chat-message',data => {
      for(var propt in users){
        if(socket.id==users[propt].id){
          break;
        }
      }
      send_data={message:data.message,from:propt};
      for(var propt in users){
        users_arr.push(propt);
      }
      console.log(users_arr);
      if(users_arr.indexOf(data.to)!=-1){
        console.log('in');
        users[data.to].emit('chat-message',send_data);
        users[data.to].on('unread',unread=>{
          send_data.read=unread;
          message_db(data,send_data);
          console.log('agya me');
        });
      }
      else {
        send_data.read=0;
        message_db(data,send_data);
      }
    });
    //save notification
    socket.on('notification-added',noti_data=>{
      ins_notif(noti_data);
    });
    socket.on('disconnect',()=>{
      for(var propt in users){
        if(socket.id==users[propt].id){
          delete users[propt];
          break;
        }
      }
      var users_arr=[];
      for(var propt in users){
        users_arr.push(propt);
      }
      socket.broadcast.emit('user-disconnected',users_arr);
    });
  });

  app.get('/mydogs',function(req,res){
    console.log(req.url);
    var error1 = {};
    mydogs(req,res,error1);
  });

  //admin-LOGIN
  app.get('/admin-login',function(req,res){
    if(req.session.admin_name){
      res.redirect('/admin');
    }
    else{
      var admin_name='';
      res.render('admin-login',{err:''});
    }
  });

  app.post('/admin-login',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
      req.body=fields;
      console.log(req.body);
      admin_login(req,res);
    });
  });

  app.get('/admin_home',function(req,res){
    console.log(req.url);
    admin_home(req,res,count);
  });

  app.get('/adminnotify',function(req,res){
    if(req.session.admin_name){
      req.session.notifications={};
      connection.query('update notifications SET `seen`=1 WHERE `Email`="admin"', function(err, rows, fields) {
        if(err) throw err;
        console.log('updated');
      })
      connection.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`="admin" order by created_at desc', function(err, rows, fields) {
        if(err) throw err;
        console.log(rows);
        var notifications=rows;
        console.log('agya ji');
        res.render('notifications',{notifications:notifications,details:req.session});
      });
  }
  else{
    res.redirect('/');
  }
  });

  app.get('/help',function(req,res){
    res.render("help",{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, login: req.session})
  })

  app.get('/terms',function(req,res){
    res.render("terms",{uname : " ", data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, login: req.session})
  })

  app.get('/admin_messages',function(req,res){
    console.log(req.url);
    admin_messages(req,res);
  });


  app.get('/allsitters',function(req,res){
    console.log(req.url);
    allsitters(req,res);
  });

  app.get('/allusers',function(req,res){
    console.log(req.url);
    allusers(req,res);
  });

  app.get('/alldogs',function(req,res){
    console.log(req.url);
    alldogs(req,res);
  });

  app.get('/dogs/:page',function(req,res){
    dogsofuser(req,res);
  });

  app.get('/details',function(req,res){
    console.log(req.url);
    details(req,res);
  });

  app.get('/admin_about',function(req,res){
    admin_about(req,res);
  });

  app.post('/admin_about',urlFile,function(req,res){
    var data = req.body.myeditablediv;
    var sql = " UPDATE `admin` INNER JOIN (select min(`no`) as Max FROM `admin`) t2 ON `admin`.`no` = t2.MAX SET `admin`.`about` = "+mysql.escape(data);
    console.log(sql);
    connection.query(sql,function(err,response){
      if(err) {console.log(err);}
      res.redirect("/admin_about");
    })
  })

  app.get('/admin_faq',function(req,res){
    admin_faq(req,res);
  })

  app.post('/admin_faq',urlFile,function(req,res){
    var data = req.body.myeditablediv;
    var sql = " UPDATE `admin` INNER JOIN (select min(`no`) as Max FROM `admin`) t2 ON `admin`.`no` = t2.MAX SET `admin`.`faq` = "+mysql.escape(data);
    console.log(sql);
    connection.query(sql,function(err,response){
      if(err) {console.log(err);}
      res.redirect("/admin_faq");
    })
  })

  app.get('/admin_blog',function(req,res){
    admin_blog(req,res);
  })

  app.post('/admin_blog',urlFile,function(req,res){
    var data = req.body.myeditablediv;
    var sql = " UPDATE `admin` INNER JOIN (select min(`no`) as Max FROM `admin`) t2 ON `admin`.`no` = t2.MAX SET `admin`.`blog` = "+mysql.escape(data);
    console.log(sql);
    connection.query(sql,function(err,response){
      if(err) {console.log(err);}
      res.redirect("/admin_blog");
    })
  })

  app.get('/site_home',function(req,res){
    site_home(req,res);
  });

  app.post('/newsteller',urlFile,function(req,res){
    console.log("in newsteller");
    console.log(req.body);
    if(Object.keys(req.body).length == 1){
      console.log(req.body.length);
      newsteller (req.body,res);
    }
    else{
      console.log('no / too many feilds ', Object.keys(req.body).length);
      res.redirect('/');
    }
  })

  app.get("/recoverpass",function(req,res){
    if(req.query.check && req.query.id){
      renderpassrec(req,res);
    }
    else if(req.session.uname){
      if(req.session.sid){
        var sid = req.session.sid;
      }
      else{
        sid = "0";
      }
      if(req.session.did){
        var did = req.session.did;
      }
      else{
        var did = "0";
      }
      res.render('recoverpass', {error: {}, uname: req.session.uname, status: req.session.status, sid: sid, did: did, login:req.session, page: ""});
    }
    else{
      res.render('recoverpass', {error: {}, login:req.session ,uname: " ",status: "", sid: "0", did: "0", page: ""});
    }
  })

  app.post("/recoverpass",urlFile,function(req,res){
    console.log(req.body);
    if(req.session.sid) {
      var sid = req.session.sid;
    }
    else{
      sid = "0";
    }
    if(req.session.did){
      var did = req.session.did;
    }
    else{
      var did = "0";
    }
    if(req.session.uname) {
      uname = req.session.uname
    }
    else {
      uname = " ";
    }
    if(Object.keys(req.body).length == 1){
      error1 = {};
      var f = 0;
      const schema_email = Joi.object().keys({emailadd: Joi.string().email().required()});
      var txt ='{ "emailadd":"'+req.body.emailadd+'"}';
      var obj = JSON.parse(txt);
      var { error } = Joi.validate(obj, schema_email);
      if (error) {
        error1.emailerr =  mes.message(error);
        console.log(mes.message(error));
        f = 1;
        res.render('recoverpass', {login:req.session ,uname: " ",status: "", sid: "0", did: "0", page: "", error: error1});
      }
      if(f == 0){
        var emailadd = req.body.emailadd;
        emailadd = emailadd.toString();
        send_mail_pass(emailadd,bcrypt.hashSync(emailadd, 10));
        console.log("no error");
        if(req.session.uname){
          if(req.session.sid){
            var sid = req.session.sid;
          }
          else{
            sid = "0";
          }
          if(req.session.did){
            var did = req.session.did;
          }
          else{
            var did = "0";
          }
          res.render('mailsent', {uname: req.session.uname, status: req.session.status, sid: sid, did: did, login:req.session});
        }
        else{
          res.render('mailsent', {login:req.session ,uname: " ",status: "", sid: "0", did: "0"});
        }
      }
    }
    else{
      console.log("no");
      res.redirect('/');
    }
  })

  app.post("/recoverpass/:page",urlFile,function(req,res){
    if(req.session.sid) {
      var sid = req.session.sid;
    }
    else{
      sid = "0";
    }
    if(req.session.did){
      var did = req.session.did;
    }
    else{
      var did = "0";
    }
    if(req.session.uname) {
      uname = req.session.uname
    }
    else {
      uname = " ";
    }
    var page = (req.params.page);
    console.log(req.body);
    error1 = {};
    if(page == "check"){
      console.log(Object.keys(error1).length);
      console.log(req.body);
      if(Object.keys(req.body).length == 3){
        const schema_password = Joi.object().keys({u_pass: Joi.string().regex(/^(\d{3,4})$|^(?!.*(?:01|12|23|34|45|56|67|78|89|90|09|98|87|76|65|54|43|32|21|10))(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!.$%]{6,}$/).required(),u_cpass:Joi.any().valid(Joi.ref('u_pass')).required()})
        var txt ='{ "u_pass":"'+req.body.u_pass+'","u_cpass":"'+req.body.u_cpass+'"}';
        var obj = JSON.parse(txt);
        var { error } = Joi.validate(obj, schema_password);
        if (error){
          error1.u_pass_err = "New password "+ mes.message(error);
          f = 1;
        }
        if(Object.keys(error1).length != 0){
          res.render('recoverpass', {login:req.session ,uname: uname, mail: req.body.mail ,status: "", sid: sid, did: did, page: 1, error: error1})
        }
        else if(Object.keys(error1).length == 0){
          enterdata(req,res,error1);
        }
        console.log(Object.keys(error1).length);
        console.log(error1);
      } else{
        console.log("no");
      }
    }
    else{
      res.redirect('/');
    }
  })

  app.get('/template',function(req,res){
    templater(req,res);
  })

  var clients = 0;

  app.get('/temp',function(req,res){
    res.render('chatroom');
  });

  app.get('*',function (req, res) {
    res.render('notfound');
  });

};
