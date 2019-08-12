var mysql = require('mysql');
var db_connect = require("./db-connect");
var con = db_connect();

module.exports = function(req,res){
  if(req.session.uname){
    var val = req.body;
    var sql = "UPDATE `users` SET `users`.`Fname` ="+mysql.escape(val.fname)+" ,`users`.`Lname` ="+mysql.escape(val.lname)+
    " ,`users`.`Phone` ="+mysql.escape(val.phone)+" WHERE `users`.`email` = "+req.session.email;
    con.query(sql,function (err, result) {
      if(err)
        console.log("error: ", err);
        res.redirect("/dashboard/myacc");
    });
  }
  else{
    res.redirect("/?signin");
  }
}
