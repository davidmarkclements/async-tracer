var spawn = require('child_process').spawn
var path = require('path')
var autocannon = path.join(__dirname, '..', 'node_modules', '.bin', 'autocannon')
var flags = [
  '-d', '10', '-p', '10', 'http://localhost:3000'
]
var opts = {stdio: 'inherit'}



var queue = (~process.argv.indexOf('--opts-compare')) ?
  [bench('traced-contexts', 'traced-contexts-server'), bench('traced-stacks', 'traced-stacks-server'), bench('traced', 'traced-server')] :
  [bench('traced', 'traced-server'), bench('control', 'server')]

queue.shift()()

function bench (name, file) {
  return function () {
    console.log('Profiling ' + name + ' server for 10 seconds')
    var server = spawn('node', [path.join(__dirname, file)])
    spawn(autocannon, flags, opts)
      .on('exit', function () {
        server.kill()
        server.on('exit', function () {
          var next = queue.shift()
          if (next) next()
        })
      })
  }
}




