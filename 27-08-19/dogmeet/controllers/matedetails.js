var mysql = require('mysql');
var db_connect = require('./db-connect');

var con = db_connect();

module.exports = function(req,res){
  if(!req.query.id){
    res.redirect('/findamte')
  }
  else if (req.session.uname) {
    if(req.session.email_status != 1){
        res.redirect("/AuthenticationNeeded");
    }
    //console.log("query: ",req.query);
    if(req.query.stars) {
      var sit_mail = req.query.id;
      console.log("update: ", req.query.update);
      var stars=req.query.stars;
      if(stars > 5){
          stars = 5;
      }
      var sql = "SELECT `dogs`.`Did`,`dogs`.`Rating`,`dogs`.`Reviews` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 and `users`.`Email`="+mysql.escape(req.query.id)+" and `dogs`.`Did` = "+mysql.escape(req.query.did);
      //console.log(sql);
      con.query(sql, function (err, rows, fields) {
        if(err) throw err;
        //console.log(rows);
        var upd = rows[0].Rating*rows[0].Reviews;
        //console.log(upd);
        if(req.query.update){
          upd = upd - Number(req.query.update);
          upd = upd + Number(stars);
          upd = upd / Number(rows[0].Reviews);
          if(Number(upd) > 5){
              upd = 5;
          }
          upd_query = "update `dogs` SET `dogs`.`Rating` = "+ upd +" where `dogs`.`Did` = " + rows[0].Did;
          sql = " UPDATE `rating` SET `drating` = " + stars + " WHERE `Email` = '" + req.session.email + "' and `did` = " + rows[0].Did;
        }
        else{
          upd = upd + Number(stars);
          //console.log(upd);
          var div = Number(rows[0].Reviews)+1;
          //console.log(div);
          upd = upd/div;
          //console.log(upd);
          if(Number(upd) > 5){
              upd = 5;
          }
          var upd_query = 'update `dogs` SET `dogs`.`Rating`=' + upd + ', `dogs`.`Reviews`=' + (rows[0].Reviews+1)+' where `dogs`.`Did` = ' + rows[0].Did;
          //console.log(upd_query);
          var sql = 'INSERT INTO `rating`(`Email`, `did`, `drating`) VALUES ("'+req.session.email+'",'+rows[0].Did+','+stars+')';
        }
        //console.log(sql);
        con.query(sql, function (err, rows, fields) {
          if(err) throw err;
          //console.log(req.query.stars);
          res.send("yes");
          res.end();
          //console.log(upd_query);
        });
        con.query(upd_query, function (err, rows, fields){
          if(err) throw err;
          //console.log('updated successfully');
        });
      });
    }
    else {
      var sql = "SELECT `dogs`.`Did`,`dogs`.`Rating`,`dogs`.`Reviews`,`dogs`.`Description`, `dogs`.`DogName`, `dogs`.`DogBreed`, `users`.`Fname`,`dogs`.`DogAge`, `users`.`Lname`,`users`.`Email`,`users`.`Phone`,`users`.`Profile`, `dogs`.`DogPic1`,`dogs`.`DogPic2`,`dogs`.`DogPic3`,`dogs`.`DogPic4`,`dogs`.`DogPic5` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 and `users`.`Email`="+mysql.escape(req.query.id)+" and `dogs`.`Did` = "+mysql.escape(req.query.did);
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
          //console.log(sql);
          if(rows.length!=0){
            //console.log(rows);
            res.render('matedetails',{uname: uname, sid: sid, rows: details, update:rows[0].drating, did: did, login:req.session});
          }
          else{
            //console.log('no row');
            res.render('matedetails',{uname: uname, sid: sid, rows: details, update:'', did: did, login:req.session});
          }
        });
      });
    }
  }
  else{
    res.redirect('/findmate?signin');
  }
}
