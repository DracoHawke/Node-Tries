var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res,error1){
  var sid=0;

   if(req.session.sid){sid=1;}
  console.log(sid);

  if(req.session.uname){
    if(req.session.email_status != 1){
      res.redirect("/AuthenticationNeeded");
    }
    else if(req.session.email_status==0){
      console.log(sid);
      res.render('dashboard',{uname:req.session.uname,sid:sid,send_data:{status_err:'not ver',file:''},error:{},login:req.session});
    }
    else{
    var sql="SELECT `sitters`.`Description`,`sitters`.`DOB`, `users`.`Fname`, `users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`Profile` FROM `users` LEFT JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` WHERE `users`.`Email`="+mysql.escape(req.session.email);
    con.query(sql, function (err, rows, fields) {
      if(err) throw errr;
      var send_data=rows[0];
      send_data.status_err='verified';
      if(send_data.DOB!=null)
      send_data.DOB=send_data.DOB.replace(/^'(.*)'$/, '$1');
      console.log(send_data);
      res.render('dashboard',{uname:req.session.uname,sid:sid,send_data:send_data,error:error1,page:'',login:req.session});
    });}
  }
  else
    res.redirect('/');
}
