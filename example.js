var http = require('http')
var fs = require('fs')
var tracer = require('async-tracer')()

http.createServer(function (req, res) {
  res.end('hello world')
}).listen(3000)