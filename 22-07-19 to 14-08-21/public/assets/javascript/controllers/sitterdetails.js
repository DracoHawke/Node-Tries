var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(req,res){
  if(!req.query.id){
    res.redirect('/findsitter')
  }
  else if (req.session.uname) {
    if(req.query.stars){
      var sit_mail=req.query.id;
      console.log();
      var stars = req.query.stars;
      var sql = 'SELECT `sitters`.`Sid`,`sitters`.`Rating`,`sitters`.`Reviews` FROM `users`INNER JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` where `users`.`Email`='+mysql.escape(sit_mail);
      con.query(sql, function (err, rows, fields) {
        if(err) throw err;
        console.log(rows);
        var upd=rows[0].Rating*rows[0].Reviews;
        if(req.query.update) {
          upd = upd - Number(req.query.update);
          upd = upd + Number(stars);
          upd = upd / Number(rows[0].Reviews);
          upd_query = "UPDATE `sitters` SET `sitters`.`Rating` = "+ upd +" where `sitters`.`Sid` = " + rows[0].Sid;
          sql = " UPDATE `rating` SET `rating` = " + stars + " WHERE `Email` = '" + req.session.email + "' and `sid` = " + rows[0].Sid;
        }
        else{
          console.log(upd);
          upd = upd+Number(stars);
          console.log(upd);
          var div = rows[0].Reviews+1;
          console.log(div);
          upd = upd/div;
          console.log(upd);
          var upd_query = 'UPDATE `sitters` SET `sitters`.`Rating`='+upd+', `sitters`.`Reviews`='+(rows[0].Reviews+1)+' where `sitters`.`Sid`='+rows[0].Sid;
          var sql = 'INSERT INTO `rating`(`Email`, `sid`, `rating`) VALUES ("'+req.session.email+'",'+rows[0].Sid+','+stars+')';
        }
        con.query(sql, function (err, rows, fields){
          if(err) throw err;
          console.log(req.query.stars);
          res.send("yes");
          res.end();
          console.log(upd_query);
        });
        con.query(upd_query, function (err, rows, fields){
          if(err) throw err;
          console.log('updated successfully');
        })
      });
    }
    else{
      var sql = "SELECT `sitters`.`Sid`,`sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`,`sitters`.`DOB`, `users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`Profile` FROM `users` INNER JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus`=1 and `users`.`status`=1 and `users`.`Email`="+mysql.escape(req.query.id);
      con.query(sql, function (err, rows, fields) {
        if(req.session.sid)
          var sid=req.session.sid;
        else
          var sid = '';
        var uname = req.session.uname;
        var details = rows;
        var sql = "Select * from rating where Email='"+req.session.email+"' and sid="+rows[0].Sid;
        con.query(sql, function (err, rows, fields) {
          console.log(sql);
          if(rows.length != 0)
            res.render('sitterdetails',{uname: uname, sid: sid, rows: details, update:rows[0].rating,did: req.session.did, login: req.session});
          else
            res.render('sitterdetails',{uname: uname, sid: sid, rows: details, update:'', did: req.session.did, login: req.session});
        });
      });
    }
  }
  else{
    res.redirect('/findsitter?signin');
  }
}
