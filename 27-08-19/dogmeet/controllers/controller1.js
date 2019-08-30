//node modules
var bodyParser=require('body-parser');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const fileUpload = require('express-fileupload');
const formidable = require('formidable');
var mysql = require('mysql');
var Joi = require('@hapi/joi');

//controllers
enterdata = require('./enterdata');
renderpassrec = require('./renderpassrec');
send_mail_pass = require('./send_mail_pass')
mes = require('./derrmes');
registerdogpost = require("./registerdogpost");
var formvalidator=require('./formvalidator');
insert_db=require('./insert_db');
homepage=require('./homepage');
mydogs = require('./mydogs');
findmate = require('./findmate');
searchmate = require('./searchmate');
update_admin=require('./update_admin');
searchsitter = require('./searchsitter');
login = require('./login');
matedetails = require('./matedetails');
var db_connect = require('./db-connect');
confirmation=require('./confirmation');
sitter=require('./sittersignup');
sittervalid=require('./sittervalid');
getlocation = require('./getlocation');
setvalues = require('./setvalues');
fileval=require('./fileval');
dashboard=require('./dashboard');
update_form=require('./update_form');
dogdetails = require('./dogdetails');
findsitter=require('./findsitters');
sitterdetails=require('./sitterdetails');
allsitters=require('./allsitters');
allusers=require('./allusers');
alldogs=require('./alldogs');
settings = require('./settings');
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
dogdetails_post = require('./dogdetails_post');
about = require("./about");
faq = require("./faq");
blog = require("./blog");
dogsofuser = require('./dogsofuser');
disable = require('./disable');

//admin modules
admin_login=require('./admin_login');
admin_home=require('./admin_home');
admin_messages=require("./admin_messages");
admin_about = require('./admin_about');
admin_faq = require('./admin_faq');
admin_blog = require('./admin_blog');
newsteller = require('./newsteller');
newpage1 = require('./newpage1');
pages = require('./pages');

var count=0;

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
  var io = require('socket.io')(server);
    server.listen(49159);


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
    tempFileDir: "./public/assets/temp"
  });
  var path=[];

function myMiddleware (req, res, next) {
    req.session.Subscriber_err='';
    req.session.Subscriber_success='';
    if(!req.session.admin_name){
	  con.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`='+mysql.escape(req.session.email)+' and `seen`=0 order by created_at desc', function(err, rows, fields) {
        if (err) throw err;
        req.session.notifications=rows;
		if(req.query.Subscriber){
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			////console.log(re.test(req.query.Subscriber));
			if(req.query.Subscriber==''){
				req.session.Subscriber_err='Cannot be left empty !!';
				next();
			}
			else if(re.test(req.query.Subscriber)==false){
				req.session.Subscriber_err='Please Enter a Valid Email Address';
				console.log(req.session);
				next();
			}
			else{
				var query='INSERT INTO `subscribers`(`Email`) VALUES ('+mysql.escape(req.query.Subscriber)+')';
				con.query(query, function(err, results) {
					if(err){
						if(err.code=='ER_DUP_ENTRY') {
							req.session.Subscriber_err='Email Already Exist';
							console.log(req.session);
							next();
						}
						else{
							throw err;
						}
					}
					else{
						req.session.Subscriber_success='Subscribed!! Successfully Newsletters will be sent on your Email';
						next();
					}
				});
			}
		}
		else{
			next();
		}
      });
    }
    else{
      con.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`="admin" and `seen`=0 order by created_at desc', function(err, rows, fields) {
        if(err) throw err;
        req.session.notifications=rows;
        next();
      });
    }
  }

  app.use(myMiddleware);
  //home page
  app.get('/',urlencodedParser,function(req,res){
    count++;
    homepage(req,res);
  });

//read notifications
app.get('/read_noti',function(req,res){
  read_noti(req,res);
})
//get notification
app.get('/about',urlencodedParser,function(req,res){
      about(req,res);
  });

