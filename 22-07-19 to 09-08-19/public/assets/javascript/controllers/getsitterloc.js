var NodeGeocoder = require('node-geocoder');
var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: '8f1210175c204ffc9c7bce586508e231'
});

module.exports = function(req, res, check, send_data) {
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
  console.log("query: ", req.query);
  if(check == "single") {
    geocoder.geocode(req.query.Location, function(err, response) {
      console.log(response[0]);
      var a = response[0];
      var sql = "SELECT `sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`, `users`.`Lname`"+
      ",`users`.`Email`,`users`.`Profile`, `users`.`status`,`sitters`.`Radius`, (6371*acos(cos(radians("+a.latitude+"))*"+
      "cos(radians(`sitters`.`Latitude`))*cos(radians(`sitters`.`Longitude`)-radians("+a.longitude+"))"+
      "+sin(radians("+a.latitude+"))*sin(radians(`sitters`.`Latitude`)))) AS distance FROM `sitters`"+
      " INNER JOIN `users` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus`= 1 "+
      "and `users`.`status` = 1 HAVING distance < `sitters`.`Radius` order by `sitters`.`Rating` DESC";
      console.log(sql);
      con.query(sql, function (err, rows, fields) {
        if(err) throw err;
        console.log(rows);
        c['location'] = req.query.Location;
        console.log(c);
        res.render('findsitter', {uname: uname, sid: sid, rows: rows, did: did,status: req.session.status, rowlen: rows.length, filters: "yes", c: c});
      });
    });
  }
  else if(check == "multiple") {
    console.log("in multiple");
    if(req.query.name != ""){
      var nm = req.query.name;
    }
    else{
      nm = "";
    }
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
    console.log(c.days);
    console.log("mainst: ",mainst);
    c.name = nm;
    geocoder.geocode(req.query.Location, function(err, response) {
      console.log(response[0]);
      var a = response[0];
      if(daysflag == 0 || daysflag == 1){
        var sql = "SELECT `sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`, `users`.`Lname`"+
        ",`users`.`Email`,`users`.`Profile`, `users`.`status`,`sitters`.`Radius`, (6371*acos(cos(radians("+a.latitude+"))*"+
        "cos(radians(`sitters`.`Latitude`))*cos(radians(`sitters`.`Longitude`)-radians("+a.longitude+"))"+
        "+sin(radians("+a.latitude+"))*sin(radians(`sitters`.`Latitude`)))) AS distance FROM `sitters`"+
        " INNER JOIN `users` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus`= 1 "+
        " and `users`.`status` = 1 and `users`.`Fname` LIKE '%"+nm+"%' HAVING distance < `sitters`.`Radius`"+
        " order by "+sb+" DESC";
      }else if(daysflag == 2){
        var sql = "SELECT `sitters`.`Rating`,`sitters`.`Reviews`,`sitters`.`Description`, `users`.`Fname`, `users`.`Lname`"+
        ",`users`.`Email`,`users`.`Profile`, `users`.`status`,`sitters`.`Radius`, (6371*acos(cos(radians("+a.latitude+"))*"+
        "cos(radians(`sitters`.`Latitude`))*cos(radians(`sitters`.`Longitude`)-radians("+a.longitude+"))"+
        "+sin(radians("+a.latitude+"))*sin(radians(`sitters`.`Latitude`)))) AS distance FROM `sitters`"+
        " INNER JOIN `users` ON `sitters`.`Uid` = `users`.`Uid` where `sitters`.`AdminStatus`= 1 "+
        " and `users`.`status` = 1 and `users`.`Fname` LIKE '%"+nm+"%' AND "+mainst+" HAVING distance < `sitters`.`Radius`"+
        " order by "+sb+" DESC";
      }
      console.log(sql);
      con.query(sql, function (err, rows, fields) {
        if(err) throw err;
        console.log(rows);
        c['location'] = req.query.Location;
        console.log(c);
        res.render('findsitter', {uname: uname, sid: sid, rows: rows, did: did, status: req.session.status, rowlen: rows.length, filters: "yes", c: c});
      });
    });
  }
}
