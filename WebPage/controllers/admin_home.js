var db_connect = require('./db-connect');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

connection=db_connect();

module.exports=function(req,res,count){
  if(req.session.admin_name){
    var sql="SELECT count(`users`.`Uid`) AS `users`, count(`sitters`.`Sid`) AS `sitters`, count(`dogs`.`Did`) AS `dogs`FROM `users` LEFT JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid`";
    connection.query(sql, function(err, rows, fields) {
      if(err) throw err;
      var count_admin=rows;
      count_admin[0].count=count;
      var sql="SELECT count(`users`.`Uid`) AS `finders`FROM `users` LEFT JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` LEFT JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `sitters`.`Sid` IS NULL  and `dogs`.`Did` IS NULL ";
      console.log(count_admin);
      connection.query(sql, function(err, rows, fields) {
        count_admin[0].finders=rows[0].finders;
        var sql="SELECT count(Uid) as users FROM users where status=0 UNION ALL SELECT count(Sid) as sitters FROM sitters where AdminStatus=0 UNION ALL SELECT count(Did) as dogs FROM dogs WHERE AdminStatus=0";
        connection.query(sql, function(err, rows, fields) {
          if(err) throw err;
          count_admin[0].not_ver=rows[0].users;
          count_admin[0].unapp=rows[1].users+rows[2].users;
          var sql="SELECT `Did`,`DogPic1`,`DogName`, `DogBreed`, `DogGender`, `DogAge`, `DogPic1`, `Uid` FROM `dogs` WHERE AdminStatus=0 ORDER BY Did DESC LIMIT 5";
          connection.query(sql, function(err, rows, fields) {
            var dog_ad=rows;
            var sql="SELECT `sitters`.`Sid`,`users`.`Fname`,`users`.`Email`, `users`.`Lname`,`users`.`Profile`,`sitters`.`DOB`,`users`.`status` FROM `users` INNER JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` where sitters.AdminStatus=0 ORDER By sitters.Sid DESC LIMIT 5";
            connection.query(sql, function(err, rows, fields) {
              var sit_ad=rows;
              console.log(dog_ad);
              console.log(sit_ad);
              console.log(req.session);
              res.render('admin',{details:req.session,count:count_admin,sit_ad:sit_ad,dog_ad:dog_ad});
            });
          });
        });
      });
    });
  }
  else{
    res.redirect('/admin-login');
  }
}
