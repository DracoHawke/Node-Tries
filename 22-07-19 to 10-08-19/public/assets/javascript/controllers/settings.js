var mysql = require('mysql');
var db_connect = require('./db-connect');
getlocation = require('./getlocation');

var con=db_connect();

module.exports=function(req,res,error1){
  console.log("currently in my settings");
  if(req.session.sid){sid = 1;}else{sid=0;}
  if(req.session.did){did = 1;}else{did=0;}
  var sql = "SELECT `sitters`.`Location`, `sitters`.`Longitude`, `sitters`.`Latitude`, `sitters`.`Days`, `sitters`.`Radius`,`sitters`.`AdminStatus`  from `sitters` left join `users` on `sitters`.`Uid` = `users`.`Uid` where `users`.`Email`="+mysql.escape(req.session.email);
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    console.log(sql);
    console.log("rows: ", rows);
    if(rows.length == 0){
      res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{},check:"", adms: "no"});
    }
    else if(rows.length == 1){
      send_data = rows[0];
      send_data.status_err = "verified";
      if(send_data.AdminStatus == 0){
        res.render('dashboard', {uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error1, check: "settings", adms: "no"});
      }
      else if(send_data.Location == null){
        res.render('dashboard', {uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error1, check: "settings", adms: "yes"});
      }
      else if(send_data.Longitude && send_data.Latitude){
        console.log("longitude: ",send_data.Longitude);
        res.render('dashboard', {uname:req.session.uname, sid:sid, did:did, send_data:send_data, error:error1, check: "settings", adms: "yes"});
      }
      else{
        getlocation(req,res,"getback",send_data);
      }
    }
    else{
      console.log("hmmmmmmmmmmmmmmmmm??????????", rows.length);
    }
  });
}
