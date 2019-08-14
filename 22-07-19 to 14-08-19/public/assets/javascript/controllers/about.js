var mysql = require('mysql');
var db_connect = require('./db-connect');

var connection = db_connect();

module.exports = function(req,res) {
  if(req.session.uname) {
    if(req.session.status != 1){
      res.redirect("/AuthenticationNeeded");
    }
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
    res.redirect("/?signin");
    var uname = ' ';
  }
  var sql = "select a.`DATA` from `about` a inner join (select max(`updateno`) as Max FROM `about`) b ON a.`updateno` = b.Max";
  connection.query(sql,function(err,rows,fields){
    if (err) {console.log(err);}
    if (rows.length == 1){
      var data = rows[0].DATA;
      console.log(data.length);
      //console.log(data);
      data = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
      res.render("about",{uname: uname, data: data, sid: sid, did: did, status: req.session.status, login:req.session})
    }
  });
}
