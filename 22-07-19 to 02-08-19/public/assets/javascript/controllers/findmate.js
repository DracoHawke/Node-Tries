var mysql = require('mysql');
var db_connect = require('./db-connect');
var con = db_connect();
module.exports = function(req,res){
  var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`,`dogs`.`DogName`, `dogs`.`Rating`,`dogs`.`Reviews`,`dogs`.`Description`, `users`.`Fname`, `users`.`Lname`,`users`.`Email`,`dogs`.`DogPic1`,`dogs`.`DogPic2`,`dogs`.`DogPic3`,`dogs`.`DogPic4`,`dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 order by `dogs`.`Rating` DESC";
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    console.log(sql);
    console.log(rows);
    if(req.session.uname){
      if(req.session.did)
        var did=req.session.did;
      else
        var did='';
      if(req.session.sid)
        var sid = 1;
      else {
        var sid = "";
      }
      var uname=req.session.uname;
    }
    else
      var uname=' ';
      //console.log(rows[5].DogPic1);
    res.render('findmate',{uname: uname, sid: sid, rows: rows, did: did,status: req.session.status});
  });

};
