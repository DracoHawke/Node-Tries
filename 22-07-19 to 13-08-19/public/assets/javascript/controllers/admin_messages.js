var db_connect = require('./db-connect');
var mysql = require('mysql');

connection=db_connect();

module.exports=function(req,res){
  if(!req.query.tid){
    var sql='SELECT `tid`,`email`,`name`, `msg`, `created_at`, `seen` FROM `tokens` ORDER BY `tokens`.`created_at` ASC';
    connection.query(sql, function(err, rows, fields) {
      if(err) throw err;
      console.log(rows);
      res.render('admin_messages',{details:req.session,messages:rows})
    });
  }
  else {
    var sql='update tokens set `seen`=1 where tid='+mysql.escape(req.query.tid);
    connection.query(sql, function(err, rows, fields) {
      if(err) throw err;
      console.log('success');
    });
    res.end();
  }
}
