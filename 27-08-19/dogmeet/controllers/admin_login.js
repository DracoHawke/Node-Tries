var db_connect = require('./db-connect');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

connection=db_connect();

module.exports=function(req,res){
  var email = req.body.loginUsername;
  var password = req.body.loginPassword;
  var sql='SELECT `Name`, `Profile`, `Password` FROM `admin` WHERE `Email`='+mysql.escape(email);
  connection.query(sql, function(err, rows, fields) {
    if(err) throw err;
    //console.log(rows);
    if(rows.length==1 && bcrypt.compareSync(password,rows[0].Password.toString())){
      req.session.admin_name=rows[0].Name;
      req.session.admin_email=email;
      req.session.admin_profile=rows[0].Profile;
      //console.log('verified');
      connection.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`="admin" and `seen`=0', function(err, rows, fields) {
        if (err) {
            throw err;
        }
        req.session.notifications=rows;
        res.redirect('/admin_home');
        res.end();
        //console.log(rows);
      });
    }
    else{
      res.render('admin-login',{err:'Wrong E-mail And/Or Password.'});
    }
  });
};
