var http = require('http')
var fs = require('fs')
var tracer = require('./')()

http.createServer(function (req, res) {
  res.end('hello world')
}).listen(3000)