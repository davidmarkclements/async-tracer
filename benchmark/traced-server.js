'use strict'

var http = require('http')
var fs = require('fs')
var tracer = require('../')(fs.createWriteStream('/dev/null'))
var server = http.createServer(handle)

function handle (req, res) {
  res.end('hello world')
}


server.listen(3000)