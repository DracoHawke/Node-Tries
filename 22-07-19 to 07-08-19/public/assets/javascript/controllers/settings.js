var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res,error1){
  console.log("currently in my settings");
  if(req.session.sid){sid = 1;}else{sid=0;}
  if(req.session.did){did = 1;}else{did=0;}
  var sql = "SELECT `sitters`.`Location` from `sitters` left join `users` on `sitters`.`Uid` = `users`.`Uid` where `users`.`Email`="+mysql.escape(req.session.email);
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    if(rows.length == 0){
      res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{},check:""});
    }
    else if(rows.length == 1){
      send_data = rows[0];
      send_data.status_err = "verified";
      res.render('dashboard',{uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error1, check: "settings"});
    }
    else{
      console.log("hmmmmmmmmmmmmmmmmm??????????", rows.length);
    }
  });
}
