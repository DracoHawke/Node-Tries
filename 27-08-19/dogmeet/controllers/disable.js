sql = require('mysql');
db_connect = require('./db-connect')

connection = db_connect();

module.exports = function(req,res){
  console.log(req.query);
}
