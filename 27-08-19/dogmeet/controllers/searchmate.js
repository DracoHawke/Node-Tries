var mysql = require('mysql');
var db_connect = require('./db-connect');
var con = db_connect();

module.exports = function(req,res,error1){
  var ageflag = 0;
  var sortflag = 0;
  var c = {};
  if(req.query.name){
    req.query.name = req.query.name.trim();
    c.name = req.query.name;
    var nm =  req.query.name.replace(/ /g,'_');
  }
  else{
    nm = "";
  }
  if(typeof req.query.u_state !== "undefined"){
    req.query.u_state = req.query.u_state.trim();
    if(req.query.u_state != ""){
    c.u_state = req.query.u_state;
    var st = mysql.escape(req.query.u_state).slice(1,-1);
    }
    else {
      st = "";
    }
  }
  else {
    st = "";
  }
  if(typeof req.query.age_group !== "undefined"){
    if(req.query.age_group != "All"){
      ageflag = 1;
      c.age_group = req.query.age_group;
      var age = mysql.escape(req.query.age_group).slice(1,-1);
      // notations: 'l' -> 'less than', 'g' -> 'greater than', 'b' -> 'between'.
      // values: 'l1' -> 'less than 1', 'b12' -> 'between 1 and 2', 'gtt' -> 'greater than 10', 't[2,3]' -> '10'.
      if(age[0] == 'l'){
        var b1 = 0;
        var b2 = 1;
      }
      else if(age[0] == 'b') {
        b1 = age[1];
        if(age[2] == "t"){
          b2 = 10;
        }
        else{
          b2 = age[2];
        }
      }
      else if(age[0] == 'g') {
        b1 = 10;
        b2 = 20;
      }
    }
  }
  else{
    age = "";
  }
  if(typeof req.query.sort_by != "undefined") {
    sb = "Rating";
    c.sort_by = req.query.sort_by;
    if(req.query.sort_by != "Rating"){
      sortflag = 1;
      sb = mysql.escape(req.query.sort_by).slice(1,-1);
      if(sb == "DogAge"){
        sb = "CAST(`dogs`.`DogAge` as DECIMAL(10,1))";
      }
      else{
          sb = "`dogs`.`"+sb+"`";
      }
    }
  }
  else {
    sb = "`dogs`.`Rating`";
  }
  if(req.query.pageno){
    var off = (req.query.pageno-1)*2;
  }
  else {
    var off = 0;
  }
  var a = mysql.escape(nm).slice(1,-1);
  regexp = a+'\.[0-9]{1}';
  if(a == "") {
    var bflag = 1;
  }
  else {
    var regexp1 = new RegExp(/^([0-9]\.[0-9])$|^(1[0-9].[0-9])$|^([0-9])$|^(1[0-9])$/);
    if(a.match(regexp1)){
      bflag = 2;
    }
    else {
      bflag = 0;
    }
  }
  if(bflag == 0) {
    var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`Description`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 and `dogs`.`enabled` = 1 and (DogBreed LIKE '%"+ a +"%') AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') order by "+sb+" DESC LIMIT "+off+",2";
    var sql2 = "select count(`dogs`.`Did`) as totaldogs from `dogs` WHERE `dogs`.`AdminStatus` = 1 AND `dogs`.`enabled` = 1 and (DogBreed LIKE '%"+ a +"%') AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%')";
    if(ageflag == 1) {
      var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`Description`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus` = 1 and `users`.`status` = 1 and `dogs`.`enabled` = 1 and (`dogs`.`DogBreed` LIKE '%"+ a +"%' AND DogAge BETWEEN "+b1+" AND "+b2+") AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') order by "+sb+" DESC LIMIT "+off+",2";
      var sql2 = "Select count(`dogs`.`Did`) as totaldogs from `dogs` WHERE `dogs`.`AdminStatus` = 1 AND `dogs`.`enabled` = 1 and `dogs`.`DogBreed` LIKE '%"+ a +"%' AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') AND DogAge BETWEEN "+b1+" AND "+b2;
    }
  }
  else if(bflag == 1) {
    var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`Description`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 and `dogs`.`enabled` = 1 AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') order by "+sb+" DESC LIMIT "+off+",2";
    var sql2 = "select count(`dogs`.`Did`) as totaldogs from `dogs` WHERE `dogs`.`AdminStatus` = 1 AND `dogs`.`enabled` = 1 AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%')";
    if(ageflag == 1) {
      var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`Description`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus` = 1 and `users`.`status` = 1 and `dogs`.`enabled` = 1 and (DogAge BETWEEN "+b1+" AND "+b2+") AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') order by "+sb+" DESC LIMIT "+off+",2";
      var sql2 = "Select count(`dogs`.`Did`) as totaldogs from `dogs` WHERE `dogs`.`AdminStatus` = 1 AND `dogs`.`enabled` = 1 AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') AND DogAge BETWEEN "+b1+" AND "+b2;
    }
  }
  else if(bflag == 2) {
    var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`Description`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 and `dogs`.`enabled` = 1 and (DogAge = '" + a + "' OR DogAge REGEXP '"+regexp+"') AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') order by "+sb+" DESC LIMIT "+off+",2";
    var sql2 = "select count(`dogs`.`Did`) as totaldogs from `dogs` WHERE `dogs`.`AdminStatus` = 1 AND `dogs`.`enabled` = 1 and (DogAge = '" + a + "' OR DogAge REGEXP '"+regexp+"') AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%')";
    if(ageflag == 1) {
      var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`Description`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus` = 1 and `users`.`status` = 1 and `dogs`.`enabled` = 1 and (DogAge BETWEEN "+b1+" AND "+b2+") AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') order by "+sb+" DESC LIMIT "+off+",2";
      var sql2 = "Select count(`dogs`.`Did`) as totaldogs from `dogs` WHERE `dogs`.`AdminStatus` = 1 AND `dogs`.`enabled` = 1 AND (`dogs`.`State` LIKE '%"+st+"%' OR `dogs`.`city` LIKE '%"+st+"%' OR `dogs`.`Address` LIKE '%"+st+"%') AND DogAge BETWEEN "+b1+" AND "+b2;
    }
  }
  console.log(sql);
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    if(req.session.uname){
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
    else{
      var uname = ' ';
    }
    alldogs = rows;
    con.query(sql2, function(err, rows2, fields) {
      if(err) throw err;
      var totaldogs = rows2[0].totaldogs;
      if(!req.query.pageno) {
        req.query.pageno = 1;
      }
      res.render('findmate',{page: 2,uname: uname, url:req.query, sid: sid, rows: alldogs, totaldogs: totaldogs, did: did, status: req.session.status, search: 1, c: c, login:req.session});
    });
  });
};