// automatic check login after time out
app.get("/check",function(req,res){
    if(req.session.uname){
      res.send("Yes");
    }else{
      res.send("Nope");
    }
  });

  app.get('/faq',urlencodedParser,function(req,res){
      faq(req,res);
  });

  app.get('/blog',urlencodedParser,function(req,res){
      blog(req,res);
  });

  app.get('/verify',urlencodedParser,function(req,res){
    var status='';
    if(req.query.id && req.query.check){
        status=confirmation(req,res);}
    else{
        var data={id:status};
        res.render('verify',{data:data,uname:'',sid:''});
    }
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
    res.render('contact',{uname:uname,sid:sid,login:req.session,response:'',error:''});
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
    //console.log(fields);
	var error={};
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(fields.email==''){
		error.email='Please Enter an Email';
	}
	else if(re.test(fields.email)==false){
		error.email='Please Enter a Valid Email Address';
	}
	if(fields.name=='')
		error.name='Name cannot be left Empty';
	if(fields.message=='')
		error.message='No message entered';
	if(!error.name && !error.message && !error.email){
		var sql='INSERT INTO `tokens`(`name`,`email`, `msg`) VALUES ('+mysql.escape(fields.name)+','+mysql.escape(fields.email)+','+mysql.escape(fields.message)+')';
		con.query(sql, function(err, result) {
		if(err) throw err;
		//console.log('token added');
		});
		var data={};
		data.from=fields.email;
		data.message=fields.message;
		data.to='admin';
		ins_notif(data);
		res.render('contact',{uname:uname,sid:sid,login:req.session,response:'1',error:''});
	}
	else
		res.render('contact',{uname:uname,sid:sid,login:req.session,response:'',error:error});
  });
});
//mate details

app.get('/matedetails',urlFile,function(req,res){
    matedetails(req,res);
  })

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
})

app.post('/registerdog',urlFile,function(req,res){ // function when a user enters information into the dog form and passes js validation
  registerdogpost(req,res);
});

//signup as sitter
  app.get('/sitter',function(req,res){
    sitter(res,req);
  });

  app.post('/sitter',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
      req.body=fields;
      req.files=files;
      sittervalid(req,res);
    });
  });

//signup
  app.get('/register',urlencodedParser,function(req,res){
    if(req.session.uname)
      res.redirect('/');
    else{
      var uname = '';
      var sid = '';
    res.render('registeration',{data:req.query,uname:uname,sid:sid,login:req.session});
  }
  });

  app.post('/register',function(req,res){
    if(req.session.uname)
      res.redirect('/');
    else {
      var form = new formidable.IncomingForm();
      form.parse(req,function (err, fields, files) {
        req.body = fields;
        req.files = files;
        if(req.session.uname)
          res.redirect('/');
        else{
          var uname = '';
          var sid = '';
        }
        var data_err = formvalidator.fval(req.body);
        data_err = fileval(req.files,data_err);
        if(data_err.file_err == ''){}
        else {
          data_err.success = '';
        }
          if(data_err.success == ''){
            res.render('registeration',{data:data_err,uname:uname,sid:sid,login:req.session});
          }
          else {
            req.body.pack = 'none';
            var uid = '';
             insert_db(req,res);
            //res.end();
          }
        });
    }
});

