var db_connect = require('./db-connect');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

connection=db_connect();

module.exports=function(req,res){
  if(req.session.admin_name){
    console.log(req.query.pageno);
    if(req.query.pageno){
    var off=(req.query.pageno-1)*4;
    }
    else {
      var off=0;
    }
    var sql="SELECT `users`.`Fname`,`users`.`Uid`,`users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`status`,`users`.`Profile`,`users`.`No_of_Dogs` as Did,`sitters`.`Sid` FROM `users` LEFT JOIN `sitters` ON `users`.`Uid` = `sitters`.`Uid` LIMIT 4 OFFSET "+off;
    console.log(sql);
    connection.query(sql, function(err, rows, fields) {
      if(err) throw err;
      var alluser=rows;
      console.log(rows);
      var sql="select count(`users`.`Uid`) as totalusers from users";
      connection.query(sql, function(err, rows, fields) {
        if(err) throw err;
        var totalusers=rows[0].totalusers;
        //console.log(JSON.stringify(req.query));
        if(!req.query.pageno){req.query.pageno=1;}
        res.render('allusers',{details:req.session,alluser:alluser,totalusers:totalusers,url:req.query});
      });
    });
  }
  else{
    res.redirect('/admin-login');
  }
}
