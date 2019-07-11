var http = require('http');
var dt = require('./myfirstmodule');
//Note: The up here we our including our own module which is in the same folder, denoted by './',to this js file.
var url = require('url');
var fs = require('fs');
var events = require('events');
var eventEmitter = new events.EventEmitter();
//Note: Here, we create our own event using Eventemitter.

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
  // way of updating file, appends data at the end of the file. Also creates new file if file already not present.
  fs.open('mynewfile2.txt', 'w', function (err, file) {
    if (err) throw err;
    console.log('Saved!');
  });
  // takes a "flag" as the second argument, if the flag is "w" for "writing", it is opened for writing. An empty file is created if file not present.
  fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  // way of updating file, replaces all information with new info. Also creates new file if file already not present and writes the data.
  fs.unlink('mynewfile2.txt', function (err) {
    if (err) throw err;
    console.log('File deleted!');
  });
  // The fs.unlink() method deletes the specified file.
  fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
    if (err) throw err;
    console.log('File Renamed!');
  });
  var myEventHandler = function () {
    console.log('I hear a scream!');
  } //Assign the event handler to an event:
  eventEmitter.on('scream', myEventHandler);
  //Fire the 'scream' event:
  eventEmitter.emit('scream');
  // The fs.rename() method renames the specified file.
  res.write(' Hello World!');
}).listen(8080);