//dashboard
  app.get('/dashboard',function(req,res){
    var error1 = {};
    dashboard(req,res,error1);
  });
  app.post('/dashboard',function(req,res){
    var error1 = {};
    dashboard(req,res,error1);
  });
  app.get('/dashboard/:page',function(req,res){
    var error1 = {};
    if(req.session.uname){
      if(req.session.sid)
        var sid = req.session.sid;
      else
        var sid = '';
      var uname = req.session.uname;
    }
    else
      var uname = '';
    var page = req.params.page;
    if(page == 'myacc'){
    res.redirect('/dashboard')
    }
    else if(page == "mydogs"){
      mydogs(req,res,error1);
    }
    else if(page == 'chat') {
      chat_list(req,res);
    }
    else {
      if(req.session.email_status == 0){
        res.render('dashboard',{uname:req.session.uname,sid:sid,send_data:{status_err:'not ver',file:''},error:{},login:req.session});
      }
      else{
        if(sid != '') {
            settings(req,res,error1);
        }
        else {
            res.redirect('/dashboard');
        }
      }
    }
  });
  app.post('/dashboard/:page',function(req,res){
    var form = new formidable.IncomingForm();
    var page = req.params.page;
    if("location"==page){
        form.parse(req,function (err, fields, files) {
        req.body=fields;
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
        });
    }
    else{
        res.redirect('/dashboard');
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
    socket.broadcast.emit('user-connected',users_arr)
  })
  //check if online
  socket.on('online',to=>{
    var users_arr=[];
    for(var propt in users){
      users_arr.push(propt);
    }
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
    var users_arr=[];
    send_data={message:data.message,from:propt};
    for(var propt in users){
      users_arr.push(propt);
    }
    if(users_arr.indexOf(data.to)!=-1){
      var sql='select `users`.`Fname`,`users`.`Lname` from `users` where `users`.`Email`='+mysql.escape(send_data.from);
      con.query(sql, function (err,rows,fields) {
        if(err) throw err;
        send_data.name=rows[0].Fname;
        users[data.to].emit('chat-message',send_data);
    });
      users[data.to].on('unread',unread=>{
      send_data.read=unread;
      message_db(data,send_data);
      //console.log('agya me');
    });
  }
  else {
    send_data.read=0;
    message_db(data,send_data);
    send_data.me=data.to;
    send_data.href="/dashboard/chat?to="+send_data.from;
    ins_notif(send_data);
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
    //console.log(users);
    var users_arr=[];
    for(var propt in users){
      users_arr.push(propt);
    }
    socket.broadcast.emit('user-disconnected',users_arr);
  });
});
app.get('/AuthenticationNeeded',urlencodedParser,function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
      res.render("AuthenticationNeeded",{uname : uname, data: "", status: req.session.status, sid:sid, did:req.session.did, login:req.session});
    }
    else{
      res.redirect('/');
    }
  });

    app.get('/help',function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render("help",{uname : uname, status: req.session.status, sid: req.session.sid, did: req.session.did, login: req.session})
  })

  app.get('/terms',function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render("terms",{uname : uname, status: req.session.status, sid: sid, did: req.session.did, login: req.session})
  })

    app.get('/policy',function(req,res){
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
    res.render("policy",{uname : uname, status: req.session.status, sid: sid, did: req.session.did, login: req.session})
  })

  app.get('/settings',function(req,res){
    //console.log(req.url);
    res.render('settings');
  });
//find Mate
app.get('/findmate',function(req,res){
findmate(req,res);
})
app.post('/findmate',function(req,res){
  res.render('findmate');
})
//search mate

app.get('/searchmate',function(req,res){
  if(!req.session.uname){
    //console.log('in no status');
    res.redirect('/findmate?signin')
  }
  else if(req.session.status == 0){
    //console.log('in zero status');
    res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
  }
  else{
    //console.log(req.query);
    //console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    var error1 = {};
    if(Object.keys(req.query).length == 2){
      if(req.query.name == ""){
        res.redirect('/findmate');
      }
      else{
        //console.log(Object.keys(req.query).length);
        searchmate(req,res,error1);
      }
    }
    else if((Object.keys(req.query).length > 2)){
      //console.log(Object.keys(req.query).length);
      searchmate(req,res,error1);
    }
    else{
      //console.log("somehow, length less than 2: ", Object.keys(req.query).length);
      res.redirect("/findmate");
    }
  }
});

