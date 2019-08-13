//node modules
var bodyParser=require('body-parser');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const fileUpload = require('express-fileupload');
const formidable = require('formidable');
var mysql = require('mysql');

//controllers
var formvalidator=require('./formvalidator');
insert_db=require('./insert_db');
login=require('./login');
var db_connect = require('./db-connect');
confirmation=require('./confirmation');
sitter=require('./sittersignup');
sittervalid=require('./sittervalid');
fileval=require('./fileval');
dashboard=require('./dashboard');
update_form=require('./update_form');
findsitter=require('./findsitters');
sitterdetails=require('./sitterdetails');
allsitters=require('./allsitters');
allusers=require('./allusers');
alldogs=require('./alldogs');
details=require('./details');
chat_list=require('./chat_list');
message_db=require('./message_db');
chatroom=require('./chatroom');
ins_notif=require('./ins_notif');
read_noti=require('./read_noti');
get_notification=('./get_notification');
registerdog=require('./registerdog');
registerdogmore = require('./registerdogmore');
registerdogfirst = require('./registerdogfirst');

//admin modules
admin_login=require('./admin_login');
admin_home=require('./admin_home');
admin_messages=require("./admin_messages");

var count=0;

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'dogmate',
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 60000,
    // The maximum age of a valid session; milliseconds:
    expiration: 6000000,
};

var sessionStore = new MySQLStore(options);

module.exports=function(app){

  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  server.listen(1212);


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
  var urlFile=fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/public/assets/temp"
  });
  var path=[];

  function myMiddleware (req, res, next) {
    if(!req.session.admin_name){
      con.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`='+mysql.escape(req.session.email)+' and `seen`=0 order by created_at desc', function(err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        req.session.notifications=rows;
        console.log('success and here');
        next();
      });
    }
    else{
      con.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`="admin" and `seen`=0 order by created_at desc', function(err, rows, fields) {
        if(err) throw err;
        console.log(rows);
        req.session.notifications=rows;
        console.log('success and here');
        next();
      });
    }
  }

    app.use(myMiddleware);

  app.post('/',urlencodedParser,function(req,res){
    console.log(req.body);
    res.render('registerdog', {data: ""});
  });

  app.get('/',urlencodedParser,function(req,res){
    count++;
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
    res.render('index', {uname:uname,sid:sid,login:req.session});
  });
//read notifications
app.get('/read_noti',function(req,res){
  read_noti(req,res);
})
//get notification
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
    res.render('about',{uname:uname,sid:sid,login:req.session});
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
    res.render('faq',{uname:uname,sid:sid,login:req.session});
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
    res.render('blog',{uname:uname,sid:sid,login:req.session});
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

  app.get('/contact',function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render('contact',{uname:uname,sid:sid,login:req.session,response:''});
  });

app.post('/contact',function(req,res){
  var uname='';
  var sid='';
  if(req.session.uname){
    var uname=req.session.uname;
    if(req.session.sid)
      var sid=req.session.sid;
  }
  var form = new formidable.IncomingForm();
  form.parse(req,function (err, fields, files) {
    console.log(fields);
    var sql='INSERT INTO `tokens`(`name`,`email`, `msg`) VALUES ('+mysql.escape(fields.name)+','+mysql.escape(fields.email)+','+mysql.escape(fields.message)+')';
    con.query(sql, function(err, result) {
      if(err) throw err;
      console.log('token added');
    });
    var data={};
    data.from=fields.email;
    data.message=fields.message;
    data.to='admin';
    ins_notif(data);
    res.render('contact',{uname:uname,sid:sid,login:req.session,response:'1'});
  });
});
// REFISTER DOG
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
    res.render('registerdog', {uname: "",data: "", status: '', sid: "", did: '', set: "",login:req.session});
  }
});

app.post('/registerdog',urlFile,function(req,res){
  registerdog(req,res);
});

//signup as sitter
  app.get('/sitter',function(req,res){
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
    res.render('registeration',{data:req.query,uname:uname,sid:sid,login:req.session});
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
    if(data_err.fileval==''){}
    else {
      data_err.success='';
    }
    console.log(data_err);
  if(data_err.success==''){
    res.render('registeration',{data:data_err,uname:uname,sid:sid,login:req.session});
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
    console.log(req.session.uname);
    var error1={};
    dashboard(req,res,error1);
  });
  app.post('/dashboard',function(req,res){
    var error1={};
    dashboard(req,res,error1);
  });
  app.get('/dashboard/:page',function(req,res){
    console.log(req.url);
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    var page=req.params.page;
    console.log(page);
    if(page=='myacc'){
    res.redirect('/dashboard')
    }
    else if(page=='chat')
    {
      chat_list(req,res);
    }
    else {
      if(req.session.email_status==0){
        console.log(sid);
        res.render('dashboard',{uname:req.session.uname,sid:sid,send_data:{status_err:'not ver',file:''},error:{}});
      }
      else{
      res.render('dashboard',{uname:uname,send_data:'',sid:sid,page:page,login:req.session});
    }
    }
  });
  app.post('/myacc',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
      req.body=fields;
      req.files=files;
      update_form(req,res);
  });
  });
//chat room
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
  res.render('findmate',{uname:uname,sid:sid,login:req.session});
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
    con.query('update notifications SET `seen`=1 WHERE `Email`="admin"', function(err, rows, fields) {
      if(err) throw err;
      console.log('updated');
    })
    con.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`="admin" order by created_at desc', function(err, rows, fields) {
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

app.get('/details',function(req,res){
  console.log(req.url);
  details(req,res);
});
var clients=0;
app.get('/temp',function(req,res){
  res.render('chatroom');
});
/*io.on('connection',function(socket) {
  clients++;
io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
socket.on('disconnect', function () {
 clients--;
 io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
});
});*/

/*app.get('*', function(req, res) {
    res.redirect('/');
});*/


};
