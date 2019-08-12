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
        var sql='update `dogs` set `dogs`.`AdminStatus`=1 where Did='+mysql.escape(req.query.id);
        connection.query(sql, function(err, rows, fields) {
          if(err) throw err;
          console.log('updated');
        });
    }
    var sql="SELECT `dogs`.`DogName`,`dogs`.`Did`,`dogs`.`DogBreed`,`dogs`.`DogGender`,`dogs`.`DogAge`,`users`.`Email`,`users`.`status`,`dogs`.`DogPic1`,`dogs`.`AdminStatus` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` LIMIT 4 OFFSET "+off;
  //  console.log(sql);
    connection.query(sql, function(err, rows, fields) {
      if(err) throw err;
      var alldog=rows;
      var sql="select count(`dogs`.`Did`) as totaldogs from dogs";
      connection.query(sql, function(err, rows, fields) {
        if(err) throw err;
        var totaldogs=rows[0].totaldogs;
        //console.log(JSON.stringify(req.query));
        if(!req.query.pageno){req.query.pageno=1;}
        res.render('alldogs',{details:req.session,alldog:alldog,totaldogs:totaldogs,url:req.query});
      });
    });
  }
  else{
    res.redirect('/admin-login');
  }
}