//find sitters
app.get('/findsitter',function(req,res){
  findsitter(req,res);
})
app.get('/searchsitter',function(req,res){
    if(!req.session.uname){
      //console.log('in no status');
      res.redirect('/findsitter?signin')
    }
    else if(req.session.status == 0){
      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
    }
    else{
      //console.log(req.query);
      var error1 = {};
      if(Object.keys(req.query).length == 3 || (Object.keys(req.query).length == 4 && req.query.pageno)){
        if(req.query.name == "" && req.query.Location == ""){
          res.redirect('/findsitter');
        }
        else if(req.query.Location != ""){
          getsitterloc(req,res,"single");
        }
        else {
          //console.log(Object.keys(req.query).length);
          searchsitter(req,res,error1);
        }
      }
      else if((Object.keys(req.query).length > 3)){
        //console.log(Object.keys(req.query).length);
        if(req.query.Location != ""){
          getsitterloc(req,res,"multiple");
        }
        else if(req.query.Location == "" && req.query.name == "" && req.query.sort_by=="Rating" && req.query.days[0] == "All"){
          res.redirect("/findsitter");
        }
        else{
          searchsitter(req,res,error1);
        }
      }
      else{
        //console.log("somehow length less than 3: ",Object.keys(req.query).length);
        res.redirect("/findsitter");
      }
    }
  });

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

//edit dog info
app.get('/dogdetails',function(req,res){
    if(!req.session.uname){
      //console.log('in no status');
      res.render('AuthenticationNeeded',{uname : " ", data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes'});
    }
    else if(req.session.status == 0){
      //console.log('in zero status');
      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
    }
    else{
      //console.log(req.query);
      //console.log('in dogdetails');
      var error1 = {};
      if(Object.keys(req.query).length == 2){
        //console.log(Object.keys(req.query).length);
        dogdetails(req,res,error1);
      }
      else{
        //console.log('no / too many keys ', Object.keys(req.query).length);
        res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
      }
    }
  });

  app.get('/dogdetails/:page',function(req,res){
    var page = JSON.parse(req.params.page);
    var query1 = req.query;
    //console.log(page," ",query1);
    if(!req.session.uname){
      //console.log('in no status');
      res.render('AuthenticationNeeded',{uname : " ", data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes'});
    }
    else if(req.session.status == 0){
      //console.log('in zero status');
      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
    }
    else{
      //console.log(req.query);
      //console.log('in dogdetails');
      var error1 = page;
      if(Object.keys(req.query).length == 2){
        //console.log(Object.keys(req.query).length);
        dogdetails(req,res,error1);
      }
      else{
        //console.log('no / too many keys ', Object.keys(req.query).length);
        res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status, sid: req.session.sid, did: req.session.did, alert: 'yes',login:req.session});
      }
    }
  })

app.post('/dogdetails',urlFile,function(req,res){
  //console.log("url: ", req.url);
  //console.log("in post"); //console.log(req.body); //console.log(req.files);
  dogdetails_post(req,res);
});

//logout
  app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
		if(err) {
			//console.log(err);
		} else {
			res.redirect('/');
		}
	});
});
//admin-LOGIN
app.get('/admin-login',function(req,res){
  if(req.session.admin_name){
    res.redirect('/admin_home');
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
    //console.log(req.body);
    admin_login(req,res);
  });
});

app.get('/admin_home',function(req,res){
  //console.log(req.url);
  admin_home(req,res,count);
});

