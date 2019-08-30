var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res){
  if(req.session.uname){
    var sql='Update notifications SET `seen`=1 where Email='+mysql.escape(req.session.email);
    console.log(sql);
    con.query(sql, function (err,rows,fields) {
     if(err) throw err;
     console.log('success');
    });
  }
}
