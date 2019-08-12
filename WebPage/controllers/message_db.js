var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

module.exports=function(data,send_data){
  console.log('in1');
  var sql='INSERT INTO `messages`(`Email`, `toEmail`, `msg`, `read`) VALUES ("'+send_data.from+'","'+data.to+'","'+data.message+'",'+send_data.read+')'
  console.log(sql);
  con.query(sql, function (err, result) {
    if(err) throw err;
    console.log('message recieved');
  });
}
