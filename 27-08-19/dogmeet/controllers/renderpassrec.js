var bcrypt = require('bcryptjs');
var mysql = require('mysql');
var dbconnect = require('./db-connect');

var con = dbconnect();

module.exports = function(req,res){
  hash = req.query.id;
  mail = req.query.check;
  var sql = 'SELECT `Email` FROM `users` WHERE Email = ' + mysql.escape(mail);
  con.query(sql, function (err, result) {
    console.log(hash);
    if (err) throw err;
    if(Object.keys(result).length == 1){
      var sql2 = "SELECT * FROM `passwordreset` WHERE `passwordreset`.`id` = "+ mysql.escape(mail);
      console.log("sql2: ",sql2);
      con.query(sql2,function(err,rows2) {
        console.log("rows2: ", rows2);
        var date1 = new Date();
        //console.log(date1 - rows2[0].time);
        if(rows2.length == 1) {
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
            if(rows2[0].link != hash) {
              console.log("Hash doesn't match");
              res.render('recoverpass',{data: "" , uname:' ', sid:'', did: "", page: 4, login: req.session, error: {}, email: mail, hash: hash});
            }
            else {
              res.render('recoverpass',{data: "" , uname:' ', sid:'', did: "", page: 1, login: req.session, error: {}, email: mail, hash: hash});
            }
          }
        }
        else if(rows2.length == 0) {
          res.render('recoverpass',{data: "" , uname:' ', sid:'', did: "", page: 4, login: req.session, error: {}, email: mail, hash: hash});
        }
      })
      /*if(bcrypt.compareSync(result[0].Email.toString(), hash)) {
              } else {
       // Passwords don't match
       res.redirect('/');
     } */
    }
    else {
      res.redirect('/');
    }
  });
}
