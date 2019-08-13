var express = require('express');
var collectData = require('./public/assets/javascript/controllers/controller1');


var app = express();
app.use(express.static('./public'))
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
collectData(app);