app.get('/adminnotify',function(req,res){
  if(req.session.admin_name){
    req.session.notifications={};
    con.query('update notifications SET `seen`=1 WHERE `Email`="admin"', function(err, rows, fields) {
      if(err) throw err;
      //console.log('updated');
    })
    con.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`="admin" order by created_at desc', function(err, rows, fields) {
      if(err) throw err;
      //console.log(rows);
      var notifications=rows;
      //console.log('agya ji');
      res.render('notifications',{notifications:notifications,details:req.session});
    });
}
else{
  res.redirect('/');
}
});

app.get('/admin_messages',function(req,res){
  //console.log(req.url);
  admin_messages(req,res);
});

//cms admin
app.get('/admin_about',function(req,res){
  admin_about(req,res);
});

app.post('/admin_about',urlFile,function(req,res){
  var data = req.body.myeditablediv;
  var sql = " UPDATE `admin` INNER JOIN (select min(`no`) as Max FROM `admin`) t2 ON `admin`.`no` = t2.MAX SET `admin`.`about` = "+mysql.escape(data);
  //console.log(sql);
  connection.query(sql,function(err,response){
    if(err) {
        console.error(err);
    }
    res.redirect("/admin_about");
  })
})

app.get('/admin_faq',function(req,res){
  admin_faq(req,res);
})

app.post('/admin_faq',urlFile,function(req,res){
  var data = req.body.myeditablediv;
  var sql = " UPDATE `admin` INNER JOIN (select min(`no`) as Max FROM `admin`) t2 ON `admin`.`no` = t2.MAX SET `admin`.`faq` = "+mysql.escape(data);
  //console.log(sql);
  connection.query(sql,function(err,response){
    if(err) {
        console.error(err);
    }
    res.redirect("/admin_faq");
  })
})

app.get('/admin_blog',function(req,res){
  admin_blog(req,res);
})

app.post('/admin_blog',urlFile,function(req,res){
  var data = req.body.myeditablediv;
  var sql = " UPDATE `admin` INNER JOIN (select min(`no`) as Max FROM `admin`) t2 ON `admin`.`no` = t2.MAX SET `admin`.`blog` = "+mysql.escape(data);
  //console.log(sql);
  connection.query(sql,function(err,response){
    if(err) {
        //console.log(err);
        }
    res.redirect("/admin_blog");
  })
})
//
app.get('/allsitters',function(req,res){
  //console.log(req.url);
  allsitters(req,res);
});
app.get('/allusers',function(req,res){
  //console.log(req.url);
  allusers(req,res);
});
app.get('/alldogs',function(req,res){
  //console.log(req.url);
  alldogs(req,res);
});

app.get('/dogs/:page',function(req,res){
  dogsofuser(req,res);
});

app.get('/details',function(req,res){
  //console.log(req.url);
  details(req,res);
});
app.get('/admin_profile',function(req,res){
  if(req.session.admin_name){
      con.query('SELECT `Name`, `Email`, `Profile`  FROM `admin`',function(err,rows,fields){
         if(err) throw err;
         console.log(rows);
         res.render('admin_profile',{details:req.session,admin_info:rows[0],error:''});
      });
  }
  else{
      res.redirect('/admin-login');
  }
});

app.post('/admin_profile',function(req,res){
  if(req.session.admin_name){
     var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
      req.body=fields;
      req.files=files;
      console.log(req.session);
      update_admin(req,res);
    });
  }
  else{
      res.redirect('/admin-login');
  }
});

app.post('/newsteller',urlFile,function(req,res){
    //console.log("in newsteller");
    if(Object.keys(req.body).length == 1){
      newsteller(req.body,res);
    }
    else{
      //console.log('no / too many feilds ', Object.keys(req.body).length);
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
    //console.log(req.body);
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
        //console.log(mes.message(error));
        f = 1;
        res.render('recoverpass', {login:req.session ,uname: " ",status: "", sid: "0", did: "0", page: "", error: error1});
      }
      if(f == 0){
        var emailadd = req.body.emailadd;
        emailadd = emailadd.toString();
        send_mail_pass(emailadd,bcrypt.hashSync(emailadd, 10));
        //console.log("no error");
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
      //console.log("no");
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
    //console.log(req.body);
    error1 = {};
    if(page == "check"){
      //console.log(Object.keys(error1).length);
      //console.log(req.body);
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
        //console.log(Object.keys(error1).length);
        //console.log(error1);
      } else{
        //console.log("no");
      }
    }
    else{
      res.redirect('/');
    }
  })

  app.get('/newpage',function(req,res){
    pages(req,res);
  });

  app.post('/newpage',urlFile,function(req,res){
    var body = req.body;
    newpage1(req,res);
    console.log(req.body);
  });

  app.get('/disable',function(req,res){
    disable(req,res);
  })

  app.get('*',function (req, res) {
    res.render('notfound');
  });

  app.post('*',function (req, res) {
    res.render('notfound');
  });

};
