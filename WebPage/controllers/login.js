var db_connect = require('./db-connect');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

connection=db_connect();

module.exports=function(res,req){
  console.log("i'm in");
  var id = req.params.id;
  if (Number(id)==0){
  var email = req.query.email;
  var password = req.query.password;
  connection.query('SELECT users.Uid,users.U_password,users.Fname,users.status,users.Profile from users where users.Email = ' + mysql.escape(email) +'', function(err, rows, fields) {
    if (!err){
      //console.log('SELECT users.Uid,users.U_password,users.Fname,users.status from users where users.Email = "' + mysql.escape(email) +'"');
      var error = 0;
      console.log(rows);
      if(rows.length == 1 && bcrypt.compareSync(password, rows[0].U_password.toString())){
        console.log('in1');
          req.session.email = email;
          req.session.uname =rows[0].Fname;
          req.session.email_status=rows[0].status;
          req.session.profile=rows[0].Profile;
          req.session.Uid=rows[0].Uid;
          connection.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`='+mysql.escape(req.session.email)+' and `seen`=0', function(err, rows, fields) {
            if (err) {
                throw err;
            }
            req.session.notifications=rows;
            console.log(rows.length);
          });
          connection.query('SELECT Sid,AdminStatus from sitters where Uid = "' + mysql.escape(rows[0].Uid) +'"', function(err, rows, fields) {
            if (!err){
              console.log('in2');
                if(rows.length == 1){
                  req.session.sid=1;
                  req.session.adst=rows[0].AdminStatus;
                  console.log(req.session.sid);
                }
            }
        });
          connection.query('SELECT Did from dogs where Uid = "' + mysql.escape(rows[0].Uid) +'"', function(err, rows, fields) {
            if (!err){
              console.log('in3');
                if(rows.length >= 1){
                  req.session.did=1;
                }
            }
            res.send('Yes');
            console.log('ending');
            res.end();
        });
        }
      else{
        error = 1;
      }
      if(error==1){
        res.send('Wrong Email/Password');
      }
    }
    else{
      console.log('Error while performing Query.');
      console.log(err);
    }
    });
    }
  }
