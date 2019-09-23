var mysql = require('mysql');
var db_connect = require('./db-connect');
var con = db_connect();
module.exports = function(req,res){
  if(req.session.uname) {
    if(req.session.did)
      var did = req.session.did;
    else
      var did = '';
    if(req.session.sid)
      var sid = 1;
    else {
      var sid = "";
    }
    var uname = req.session.uname;
  }
  else {
    var uname = '';
  }
  var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`,`dogs`.`DogName`, `dogs`.`Rating`,`dogs`.`Reviews`,`dogs`.`Description`, `users`.`Fname`, `users`.`Lname`,`users`.`Email`,`dogs`.`DogPic1`,`dogs`.`DogPic2`,`dogs`.`DogPic3`,`dogs`.`DogPic4`,`dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 AND `dogs`.`enabled` = 1 order by `dogs`.`Rating` DESC LIMIT 0,8";
  console.log("sql: ",sql);
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    var alldogs = rows;
    //console.log("rows: ",rows);
    var c = {};
    var sql2 = "select count(`dogs`.`Did`) as totaldogs from `dogs` WHERE `dogs`.`AdminStatus` = 1 AND `dogs`.`enabled` = 1";
    con.query(sql2, function(err, rows2, fields) {
      if(err) throw err;
      console.log(sql2);
      var totaldogs = rows2[0].totaldogs;
      if(!req.query.pageno) {
        req.query.pageno = 1;
      }
      console.log("url: ", req.query);
      res.render('findmate',{page:1,uname: uname, url:req.query, sid: sid, rows: alldogs, totaldogs: totaldogs, did: did, status:'', c: c,login:req.session});
    });
  });
};
