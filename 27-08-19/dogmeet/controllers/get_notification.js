var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res){
  connection.query('SELECT `message`, `created_at`, `href` FROM `notifications` WHERE `Email`='+mysql.escape(req.session.email)+' and `seen`=0', function(err, rows, fields) {
    if (err) {
        throw err;
    }
    req.session.notifications=rows;
  });
}
