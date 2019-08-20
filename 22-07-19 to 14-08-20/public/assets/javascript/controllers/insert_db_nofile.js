var mysql = require('mysql');
var db_connect = require("./db-connect");
var con = db_connect();

module.exports = function(req,res){
  if(req.session.uname){
    var val = req.body;
    if(typeof val.dob === "undefined"){
      var sql = "UPDATE `users` SET `users`.`Fname` ="+mysql.escape(val.fname)+" ,`users`.`Lname` ="+mysql.escape(val.lname)+
      " ,`users`.`Phone` ="+mysql.escape(val.phone)+" WHERE `users`.`email` = '"+req.session.email+"'";
    }
    else{
      var sql = "UPDATE `users`,`sitters` SET `users`.`Fname` ="+mysql.escape(val.fname)+
      " ,`users`.`Lname` ="+mysql.escape(val.lname)+",`users`.`Phone` ="+mysql.escape(val.phone)+
      ", `sitters`.`DOB` = "+mysql.escape(val.dob)+" WHERE `users`.`email` = '"+req.session.email+
      "' AND `users`.`Uid` = `sitters`.`Uid`";
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
