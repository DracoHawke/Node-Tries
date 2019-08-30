var mysql = require('mysql');
var db_connect = require('./db-connect');

var connection = db_connect();

module.exports = function(req,res) {
  var sid='';
  var did='';
  var uname='';
  if(req.session.uname) {
    if(req.session.sid)
      var sid = req.session.sid;
    if(req.session.did)
      var did = 1;
    uname = req.session.uname;
  }
    var sql = "select a.`about` from `admin` a inner join (select min(`no`) as Max FROM `admin`) b ON a.`no` = b.Max";
    connection.query(sql,function(err,rows,fields){
      if (err) {console.log(err);}
      if (rows.length == 1){
        var data = rows[0].about;
        if(data == null) {
          data = "<p style='width:100%;font-size:2em;text-align:center;'>This Content is Coming Soon.</p>";
        }
        res.render("about",{uname: uname, data: data, sid: sid, did: did, status: req.session.status, login:req.session})
      }
    });
}
