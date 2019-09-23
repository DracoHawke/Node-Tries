//node modules
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const fileUpload = require('express-fileupload');
const formidable = require('formidable');
const mysql = require('mysql');
const Joi = require('@hapi/joi');
const randombytes = require('randombytes');
const URL = require('url');

db_connect = require('./db-connect');
getformlist = require('./getformlist');
getformdata = require('./getformdata');
getknownroutes = require('./getknownroutes');

con = db_connect();

module.exports = function(app){
  var urlFile = fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "./public/assets/temp"
  });

  var urlencodedParser = bodyParser.urlencoded({extended:false});
  app.use(urlencodedParser);

  app.get('/',urlencodedParser,function(req,res) {
    res.render('index');
  })

  app.get('/newpage',function(req,res){
    res.render('newpage');
  })

  app.post('/savetemp/:id',urlFile,function(req,res) {
    //console.log(req.body);
    var data = req.body.data;
    var formname = mysql.escape(req.body.formname);
    console.log(req.body.names);
    var names = mysql.escape(req.body.names);
    //console.log(data);
    data = data + "<button type='submit' class='btn-theme'>Submit</button><button type='reset' class='btn-danger' value='Reset'>Reset</button>";
    var data1 = mysql.escape(data);
    //console.log(data1);
    if(req.params.id == 0){
      var sql = "INSERT INTO `forms`(`FormName`,`Data`,`Names`) VALUES ("+formname+","+data1+","+names+")";
      //res.send("success1");
      con.query(sql,function(err,result1){
        if(err){ throw err; res.send("sql_error1")}
        else{
          console.log("succesful");
          res.send("succcess1");
        }
      })
      console.log(sql);
    }
  })

  app.get('/getformlist',function(req,res){
    getformlist(req,res);
  })

  app.get('/getformdata',function(req,res) {
    getformdata(req,res);
  })

  app.post('/createnewlink',urlFile,function(req,res){
    var data = req.body.content;
    console.log(data);
    var route_name = req.body.name;
    route_name = route_name.replace(/ /gi, "");
    data = mysql.escape(data);
    data = data.substr(1,data.length-2);
    //console.log(data);
    route_name = mysql.escape(route_name);
    console.log(route_name);
    route_name = route_name.substr(1,route_name.length -2);
    console.log(route_name);
    var sql = "SELECT * , MAX(Id) AS max FROM `routes`";
    con.query(sql,function(err,rows1) {
      if(err) throw err;
      var max = rows1[0].max;
      console.log("generating new route, max: ", max);
      if(max == null) {
        var link = "/"+route_name+"_1";
        var sql2 = "INSERT INTO `routes`(`Route`,`Page`) VALUES ('/"+(route_name+'_1')+"', '"+data+"')";
      }
      else {
        var link = "/"+route_name+"_"+max;
        var sql2 = "INSERT INTO `routes`(`Route`,`Page`) VALUES ('/"+route_name+"_"+max+"', '"+data+"')"
      }
      console.log("sql2: ",sql2);
      con.query(sql2,function(err,results) {
        if(err) throw err;
        console.log(link);
        res.send("successful1"+link);
      })
    })
  })

  app.get('/getdataofpage/:id',function(req,res){
    console.log(req.params.id);
    if(typeof(req.params) !== "undefined" && Number(req.params.id) == 1 && typeof(req.query) !== "undefined" && Number(req.query.route) != "") {
      console.log(req.query.route);
      req.query.route = req.query.route.substr(1,req.query.route.length-2);
      console.log(req.query.route);
      req.query.route = mysql.escape(req.query.route);
      var sql = "SELECT `routes`.`Page` FROM `routes` WHERE `routes`.`Route` = "+req.query.route;
      console.log(sql);
      con.query(sql,function(err,rows1) {
        if(err) throw err;
        if(rows1.length == 0) {
          res.send("");
        }
        else{
          console.log(rows1[0].Page);
          res.send(rows1[0].Page);
        }
      })
    }
  })

  app.get('/getknownroutes',function(req,res) {
    getknownroutes(req,res);
  })

  app.get('/getknownroutes/:id',function(req,res) {
    var url = req.params.id;
    var url_parts = URL.parse(req.url, true);
    console.log(url_parts);
    var sql = "SELECT * FROM `routes` WHERE `routes`.`Route` = "+mysql.escape(url);
    console.log(sql);
    /*con.query(sql,function(err,rows) {
      if(err) throw err;
      if(rows.length == 0) {
        //res.redirect("back");
      }
      else {
        res.render('index',{data:rows[0].Page});
      }
    })*/
  });
  /*
  app.get("*",function(req,res) {
    var url_parts = URL.parse(req.url, true);
    console.log(url_parts);
    //var index = req.url.lastIndexOf('?');console.log(index);var url = req.url.substr(0,index);console.log(url);
    var url = url_parts.pathname;
    var sql = "SELECT * FROM `routes` WHERE `routes`.`Route` = "+mysql.escape(url);
    console.log(sql);
    con.query(sql,function(err,rows) {
      if(err) throw err;
      if(rows.length == 0) {
        //res.redirect("back");
      }
      else {
        res.render('index',{data:rows[0].Page});
      }
    })
  })
*/
  app.listen(3000, () => console.log("server started on port : 3000"));
}
