var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res){
  var did = req.session.did;
  var sid = req.session.sid;
  var email = req.session.email;
  if(req.session.uname){
    if(req.session.status == 0){
      console.log("not verified");
      console.log(sid);
      res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status,sid:sid , did: did});
    }
    else{
      var sql = "SELECT `users`.`Email`,`dogs`.`Did`,`dogs`.`Address`, `dogs`.`City`,`dogs`.`State`,`dogs`.`ZIP`,`users`.`Fname`, `users`.`Lname`, `users`.`Phone`, `users`.`status` FROM `users` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `users`.`Email`= "+mysql.escape(req.session.email);
      console.log("query", sql);
      con.query(sql, function (err, rows, fields) {
        if(rows.length == 0){
          res.render('registerdog', {uname: req.session.uname ,data: "", status: req.session.status, sid: "", did: '',set: ""});
        }
        else{
          if(rows[0].status == 0) {
            res.render('AuthenticationNeeded',{uname : req.session.uname, data: "", status: req.session.status,sid:sid , did: did});
          }
          else{
            var data = rows[0];
            var no_of_dogs = rows.length;
            var set1 = "yes";
            res.render('registerdog', {uname: req.session.uname, data: data, sid: sid, did: did, set: set1, status: req.session.status, nod: no_of_dogs});
          }
        }
      });
    }
  }
}
