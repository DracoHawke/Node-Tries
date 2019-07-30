var mysql = require('mysql');
var db_connect = require('./db-connect');
var con=db_connect();

module.exports.exist =function (req,res) {
  var sql = 'SELECT count(*) AS count FROM `users` WHERE Email = ' + mysql.escape(req.body.email);
  con.query(sql, function (err,rows,fields) {
    if(!err){
      if(rows.fields==1)
      {
        req.session.email_exist='yes';
      }
        //req.session.email_exist='ok';
    }
  })
};
