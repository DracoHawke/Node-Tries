var db_connect = require('./db-connect');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

connection=db_connect();

module.exports = function(req,res){
  if(req.session.admin_name){
    if(req.params.page){
      console.log(req.query.pageno);
      if(req.query.pageno){
      var off = (req.query.pageno-1)*4;
      }
      else {
        var off = 0;
      }
      var sql = "SELECT `dogs`.`DogName`,`dogs`.`Did`,`dogs`.`DogBreed`,`dogs`.`DogGender`,`dogs`.`DogAge`,`users`.`Email`,`users`.`status`,`dogs`.`DogPic1`,`dogs`.`DogPic2`,`dogs`.`DogPic3`,`dogs`.`DogPic4`,`dogs`.`DogPic5`,`dogs`.`AdminStatus` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `dogs`.`Uid` = "+mysql.escape(req.params.page)+" LIMIT 4 OFFSET "+off;
      console.log("sql: ",sql);
      connection.query(sql, function(err, rows, fields) {
        if(err) throw err;
        var alldog = rows;
        var sql = "select count(`dogs`.`Did`) as totaldogs from `dogs` WHERE `dogs`.`Uid` = "+mysql.escape(req.params.page);
        connection.query(sql, function(err, rows, fields) {
          if(err) throw err;
          var totaldogs = rows[0].totaldogs;
          if(!req.query.pageno) {
            req.query.pageno = 1;
          }
          res.render('alldogs', { details:req.session, alldog:alldog, totaldogs:totaldogs, url:req.query });
        });
      });
    }
    else{
      res.redirect('admin_home');
    }
  }
  else{
    res.redirect('/admin-login');
  }
};
