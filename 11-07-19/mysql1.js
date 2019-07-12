var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'practice1'
});

connection.connect();

connection.query('SELECT * from emails', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.ping(function (err) {
  if (err) throw err;
  console.log('Server responded to ping');
});
connection.end();
