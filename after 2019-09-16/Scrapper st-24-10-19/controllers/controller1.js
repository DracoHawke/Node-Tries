var url = require('url');
//var bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const formidable = require('formidable');
var Joi = require('@hapi/joi');
const got = require('got');

var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'dogmate',
};

var sessionStore = new MySQLStore(options);

module.exports = function(app){

  var server = require('http').Server(app);
  server.listen(40001);

  var con = db_connect();

  var urlFile = fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "./public/assets/temp"
  });

  app.get('/',urlencodedParser,function(req,res){
    count++;
    homepage(req,res);
  });

  app.post('/geturl',urlFile,function(req,res) {
    async () => {
    	try {
    		const response = await got('https://google.com');
    		console.log(response.body);
    		//=> '<!doctype html> ...'
    	} catch (error) {
    		console.log(error.response.body);
    		//=> 'Internal server error ...'
    	}
    }
  })

}
