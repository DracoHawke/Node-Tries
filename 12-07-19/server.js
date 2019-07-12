var express = require('express');
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000;
var app = express();

var products =[
  {
    id:1,
    name:'rohan'
  },
  {
    id:2,
    name:'paras'
  }
];

var currentId=2;

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/products', function(req, res) {
    res.send({ products: products });
});

app.post('/products', function(req, res) {
    console.log(req.body);
    var productName = req.body.name;
    currentId++;

    products.push({
        id: currentId,
        name: productName
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
