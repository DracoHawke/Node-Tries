var mysql = require('mysql');

module.exports=function(){
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dogmate"
});

con.connect(function(err) {
  if (err) throw err;
});

return con;
}
