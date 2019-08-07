var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res,error1){
  console.log("currently in my Location");
  var sql = "SELECT `sitters`.`Location` from `sitters` left join `users` on `sitters`.`Uid` = `users`.`Uid` where `users`.`Email`="+mysql.escape(req.session.email);
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    if(rows.length == 0){
      res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{},check:""});
    }
    else if(rows.length == 1){
      if(rows[0].Location == req.body){

      }
    }
  });
}
