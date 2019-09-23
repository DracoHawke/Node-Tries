mysql = require('mysql');
db_connect = require('./db-connect');
bcrypt = require('bcryptjs');

connection = db_connect();

module.exports = function(req,res){
  if(typeof req.body.password !== "undefined") {
    var password = req.body.password;
    sql = 'SELECT users.Uid,users.U_password from users where users.Email = "' + req.session.email + '"';
    connection.query(sql,function(err,rows1){
      if (err) throw err;
      console.log(rows1);
      console.log(req.session);
      if(rows1.length == 1 && bcrypt.compareSync(password, rows1[0].U_password.toString()) && typeof(req.session.dels) !== "undefined" && req.session.dels == 1) {
        console.log("true");
        var sql3 = "DELETE FROM `sitters` WHERE `sitters`.`Uid` = "+rows1[0].Uid;
          console.log(sql3);
          connection.query(sql3,function(err,results){
            if(err) throw err;
              delete req.session.sid;
              delete req.session.dels;
              console.log(req.session);
              res.redirect('/dashboard');
          })
      }
      else if(!(bcrypt.compareSync(password, rows1[0].U_password.toString()))){
        error1 = {};
        error1.deldog = "Wrong Password";
        error1 = JSON.stringify(error1);
        res.redirect("/dashboard/setwrong");
      }
    })
  }
}
