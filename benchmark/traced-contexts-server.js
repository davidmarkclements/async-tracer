'use strict'

var http = require('http')
require('../')(process.stdout, {contexts: true})
var server = http.createServer(handle)

function handle (req, res) {
  res.end('hello world')
}

server.listen(3000)
