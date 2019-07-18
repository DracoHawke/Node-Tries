var express = require('express');
var url = require('url');
var bodyparser = require('body-parser');

var app = express();

app.use(bodyparser());
app.use(express.static('./assets'))

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get('/',function(req,res) {
    res.render('index');
});

app.get('/pricing',function(req,res){
  res.render('pricing');
});

app.get('/signin',function(req,res){
  res.render('signin');
});

app.listen(3000);
console.log('listening on port 3000...');
