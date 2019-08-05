var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res,error1){
  var sid = 0;
  var did = 0;
  if(req.session.sid){sid = 1;}
  if(req.session.did){did = 1;}
  console.log(sid);
  if(req.session.uname){
    if(req.session.status == 0){
      console.log(sid);
      res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{}});
    }
    else{
      var sql="SELECT `dogs`.`Did`,`dogs`.`City`,`dogs`.`State`,`dogs`.`Address`,`sitters`.`Description`,`sitters`.`DOB`,`sitters`.`Sid`, `users`.`Fname`, `users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`Profile` FROM `users` LEFT JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `users`.`Email`="+mysql.escape(req.session.email);
      con.query(sql, function (err, rows, fields) {
        if(err) throw err;
        var send_data=rows[0];
        send_data.status_err='verified';
        if(send_data.DOB != null)
          send_data.DOB = send_data.DOB.replace(/^'(.*)'$/, '$1');
        console.log(send_data);
        if(send_data.Did != null)
          res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:send_data,error:error1});
        else
          res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:send_data,error:error1});
      });
    }
  }
  else
    res.redirect('/');
}
