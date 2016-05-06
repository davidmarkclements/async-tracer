const {setFlagsFromString} = require('v8')

if (process.versions.node[0] !== '6') {
  setFlagsFromString('--harmony-destructuring')  
}

require('./test')