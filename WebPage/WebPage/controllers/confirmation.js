var bcrypt = require('bcryptjs');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dogmate"
});

module.exports=function(hash,mail){
  con.connect(function(err) {
    if (err) throw err;
    var sql = 'SELECT Uid FROM `users` WHERE Email = ' + mysql.escape(mail);
    con.query(sql, function (err, result) {
      console.log(hash);
      if (err) throw err;
      if(bcrypt.compareSync(result[0].Uid.toString(), hash)) {
       console.log('verified');
      } else {
       // Passwords don't match
       console.log('not verified');
      }
    });
  });
}
