var mysql = require('mysql');
var db_connect = require('./db-connect');

var con = db_connect();

module.exports = function(req,res){
  console.log("body: ", req.body);
  var body = req.body;
  var ds = ['mon','tue','wed','thu','fri','sat','sun'];
  var days = '';
  for(a in ds){
    c = "days["+ds[a]+"]";
    console.log(c);
    if(typeof body[c] !== 'undefined'){
      console.log("checks: ", body[c]);
      days = days + ds[a] + ",";
    }
  }
  if (days == ""){
    days = null;
  }
  var sql = "UPDATE `sitters`,`users` SET `sitters`.`Radius` = "+mysql.escape(req.body.rangebar)+", `sitters`.`Days` = '"+days+"' WHERE `users`.`Uid` = `sitters`.`Uid` and `users`.`Email` = "+mysql.escape(req.session.email)
  console.log(sql);
  con.query(sql, function (err, rows, fields) {
    if(err) throw err;
    console.log("updated"); //check
    res.redirect('/dashboard/settings');
  });
}
