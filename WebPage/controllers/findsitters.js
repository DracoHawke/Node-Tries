var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res){
  var sql="SELECT `sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`, `users`.`Lname`,`users`.`Email`,`users`.`Profile` FROM `users` INNER JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus`=1 and `users`.`status`=1 order by `sitters`.`Rating` DESC";
  con.query(sql, function (err, rows, fields) {
    if(err) throw errr;
    console.log(rows);
    if(req.session.uname){
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
    }
    else
      var uname='';
      rows.u_mail=req.session.email;
      res.render('findsitter',{uname:uname,sid:sid,rows:rows,login:req.session});
  });

};
