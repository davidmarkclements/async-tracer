var spawn = require('child_process').spawn
var path = require('path')
var autocannon = path.join(__dirname, '..', 'node_modules', '.bin', 'autocannon')
var flags = [
  '-d', '10', '-p', '10', 'http://localhost:3000'
]
var opts = {stdio: 'inherit'}
var server = spawn('node', [path.join(__dirname, 'traced-server')])

console.log('Profiling traced server for 10 seconds')
spawn(autocannon, flags, opts)
  .on('exit', function () {
    server.kill()
    var traced = spawn('node', [path.join(__dirname, 'server')])
    console.log('Profiling control server for 10 seconds')
    spawn(autocannon, flags, opts)
      .on('exit', function () {
        traced.kill()
      })
  })
