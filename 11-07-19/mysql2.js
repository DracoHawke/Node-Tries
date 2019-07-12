var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'practice1'
});
var app = express();

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

app.get("/",function(req,res){
connection.query('SELECT * from emails LIMIT 2', function(err, rows, fields) {
connection.end();
// we can also use connection.destroy() to end a connection.
//The main difference being that Unlike end() the destroy() method does not take a callback argument.
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
  });
});

app.listen(3000)
