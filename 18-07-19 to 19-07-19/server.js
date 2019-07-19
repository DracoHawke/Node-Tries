var express = require('express');
var url = require('url');
var bodyparser = require('body-parser');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'dogmate'
});
connection.connect();
var app = express();

app.use(bodyparser());
app.use(express.static('./assets'))

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get('/',function(req,res) {
  console.log("ok");
    res.render('index');
});

app.get('/pricing',function(req,res){
  console.log("im in 1");
  res.render('pricing');
});

app.get('/pricing/:id',function(req,res){
  console.log("i'm in");
  var id = req.params.id;
  if (Number(id)==0){
    var email = req.query.email;
    var password = req.query.password;
    connection.query('SELECT users.U_password from users where users.Email = "' + email +'"', function(err, rows, fields) {
      if (!err){
        var err = 0;
        if(rows.length == 1){
          console.log('nooooo');
          if(String(rows[0].U_password) == String(password)){
            console.log('yessssssssssss');
            //res.redirect('/');
          }
          else{
            console.log('noooooooooo');
            err = 1;
          }
        }
        else{
          err = 1;
          console.log('The solution is: ', rows);
        }
        if(err == 0){
          res.send('Yes');
        }
        else{
          res.send('Wrong Email/Password');
        }
      }
      else{
        console.log('Error while performing Query.');
        console.log('err');
        //res.send(err);
      }
    });
  }
});

app.listen(3000);
console.log('listening on port 3000...');
