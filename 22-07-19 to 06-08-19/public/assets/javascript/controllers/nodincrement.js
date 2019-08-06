var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res){
  var sql = 'update `users` set `users`.`No_of_Dogs` = ' + req.session.nod + ' where `users`.`Uid` = ' + req.session.uid;
  con.query(sql, function(err, result){
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  })
}
