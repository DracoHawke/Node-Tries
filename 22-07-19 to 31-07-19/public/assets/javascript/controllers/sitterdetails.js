var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res){
  if(!req.query.id){
    res.redirect('/findsitter')
  }
  else if (req.session.uname) {
    var sql="SELECT `sitters`.`Sid`,`sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`,`sitters`.`DOB`, `users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`Profile` FROM `users` INNER JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus`=1 and `users`.`status`=1 and `users`.`Email`="+mysql.escape(req.query.id);
    con.query(sql, function (err, rows, fields) {
      if(req.session.sid)
        var sid=req.session.sid;
      else
        var sid='';
      var uname=req.session.uname;
      var details=rows;
      var sql="Select * from rating where Email='"+req.session.email+"' and sid="+rows[0].Sid;
      con.query(sql, function (err, rows, fields) {
        console.log(sql);
        if(rows.length!=0)
          res.render('sitterdetails',{uname: uname, sid: sid, rows: details, update:rows[0].rating,did: req.session.did});
        else
          res.render('sitterdetails',{uname: uname, sid: sid, rows: details, update:'', did: req.session.did});
      });
    });
  }
  else{
    res.redirect('/findsitter?signin');
  }
}
