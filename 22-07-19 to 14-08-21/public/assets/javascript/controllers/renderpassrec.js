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
        if(bcrypt.compareSync(result[0].Email.toString(), hash)) {
          res.render('recoverpass',{data: "" , uname:' ', sid:'', did: "", page: 1, login: req.session, error: {}, email: mail});
        } else {
         // Passwords don't match
         res.redirect('/');
        }
      }
      else{
        res.redirect('/');
      }
    });
}
