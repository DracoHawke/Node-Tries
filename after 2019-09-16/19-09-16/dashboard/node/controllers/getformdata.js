db_connecct = require('./db-connect')
mysql = require('mysql')

con = db_connect();

module.exports = function(req,res) {
  console.log(req.query.id);
  var id = mysql.escape(req.query.id);
  var sql = "SELECT `forms`.`Data`,`forms`.`Id` FROM `forms` WHERE `forms`.`id` = " + id;
  console.log(sql);
  con.query(sql,function(err,rows){
    if (err) throw err;
    if(rows.length == 0) {
      res.send("no");
    }
    else {
      rows[0].Data = "<br><form method='post' action='./form/"+rows[0].Id+"'>" + rows[0].Data;
      rows[0].Data = rows[0].Data.replace(/col-4/gi, "col-md-4");
      rows[0].Data = rows[0].Data + "</form>";
      res.send("successful1"+rows[0].Data);
    }
  })
}
