var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'dogmate'
});

connection.connect();

connection.query('CREATE TABLE users (Uid int not null auto_increment, Name varchar(30), Email varchar(50) unique, U_Password varchar(255), address varchar(255), DOB varhar(50), Phone varchar(20), Gender varchar(20), Pack varchar(20))');
//CREATE TABLE Dogs (Uid int, Did int unique AUTO_INCREMENT not null, DogName varchar(255), DogBreed varchar(255), DogGender varchar(50), DogAge int, DogPic varchar(255), Rating int, FOREIGN KEY (Uid) REFERENCES users(Uid));
//create table Sitters (Uid int, Sid int PRIMARY key not null AUTO_INCREMENT, Address varchar(255), City varchar(255), Age varchar(255), Add_info varchar(255), SitterType varchar(255), ProfilePic varchar(255), Rating int, FOREIGN KEY (Uid) REFERENCES users(Uid));
connection.ping(function (err) {
  if (err) throw err;
  console.log('Server responded to ping');
});
connection.end();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'dogmate'
});
connection.connect();
connection.query('SELECT users.U_Password from users where users.email = "' + email +'"', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
    console.log('err');
});
