var mysql = require('mysql');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var db_connect = require("./db-connect");
var con = db_connect();

module.exports = function(req,res){
  if(req.session.uname){
    var val = req.body;
    var file1 = req.files;
    file1 = file1['fileUpload'];
    var ext = file1.mimetype.split("/");
    var ext = ext[1];
    const hash = bcrypt.hashSync(val.password, 10);
    path1 = 'users/'+req.session.email+'_'+file1.name+"."+ext;
    path = 'public/users/'+req.session.email+'_'+file1.name+"."+ext;
    file1.mv(path, function(err) {
      if(err)
        return res.status(500).send(err);
    });
    if(typeof val.dob === "undefined"){
      var sql = "UPDATE `users` SET `users`.`Fname` ="+mysql.escape(val.fname)+" ,`users`.`Lname` ="+mysql.escape(val.lname)+
      " ,`users`.`Phone` ="+mysql.escape(val.phone)+",`users`.`U_password` ="+hash+",`users`.`Profile`='"+path1+
      "' WHERE `users`.`email` = '"+req.session.email+"'";
    }
    else {
      var sql = "UPDATE `users`,`sitters` SET `users`.`Fname` ="+mysql.escape(val.fname)+" ,`users`.`Lname` ="+mysql.escape(val.lname)+
      " ,`users`.`Phone` ="+mysql.escape(val.phone)+",`users`.`U_password` ="+hash+",`users`.`Profile`='"+path1+
      "', `sitters`.`DOB` ="+mysql.escape(val.dob)+" WHERE `users`.`email` = '"+req.session.email+"' AND `users`.`Uid`=`sitters`.`Uid`";
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
