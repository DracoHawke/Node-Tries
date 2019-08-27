var express = require('express');
var send_requests = require('./controllers/request_handler');

var app = express();
app.set('view engine','ejs');
app.use(express.static('./public'));
app.set("views", __dirname + "/views");
send_requests(app);
