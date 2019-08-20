var mysql = require('mysql');
var db_connect = require('./db-connect');
getsitterloc = require('./getsitterloc')
var con = db_connect();

module.exports = function(req,res,error1){
  var daysflag = 0;
  var sortflag = 0;
  var locflag = 0;
  console.log(req.query);
  var c = [];
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
  else
    var uname = ' ';
  if(typeof req.query.Location !== "undefined"){
    if(req.query.Location != ""){
      locflag = 1;
      c.Location = req.query.Location;
      getsitterloc(req,res);
    }
    else{
      st = "";
    }
  }
  console.log("pass?");
  if(req.query.name != ""){
    var nm = req.query.name;
  }
  else {
    nm = "";
  }
  console.log("nm: ", nm);
  var sb = "`sitters`.`Rating`";
  if(typeof req.query.sort_by !== "undefined"){
    c.sort_by = req.query.sort_by;
    if(req.query.sort_by != "Rating"){
      if(req.query.sort_by == "Distance"){
        sb = "Distance";
      }else{
        sb = "`sitters`.`"+mysql.escape(req.query.sort_by).slice(1,-1)+"`";
      }
    }
  }
  var e = [];
  var f = 0;
  c.days = [];
  var daysflag = 0;
  if(typeof req.query.days !== "undefined"){
    console.log("in days");
    daysflag = 2;
    d =  req.query.days;
    for (var i in d){
      console.log(i,": ", d[i]);
      if(d[i] == "All"){
        console.log("in all days");
        c.days[0] = "All";
        daysflag = 1;
        break;
      }
      else if(d[i] == "1"){
        e[f] = "mon";
        f = f + 1;
        continue;
      }
      else if(d[i] == "2"){
        e[f] = "tue";
        f = f + 1;
        continue;
      }
      else if(d[i] == "3"){
        e[f] = "wed";
        f = f + 1;
        continue;
      }
      else if(d[i] == "4"){
        e[f] = "thu";
        f = f + 1;
        continue;
      }
      else if(d[i] == "5"){
        e[f] = "fri";
        f = f + 1;
        continue;
      }
      else if(d[i] == "6"){
        e[f] = "sat";
        f = f + 1;
        continue;
      }
      else if(d[i] == "7"){
        e[f] = "sun";
        f = f + 1;
        continue;
      }
    }
    console.log(daysflag);
    if(daysflag == 2 && e.length >= 7){
      c.days[0] = "All";
      daysflag = 1;
    }
  }
  var mainst = "";
  if(daysflag == 2){
    if(e.length == 1){
      mainst  = mainst + "`sitters`.`Days` Like '%" + e[0] + "%'";
    }
    else{
      mainst = mainst + '(';
      var st1 = "`sitters`.`Days` Like '%";
      var st2 = "%' OR ";
      for (var i in e){
        mainst = mainst + st1 + e[i] + st2;
      }
      var pos = mainst.lastIndexOf("OR");
      mainst = mainst.slice(0,pos);
      mainst = mainst + ')';
    }
    c.days = d;
  }
  console.log(req.query.pageno);
  if(req.query.pageno){
    var off = (req.query.pageno-1)*16;
  }
  else {
    var off = 0;
  }
  console.log(c.days);
  console.log("mainst: ",mainst);
  c.name = nm;
  if(daysflag == 0 || daysflag == 1){
    var sql = "SELECT `sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`, `users`.`Lname`"+
    ",`users`.`Email`,`users`.`Profile`, `users`.`status` FROM `sitters`"+
    " INNER JOIN `users` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus`= 1 "+
    " and `users`.`status` = 1 and `users`.`Fname` LIKE '%"+nm+"%' "+
    " order by "+sb+" DESC LIMIT "+off+",16";
    var sql2 = "SELECT COUNT(`sitters`.`Sid`) as totalsitters FROM `sitters` INNER JOIN `users` "+
    "ON `sitters`.`Uid` = `users`.`Uid` WHERE `sitters`.`AdminStatus` = 1 and `users`.`status` = 1 "+
    "and `users`.`Fname` LIKE '%"+nm+"%' ";
  }else if(daysflag == 2){
    var sql = "SELECT `sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`, `users`.`Lname`"+
    ",`users`.`Email`,`users`.`Profile`, `users`.`status` FROM `sitters`"+
    " INNER JOIN `users` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus`= 1 "+
    " and `users`.`status` = 1 and `users`.`Fname` LIKE '%"+nm+"%' AND "+mainst+
    " order by "+sb+" DESC  LIMIT "+off+",16";
    var sql2 = "SELECT COUNT(`sitters`.`Sid`) as totalsitters FROM `sitters` INNER JOIN `users` "+
    "ON `sitters`.`Uid` = `users`.`Uid` WHERE `sitters`.`AdminStatus` = 1 AND `users`.`status` = 1 "+
    "AND `users`.`Fname` LIKE '%"+nm+"%' AND " + mainst;
  }
  console.log("sql: ", sql);
  console.log("sql2: ", sql2)
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    console.log(rows);
    c['location'] = req.query.Location;
    console.log(c);
    var allsitters = rows;
    con.query(sql2, function(err, rows2, fields) {
      if(err) throw err;
      var totalsitters = rows2[0].totalsitters;
      if(!req.query.pageno) {
        req.query.pageno = 1;
      }
      res.render('findsitter', {page:2, uname: uname, url: req.query, sid: sid, rows: allsitters, did: did, totalsitters: totalsitters, status: req.session.status, rowlen: rows.length, filters: "yes", c: c, login:req.session});
    });
  });
}
