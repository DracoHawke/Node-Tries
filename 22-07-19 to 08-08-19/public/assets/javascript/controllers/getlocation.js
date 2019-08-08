var NodeGeocoder = require('node-geocoder');
var mysql = require('mysql');
var db_connect = require('./db-connect');

var con=db_connect();

var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: '8f1210175c204ffc9c7bce586508e231'
});

module.exports = function(req, res, check, send_data){
  console.log("body: ", req.body);
  if(check != "getback" ){
    geocoder.geocode(req.body.location, function(err, response) {
      console.log(response[0]);
      var a = response[0];
      var sql = " UPDATE `sitters`,`users` SET `sitters`.`Location` = "+mysql.escape(req.body.location)+", `sitters`.`Longitude` = "+a.longitude+", `sitters`.`Latitude` = "+a.latitude+"  WHERE `users`.`Uid` = `sitters`.`Uid` and `users`.`Email` = "+mysql.escape(req.session.email);
      console.log(sql);
      con.query(sql, function (err, rows, fields) {
        if(err) throw err;
        res.redirect('/dashboard/myacc');
      });
      //console.log(typeof res);
      //console.log(typeof res[0]);
      //console.log(typeof a);
    });
  } else if(check == "getback"){
    if(send_data){
      if(send_data.Location == null){
        res.render('dashboard',{uname:req.session.uname,sid:sid,did:did,send_data:{status_err:'not ver',file:''},error:{},check:""})
      }
      geocoder.geocode(send_data.Location, function(err, response) {
        var a = response[0];
        var sql = " UPDATE `sitters`,`users` SET `sitters`.`Location` = "+mysql.escape(send_data.Location)+", `sitters`.`Longitude` = "+a.longitude+", `sitters`.`Latitude` = "+a.latitude+"  WHERE `users`.`Uid` = `sitters`.`Uid` and `users`.`Email` = "+mysql.escape(req.session.email);
        console.log(sql);
        con.query(sql, function (err, rows, fields) {
          if(err) throw err;
          res.redirect('/dashboard/settings');
        });
      });
    }
  }
}
