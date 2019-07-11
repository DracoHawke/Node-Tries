var express = require('express');
var url = require('url');
var bodyparser = require('body-parser');
var expresslayouts = require('express-ejs-layouts');
var app = express();

var url1 = bodyparser.urlencoded({extended: false});
app.use(expresslayouts);
app.use('/assets', express.static('assets'))

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false } );

app.get('/Node',function(req,res) {
    res.send("Tutorial on Node");
});
app.get('/Angular',function(req,res) {
    res.send("Tutorial on Angular");
});
app.get('/', function(req, res) {
	 res.render('index', {
     people: [
       {name: 'dave'},
       {name: 'jonathan'}
     ]
   });
});
app.post('/submition', url1,function(req,res){
    var q = url.parse(req.url, true);
    var qdata = q.query;
    console.log(qdata);
    res.render('submission',{qdata});
    // or you can use this {q:req.query} instead of {qdata};
})
app.get('/about', function(req, res) {
	 res.render('about');
});

app.listen(3000);
console.log('listening on port 3000...');
