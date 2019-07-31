var mysql = require('mysql');
var db_connect = require('./db-connect');

var con = db_connect();

module.exports = function(req,res){
  if(!req.query.id){
    res.redirect('/findamte')
  }
  else if (req.session.uname) {
    console.log(req.query);
    var sql="SELECT `dogs`.`Did`,`dogs`.`Rating`,`dogs`.`Reviews`,`dogs`.`Description`, `dogs`.`DogName`, `dogs`.`DogBreed`, `users`.`Fname`,`dogs`.`DogAge`, `users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`Profile`, `dogs`.`DogPic1`,`dogs`.`DogPic2`,`dogs`.`DogPic3`,`dogs`.`DogPic4`,`dogs`.`DogPic5` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 and `users`.`Email`="+mysql.escape(req.query.id)+" and `dogs`.`Did` = "+mysql.escape(req.query.did);
    con.query(sql, function (err, rows, fields) {
      if(req.session.sid)
        var sid=req.session.Sid;
      else
        var sid = '';
      if(req.session.did)
        var did=req.session.did;
      else {
        var did = "";
      }
      var uname = req.session.uname;
      var details = rows;
      var sql = "Select * from rating where Email='"+req.session.email+"' and did="+rows[0].Did;
      con.query(sql, function (err, rows, fields) {
        console.log(sql);
        if(rows.length!=0){
          console.log(rows);
          res.render('matedetails',{uname: uname, sid: sid, rows: details, update:rows[0].rating,did: did});
        }
        else{
          console.log('no row');
          res.render('matedetails',{uname: uname, sid: sid, rows: details, update:'', did: did});
        }
      });
    });
  }
  else{
    res.redirect('/findmate?signin');
  }
}
