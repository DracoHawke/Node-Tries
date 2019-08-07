var NodeGeocoder = require('node-geocoder');
var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: '8f1210175c204ffc9c7bce586508e231'
});

module.exports = function(req,res){
  geocoder.geocode(req.body.location, function(err, res) {
    console.log(res[0]);
    var a = res[0];
    var sql = " UPDATE `sitters`,`users` SET `sitters`.`Location` = "+mysql.escape(req.body.location)+", `sitters`.`Longitude` = "+a.longitude+", `sitter`.`Latitude` = "+a.latitude+"  WHERE `users`.`Uid` = `sitters`.`Uid` and `users`.`Email` = "+mysql.escape(req.session.email);
    console.log(sql);
    con.query(sql, function (err, rows, fields) {
      if(err) throw err;
      
    });
    //console.log(typeof res);
    //console.log(typeof res[0]);
    //console.log(typeof a);
  });
}
