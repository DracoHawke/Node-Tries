var express = require('express');
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000;
var app = express();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'practice1'
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
connection.connect();

app.get('/products', function(req, res) {
  connection.query('SELECT * from emails', function(err, rows, fields) {
    if (!err){
      console.log('The solution is: ', rows);
      res.send({products: rows});
    }
    else
      console.log('Error while performing Query.');
  });
});

app.post('/products', function(req, res) {
    console.log(req.body);
    var data = req.body;
    let insertQuery = 'INSERT INTO ?? VALUES (?,?,?,?,?,?,?,?,?,?)';
    let query = mysql.format(insertQuery,["emails",data.sno,data.fname,data.lname,data.email,data.address,data.gender,data.subjects,data.sports,data.password,data.path1]);
    connection.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log(response.insertId);
    });
    res.send('Successfully created product!');
});

app.put('/products/:id', function(req, res) {
    var id = req.params.id;
    var newName = req.body.newName;

    var found = false;

    products.forEach(function(product, index) {
        if (!found && product.id === Number(id)) {
            product.name = newName;
        }
    });

    res.send('Succesfully updated product!');
});

app.delete('/products/:id', function(req, res) {
    var id = req.params.id;

    var found = false;

    products.forEach(function(product, index) {
        if (!found && product.id === Number(id)) {
            products.splice(index, 1);
        }
    });

    res.send('Successfully deleted product!');
});

app.listen(port, function() {
    console.log('Server listening on ' + port);
});
