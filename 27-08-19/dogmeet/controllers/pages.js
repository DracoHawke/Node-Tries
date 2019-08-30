var mysql = require('mysql');
db_connect = require('./db-connect');
connection = db_connect();

module.exports = function(req,res){
  var sql = "SELECT `routes`.`routes` FROM `routes` ORDER BY `routes`.`routes` ASC";
  console.log(sql);
  
}
