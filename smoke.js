var dns = require('dns')
var trace = require('./')(process.stdout)


process.stdin.resume()
dns.lookup('example.com', () => {
  setTimeout(() => {
    process.stdin.destroy()
  }, 100)  
})
  

