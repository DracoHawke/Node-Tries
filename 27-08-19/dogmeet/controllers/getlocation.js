var NodeGeocoder = require('node-geocoder');
var mysql = require('mysql');
var db_connect = require('./db-connect');
setvalues = require('./setvalues');

var con = db_connect();

var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: '8f1210175c204ffc9c7bce586508e231'
});

module.exports = function(req, res, check, send_data){
  console.log(check);
  console.log("body: ", req.body);
  if(check == "getback"){
    if(send_data){
      if(send_data.Location == null){
        res.redirect('/dashboard');
      }
      geocoder.geocode(send_data.Location, function(err, response) {
        var a = response[0];
        if(typeof a !== "undefined") {
          var sql = " UPDATE `sitters`,`users` SET `sitters`.`Location` = "+mysql.escape(send_data.Location)+", `sitters`.`Longitude` = "+a.longitude+", `sitters`.`Latitude` = "+a.latitude+"  WHERE `users`.`Uid` = `sitters`.`Uid` and `users`.`Email` = "+mysql.escape(req.session.email);
          console.log(sql);
          con.query(sql, function (err, rows, fields) {
            if(err) throw err;
            res.redirect('/dashboard/setsuccess');
          });
        }
        else {
          res.redirect('/dashboard/settings');
        }
      });
    }
  }
  else if(check == "setnew"){
    if(send_data){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
      geocoder.geocode(send_data.Location, function(err, response) {
        var a = response[0];
        if(typeof a === "undefined") {
          res.redirect("back");
        }
        else if(typeof a !== "undefined") {
          var sql = " UPDATE `sitters`,`users` SET `sitters`.`Location` = "+mysql.escape(send_data.Location)+", `sitters`.`Longitude` = "+a.longitude+", `sitters`.`Latitude` = "+a.latitude+"  WHERE `users`.`Uid` = `sitters`.`Uid` and `users`.`Email` = "+mysql.escape(req.session.email);
          console.log(sql);
          con.query(sql, function (err, rows, fields) {
            if(err) throw err;
            res.redirect('/dashboard/setsuccess');
          });
        }
        else{
          res.redirect('/dashboard/settings');
        }
      });
    }
  }
  else if(check == "newlocation") {
    geocoder.geocode(req.body.locationnew, function(err, response) {
      console.log(response);
      var a = response[0];
      if(typeof a === "undefined") {
        res.redirect("back");
      }
      else if(typeof a !== "undefined"){
        var sql = " UPDATE `sitters`,`users` SET `sitters`.`Location` = "+mysql.escape(req.body.locationnew)+", `sitters`.`Longitude` = "+a.longitude+", `sitters`.`Latitude` = "+a.latitude+"  WHERE `users`.`Uid` = `sitters`.`Uid` and `users`.`Email` = "+mysql.escape(req.session.email);
        console.log(sql);
        con.query(sql, function (err, rows, fields) {
          if(err) throw err;
          if(req.body.rangebar) {
            setvalues(req,res);
          }
          else{
            res.redirect('/dashboard/myacc');
          }
        });
      }
      else{
        res.redirect('/dashboard/myacc');
      }
    });
  }
  else if(check != "getback" ){
    geocoder.geocode(req.body.location, function(err, response) {
      console.log(response);
      var a = response[0];
      if(typeof a === "undefined"){
        res.redirect("back");
      }
      else if(typeof a !== "undefined"){
        var sql = " UPDATE `sitters`,`users` SET `sitters`.`Location` = " + mysql.escape(req.body.location) + ", `sitters`.`Longitude` = "+a.longitude+", `sitters`.`Latitude` = "+a.latitude+"  WHERE `users`.`Uid` = `sitters`.`Uid` and `users`.`Email` = "+mysql.escape(req.session.email);
        console.log(sql);
        con.query(sql, function (err, rows, fields) {
          if(err) throw err;
          res.redirect('/dashboard/myacc');
        });
      }
      else{
        res.redirect('/dashboard/myacc');
      }
    });
  }
}
