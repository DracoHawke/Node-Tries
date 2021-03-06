var mysql = require('mysql');
var db_connect = require('./db-connect');

var con = db_connect();


module.exports = function(req,res){
  if(req.session.uname) {
    if(req.session.sid)
      var sid = req.session.sid;
    else
      var sid = '';
    if(req.session.did)
      var did = 1;
    else {
      var did = "";
    }
    var uname = req.session.uname;
  }
  else {
    var uname = '';
  }
  var sql = "SELECT `sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`, `users`.`Lname`,`users`.`Email`,`users`.`Profile`, `users`.`status` FROM `users` INNER JOIN `sitters` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus` = 1 and `users`.`status` = 1 AND `sitters`.`enabled` = 1 order by `sitters`.`Rating` DESC LIMIT 0,8";
  console.log(sql);
  con.query (sql, function (err, rows, fields) {
    if(err) throw err;
    var allsitters = rows;
    var c = {};
    var sql2 = "Select count(`sitters`.`Sid`) as totalsitters from `sitters` WHERE `sitters`.`AdminStatus` = 1 AND `sitters`.`enabled` = 1";
    console.log(sql2);
    con.query(sql2, function(err, rows2, fields) {
      if(err) throw err;
      //console.log(sql2);
      var totalsitters = rows2[0].totalsitters;
      if(!req.query.pageno) {
        req.query.pageno = 1;
      }
      res.render('findsitter',{page: 1,uname: uname, url: req.query, sid: sid, rows: allsitters, did: did, totalsitters: totalsitters, status: req.session.status, filters: "no", c: c,login:req.session});
    });
  });
};
