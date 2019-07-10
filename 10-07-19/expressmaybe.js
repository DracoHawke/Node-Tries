var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

//app.listen(80,"172.31.16.218");
//console.log('Server running at http://172.31.16.218:80/');

app.route('/Node').get(function(req,res) {
    res.send("Tutorial on Node");
});
app.route('/Angular').get(function(req,res) {
    res.send("Tutorial on Angular");
});
app.get('/', function(req,res){
    res.send('Welcome to Guru99 Tutorials');
});
var server=app.listen(3000,function() {});
