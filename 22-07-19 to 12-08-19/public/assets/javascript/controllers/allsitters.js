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
    if(req.query.id){
        console.log('agya');
        var sql='update `sitters` set `sitters`.`AdminStatus`=1 where Uid='+mysql.escape(req.query.id);
        connection.query(sql, function(err, rows, fields) {
          if(err) throw err;
          console.log('updated');
        });
    }
    var sql="SELECT `users`.`Fname`,`users`.`Uid`,`users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`status`,`users`.`Profile`,`sitters`.`Description`,`sitters`.`Rating`,`sitters`.`Reviews`, `sitters`.`DOB`,`sitters`.`AdminStatus` FROM `users` INNER JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` LIMIT 4 OFFSET "+off;
  //  console.log(sql);
    connection.query(sql, function(err, rows, fields) {
      if(err) throw err;
      var allsitter=rows;
      var sql="select count(`sitters`.`sid`) as totalsitters from sitters";
      connection.query(sql, function(err, rows, fields) {
        if(err) throw err;
        var totalsitters=rows[0].totalsitters;
        //console.log(JSON.stringify(req.query));
        if(!req.query.pageno){req.query.pageno=1;}
        res.render('allsitters',{details:req.session,allsitter:allsitter,totalsitters:totalsitters,url:req.query});
      });
    });
  }
  else{
    res.redirect('/admin-login');
  }
}
