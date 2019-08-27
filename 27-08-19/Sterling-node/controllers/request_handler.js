const fileUpload = require('express-fileupload');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

module.exports = function(app) {
  var server = require('http').Server(app);

  server.listen(12130);
  console.log('listening on port 12130...');

  var urlFile = fileUpload({
   createParentPath: true,
   useTempFiles: true,
   tempFileDir: "/public/assets/temp"
  });

  var urlencodedParser = bodyparser.urlencoded({extended:false});

  app.get('/',function(req,res){
    res.render('index');
  })

  app.get('*',function(req,res){
    res.render('notfound');
  })
}
