var mysql = require('mysql');
var db_connect = require('./db-connect');
var bcrypt = require('bcryptjs');
var send_mail=require('./send_mail');
insert_db=require('./insert_db');
getlocation = require('./getlocation');

var con=db_connect();

function ins_dob(session,dob,res){
  var email=session.email;
  connection.query('SELECT * from users where users.Email = "' + email +'"', function(err, rows, fields) {
    if(!err) {
      if(rows.length == 1) {
        connection.query('insert into `sitters` (`Uid`,`DOB`,`AdminStatus`) VALUES("' +rows[0].Uid+'","'+mysql.escape(dob)+'","0")', function(err, result) {
          if(err){ throw err; }
          console.log("1 record inserted, ID: " + result.insertId);
          session.sid = 1;
          res.redirect('/');
        });
      }
    }
  });
}

exports.ins_dob1=function(id,dob,res){
  connection.query('insert into `sitters` (`Uid`,`DOB`,`AdminStatus`) VALUES("' +id+'","'+mysql.escape(dob)+'","0")', function(err, result) {
    if(err){ throw err; }
    console.log("1 record inserted, ID: " + result.insertId);
    res.redirect('/');
  });
}

exports.insertsitter=function(req,res){
  if(req.session.uname){
    ins_dob(req.session,req.body.dob,res);
    getlocation(req,res,"setnew");
  }
  else {
    console.log(req);
    insert_db(req,res);
    console.log('login failed');
  }
}
