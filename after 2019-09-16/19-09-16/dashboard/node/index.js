var express = require('express');
var collectData = require('./controllers/controller');

var app = express();
app.set('view engine','ejs');
app.use(express.static('./public'));
collectData(app);
