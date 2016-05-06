var setFlagsFromString = require('v8').setFlagsFromString

if (process.versions.node[0] !== '6') {
  setFlagsFromString('--harmony-destructuring')  
}

require('./test')