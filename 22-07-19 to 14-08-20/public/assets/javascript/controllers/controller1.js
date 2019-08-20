var url = require('url');
var bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const formidable = require('formidable');

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
admin_messages=require("./admin_messages");
allsitters = require('./allsitters');
allusers = require('./allusers');
alldogs = require('./alldogs');
details = require('./details');
dogsofuser = require('./dogsofuser');
admin_about = require('./admin_about');
admin_faq = require('./admin_faq');
admin_blog = require('./admin_blog');

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
  var urlFileUpload = fileUpload({
   createParentPath: true,
   useTempFiles: true,
   tempFileDir: "/public/assets/temp"
  });
  var server = require('http').Server(app);
  var io = require('socket.io')(server);

  server.listen(3000);
  console.log('listening on port 3000...');

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

  var urlencodedParser = bodyparser.urlencoded({extended:false});

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
    if(req.session.uname){
      about(req,res);
    }
    else
      res.redirect("/");
  });

  app.get('/faq',urlencodedParser,function(req,res){
    if(req.session.uname){
      faq(req,res);
    }
    else
      res.redirect("/");
  });

  app.get('/blog',urlencodedParser,function(req,res){
    if(req.session.uname){
      blog(req,res);
    }
    else
      res.redirect("/");
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

  app.post('/registeration',urlFileUpload,function(req,res){
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

  app.post('/registerdog',urlFileUpload,function(req,res){ // function when a user enters information into the dog form and passes js validation
    registerdogpost(req,res);
  });

  app.get('/registersitter',urlencodedParser,function(req,res){
    sitter(res,req);
  })

  app.post('/registersitter',urlFileUpload,function(req,res){
    sittervalid(req,res);
  });

  app.get('/findsitter',urlFileUpload,function(req,res){
    findsitter(req,res);
  });

  app.get('/sitterdetails',urlFileUpload,function(req,res){
    sitterdetails(req,res);
  })

  app.get('/findmate',urlFileUpload,function(req,res){
    findmate(req,res);
  });

  app.get('/matedetails',urlFileUpload,function(req,res){
    matedetails(req,res);
  })

  //dashboard
  app.get('/dashboard',function(req,res){
    var error1={};
    console.log("normal dashboard");
    dashboard(req,res,error1,"myacc");
  });

  app.get('/dashboard/:page',urlFileUpload,function(req,res){
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

  app.post('/dashboard/:page',urlencodedParser,urlFileUpload,function(req,res){
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

  app.get('/searchmate',urlFileUpload,function(req,res){
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

  app.post('/searchmate',urlFileUpload,function(req,res){
    // somehow in searchmate post, just redirect to intial page.
    res.redirect("/findmate");
  });

  app.get('/searchsitter',urlFileUpload,function(req,res){
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

  app.post('/searchsitter',urlFileUpload,function(req,res){
    // somehow in searchsitter post, redirect to initial page.
    res.redirect("/findsitter");
  });

  app.get('/dogdetails',urlFileUpload,function(req,res){
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

  app.post('/dogdetails',urlFileUpload,function(req,res){
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

  app.post('/admin_about',urlFileUpload,function(req,res){
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

  app.post('/admin_faq',urlFileUpload,function(req,res){
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

  app.post('/admin_blog',urlFileUpload,function(req,res){
    var data = req.body.myeditablediv;
    var sql = " UPDATE `admin` INNER JOIN (select min(`no`) as Max FROM `admin`) t2 ON `admin`.`no` = t2.MAX SET `admin`.`blog` = "+mysql.escape(data);
    console.log(sql);
    connection.query(sql,function(err,response){
      if(err) {console.log(err);}
      res.redirect("/admin_blog");
    })
  })

  var clients = 0;

  app.get('/temp',function(req,res){
    res.render('chatroom');
  });
};
