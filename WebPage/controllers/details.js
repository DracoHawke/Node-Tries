var db_connect = require('./db-connect');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

connection=db_connect();

module.exports=function(req,res){
  if(req.session.admin_name){
    if(req.query.Did){
      var sql="SELECT `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`DogBreed`, `dogs`.`DogGender`, `dogs`.`DogAge`, `dogs`.`Description`, `dogs`.`Address`, `dogs`.`City`, `dogs`.`State`, `dogs`.`ZIP`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`AdminStatus`, `dogs`.`Uid`,`users`.`Email`,`users`.`Profile`,`users`.`Fname`,`users`.`Lname`,`users`.`status`,`users`.`Phone` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` WHERE `dogs`.`Did`="+mysql.escape(req.query.Did);
      connection.query(sql, function(err, rows, fields) {
        if(err) throw err;
        console.log(rows);
        var dog_details=rows;
        res.render('details',{details:req.session,dog_details:dog_details});
      });
    }
    else if(req.query.Uid){
      var sql='SELECT `users`.`Uid`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `users`.`Phone`, `users`.`status`, `users`.`Profile`,`sitters`.* FROM `users` LEFT JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` WHERE `users`.`Uid`='+mysql.escape(req.query.Uid);
      connection.query(sql, function(err, rows, fields) {
        if(err) throw err;
        var user_det=rows;
        res.render('details',{details:req.session,dog_details:'',user_det:user_det});
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
