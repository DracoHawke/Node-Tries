var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(data){
  if(data.to=='admin'){
    console.log('i am in ins notify to admin');
    var message=data.from+' sent a message/query Check Here.'
    data.href='';
    var sql='INSERT INTO `notifications`(`Email`, `message`,`seen`, `href`) VALUES ("admin",'+mysql.escape(message)+','+'0,'+mysql.escape(data.href)+')';
    con.query(sql, function (err,rows,fields) {
      if(err) throw err;
      console.log('notification sent to admin successfully');
    });
  }
  else{
    var sql='select `users`.`Fname`,`users`.`Lname` from `users` where `users`.`Email`='+mysql.escape(data.from);
    con.query(sql, function (err,rows,fields) {
      if(err) throw err;
      var message=rows[0].Fname+' '+rows[0].Lname+' sent you a message';
      var sql='INSERT INTO `notifications`(`Email`, `message`,`seen`, `href`) VALUES ('+mysql.escape(data.me)+','+mysql.escape(message)+','+'0,'+mysql.escape(data.href)+')';
      con.query(sql, function (err,rows,fields) {
       if(err) throw err;
       console.log('success');
      });
    });
  }
}
