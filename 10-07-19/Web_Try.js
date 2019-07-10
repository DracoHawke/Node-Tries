var http = require('http');
var dt = require('./myfirstmodule');
//Note: The up here we our including our own module which is in the same folder, denoted by './',to this js file.

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('The current time is: ' + dt.myDateTime());
  res.end('\nHello World!');
}).listen(8080);
