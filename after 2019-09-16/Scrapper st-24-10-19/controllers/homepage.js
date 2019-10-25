var mysql = require('mysql');
var db_connect = require('./db-connect');

var con = db_connect();

module.exports = function(req,res){
  res.render('index');
}
