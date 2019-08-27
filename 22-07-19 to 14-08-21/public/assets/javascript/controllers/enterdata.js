var bcrypt = require('bcryptjs');
var mysql = require('mysql');
var dbconnect = require('./db-connect');

var con = dbconnect();

module.exports = function(req,res,error1){
  mail = mysql.escape(req.body.mail);
  console.log(mail);
  var sql = 'UPDATE `users` SET `users`.`U_Password` = "'+ bcrypt.hashSync(req.body.u_pass, 10) +'" WHERE `users`.`Email` = ' + mysql.escape(req.body.mail);
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render('recoverpass',{data: "" , uname:' ', sid:'', did: "", page: 2, login: req.session, error: {}});
  });
}
