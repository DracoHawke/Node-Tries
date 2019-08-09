var mysql = require('mysql');
var db_connect = require('./db-connect');
var con = db_connect();

module.exports = function(req,res,error1){
  var ageflag = 0;
  var sortflag = 0;
  console.log(req.url);
  //console.log(req.params);
  /*var params1 = [];
  var params2 = req.params.id.split('&');
  console.log(params2.length);
  for(var i = 0; i < params2.length; i++){
    b = params2[i].split('=');
    console.log(b);
    console.log(b[0]);
    console.log(b[1]);
    params1[b[0]] = b[1];
  }
  console.log(params1);
  //if(params1!="/"){
    //params1 = req.url + params1;
  //}*/
  var c = {};
  if(req.query.name){
    c.name = req.query.name;
    var nm =  req.query.name.replace(/ /g,'_');
  }
  else{
    nm = "";
  }
  if(typeof req.query.state !== "undefined"){
    c.state = req.query.state;
    var st = mysql.escape(req.query.state).slice(1,-1);
  }
  else{
    st = "";
  }
  if(typeof req.query.age_group !== "undefined"){
    console.log(req.query.age_group);
    if(req.query.age_group != "All"){
      ageflag = 1;
      c.age_group = req.query.age_group;
      var age = mysql.escape(req.query.age_group).slice(1,-1);
      // notations: 'l' -> 'less than', 'g' -> 'greater than', 'b' -> 'between'.
      // values: 'l1' -> 'less than 1', 'b12' -> 'between 1 and 2', 'gtt' -> 'greater than 10', 't[2,3]' -> '10'.
      if(age[0] == 'l'){
        var b1 = 0;
        var b2 = 1;
        console.log("less than 1");
      }
      else if(age[0] == 'b') {
        b1 = age[1];
        b2 = age[2];
        console.log("between");
      }
      else if(age[0] == 'g') {
        b1 = 10;
        b2 = 20;
        console.log("greater than 10");
      }
    }
  }
  else{
    age = "";
  }
  if(typeof req.query.sort_by != "undefined") {
    console.log("sort_by");
    sb = "Rating";
    c.sort_by = req.query.sort_by;
    if(req.query.sort_by != "Rating"){
      sortflag = 1;
      sb = mysql.escape(req.query.sort_by).slice(1,-1);
    }
  }
  else{
    sb = "Rating";
  }
  //if(b.length == 1){
    //var b = b[0];
  //}
  //console.log('here1');
  console.log(nm,st);
  //console.log('here2');
  //console.log(b.length);
  var a = mysql.escape(nm).slice(1,-1);
  console.log(a);
  regexp = a+'\.[0-9]{1}';
  var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`Description`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus`=1 and `users`.`status`=1 and (DogBreed LIKE '%"+ a +"%' OR DogAge = '" + a + "' OR DogAge REGEXP '"+regexp+"') order by `dogs`.`"+sb+"` DESC";
  if(ageflag == 1){
    var sql = "SELECT `dogs`.`DogAge`, `dogs`.`Did`, `dogs`.`DogName`, `dogs`.`Rating`, `dogs`.`Reviews`, `dogs`.`Description`, `users`.`Fname`, `users`.`Lname`, `users`.`Email`, `dogs`.`DogPic1`, `dogs`.`DogPic2`, `dogs`.`DogPic3`, `dogs`.`DogPic4`, `dogs`.`DogPic5`, `dogs`.`DogBreed`, `users`.`status` FROM `users` INNER JOIN `dogs` ON `dogs`.`Uid` = `users`.`Uid` where `dogs`.`AdminStatus` = 1 and `users`.`status` = 1 and `dogs`.`DogBreed` LIKE '%"+ a +"%' AND  DogAge BETWEEN "+b1+" AND "+b2+" order by `dogs`.`"+sb+"` DESC"
  }
  console.log(sql);
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    //console.log(sql);
    //console.log(rows);
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
    res.render('findmate',{uname: uname, sid: sid, rows: rows, did: did,status: req.session.status, search: 1, c: c});
  });

};
