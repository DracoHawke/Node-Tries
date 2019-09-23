var bcrypt = require('bcryptjs');
var mysql = require('mysql');
var dbconnect = require('./db-connect');

var con = dbconnect();

module.exports = function(req,res,error1){
  mail = mysql.escape(req.body.mail);
  console.log(mail);
  var sql1 = "SELECT * FROM `passwordreset` WHERE `passwordreset`.`id` = '"+ mail + "' AND `passwordreset`.`link` = '"+req.query.id+"'";
  console.log(sql1);
  con.query(sql1,function(err,rows1) {
    if (err) throw err;
    if(rows1.length == 1) {
      date1 = date1 - rows2[0].time;
      date1 = Number(date1/60000);
      console.log(date1);
      if(date1 > 100) {
        var sql = "DELETE FROM `passwordreset` WHERE `passwordreset`.`id` = "+ mysql.escape(mail);
        con.query(sql,function(err,results) {
          if (err) throw err;
          res.render('recoverpass',{data: "" , uname:' ', sid:'', did: "", page: 4, login: req.session, error: {}, email: mail, hash: hash});
        })
      }
      else {
        var sql = 'UPDATE `users` SET `users`.`U_Password` = "'+ bcrypt.hashSync(req.body.u_pass, 10) +'" WHERE `users`.`Email` = ' + mysql.escape(req.body.mail);
        console.log(sql);
        con.query(sql, function (err, result) {
          if (err) throw err;
          var sql = "DELETE FROM `passwordreset` WHERE `passwordreset`.`id` = "+ mysql.escape(mail);
          con.query(sql,function(err,results) {
            if (err) throw err;
            res.render('recoverpass',{data: "" , uname:' ', sid:'', did: "", page: 2, login: req.session, error: {}});
          })
        });
      }
    }
    else {
      res.render('recoverpass',{data: "" , uname:' ', sid:'', did: "", page: 4, login: req.session, error: {}, email: mail, hash: req.query.id});
    }
  })
}
