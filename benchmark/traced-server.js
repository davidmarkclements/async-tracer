'use strict'

var http = require('http')
require('../')(process.stdout)
var server = http.createServer(handle)

function handle (req, res) {
  res.end('hello world')
}

server.listen(3000)
