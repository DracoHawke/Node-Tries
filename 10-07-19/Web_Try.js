var http = require('http');
var dt = require('./myfirstmodule');
var url = require('url');
var fs = require('fs');
//Note: The up here we our including our own module which is in the same folder, denoted by './',to this js file.

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('The current time is: ' + dt.myDateTime() + " ");
  //res.write(req.url+" ");
  //var q = url.parse(req.url, true).query;
  //var txt =  "  " + q.year + " " + q.month + "  ";
  //res.write(txt + " ");
  fs.readFile('demofile1.html', function(err, data) {
    //if (err) throw err;
    //res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
  fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
});
  res.write(' Hello World!');
}).listen(8080);
