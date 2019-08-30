var mysql = require('mysql');
db_connect = require('./db-connect');
connection = db_connect();

module.exports = function(req,res){
  var body = req.body;
  if(Object.keys(body).length == 2) {
    if(typeof body.route === "undefined" || typeof body.preroute === "undefined"){
      res.render('notfound');
    }
    else if(typeof body.route !== "undefined" && body.route == ""){
      res.render('notfound');
    }
    else if(typeof body.preroute !== "undefined" && body.preroute == ""){
      res.render('notfound');
    }
    else{
      var sql = "SELECT `routes`.`routes` FROM `routes` ORDER BY `routes`.`routes` ASC";
      console.log(sql);
    }
  }
}
