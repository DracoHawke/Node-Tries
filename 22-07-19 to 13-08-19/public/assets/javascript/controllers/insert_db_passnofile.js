var mysql = require('mysql');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var db_connect = require("./db-connect");
var con = db_connect();

module.exports = function(req,res){
  if(req.session.uname){
    var val = req.body;
    const hash = bcrypt.hashSync(val.password, 10);
    if(typeof val.dob === "undefined"){
      var sql = "UPDATE `users` SET `users`.`Fname` ="+mysql.escape(val.fname)+" ,`users`.`Lname` ="+mysql.escape(val.lname)+
      " ,`users`.`Phone` ="+mysql.escape(val.phone)+",`users`.`U_password` ="+hash+
      "WHERE `users`.`email` = '"+req.session.email+"'";
    }
    else {
      var sql = "UPDATE `users`,`sitters` SET `users`.`Fname` ="+mysql.escape(val.fname)+" ,`users`.`Lname` ="+mysql.escape(val.lname)+
      " ,`users`.`Phone` ="+mysql.escape(val.phone)+",`users`.`U_password` ="+hash+", `sitters`.`DOB`="+mysql.escape(val.dob)+
      "WHERE `users`.`email` = '"+req.session.email+"' AND `users`.`Uid`=`sitters`.`Sid`";
    }
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
