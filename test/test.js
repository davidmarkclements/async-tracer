'use strict'
const PORT = 12346
const domain = require('domain')
const {test} = require('tap')
const net = require('net')
const dgram = require('dgram')
const fs = require('fs')
const tracer = require('../')('/dev/null', {suffix: {some: 'data'}, prefix: {other: 'data'}})
const {parse} = JSON
const fivePlus = process.versions.node[0] === '6' || process.versions.node[0] === '5'
fs.write = (f, s, cb) => {
  checker(f, s)
  cb()
}

const checker = (f, s) => {
  let fn = checker.q.shift()
  if (fn) { fn(s) }
}
checker.q = []

const check = (fn) => {
  if (Array.isArray(fn)) {
    checker.q.push.apply(checker.q, fn)
    return
  }
  checker.q.push(fn)
}

test('net', ({is, end}) => {
  
  process.nextTick(() => {
    const server = net.createServer((s) => {
      s.end()
      server.close()
    })

    server.listen(PORT)

    process.nextTick(() => {
      const client = net.connect(PORT)

      client.end('meow')
    })
  })


  check([ 
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'GETADDRINFOREQ')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'GETADDRINFOREQ')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCPCONNECT')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'GETADDRINFOREQ')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'GETADDRINFOREQ')
      is(phase, 'destroy')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'SHUTDOWN')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCPCONNECT')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'SHUTDOWN')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCPCONNECT')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCPCONNECT')
      is(phase, 'destroy')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'destroy')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'SHUTDOWN')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'SHUTDOWN')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'SHUTDOWN')
      is(phase, 'destroy')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'SHUTDOWN')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'SHUTDOWN')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'SHUTDOWN')
      is(phase, 'destroy')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'destroy')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TCP')
      is(phase, 'destroy')
      end()
    } 
  ])
})

test('setTimeout', ({is, end}) => {
  check([
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TIMER')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TIMER')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TIMER')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'TIMER')
      is(phase, 'destroy')
      end()
    }
  ])
  process.nextTick(() => setTimeout(() => {}))
})


if (fivePlus) {
  test('threw', ({is, teardown, end}) => {
    check([
      null,
      null,
      (s) => {
        const {op, phase, threw} = parse(s)
        is(op, 'TIMER')
        is(phase, 'post')
        is(threw, true)
        end()
      }
    ])

    process.nextTick(() =>
      domain.create()
        .on('error', () => {})
        .run(() => {
          setTimeout(() => {
            throw Error()
          })
        })
    )
  })
}

test('dgram', ({is, end}) => {
  process.nextTick(() => {
    const server = dgram.createSocket('udp4')
    server.bind(PORT)
    server.close()
  })

  check([
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'UDP')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'UDP')
      is(phase, 'destroy')
      end()
    }
  ])

})

test('fs', ({is, end}) => {
  process.nextTick(() => {
    fs.stat('/dev/random', () => { })  
  })

  check([
    null, //ignore stray timer op in 5+
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'FSREQ')
      is(phase, 'init')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'FSREQ')
      is(phase, 'pre')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'FSREQ')
      is(phase, 'post')
    },
    (s) => {
      const {op, phase} = parse(s)
      is(op, 'FSREQ')
      is(phase, 'destroy')
      end()
    }
  ].slice(fivePlus ? 0 : 1))
  
})

test('prefix & suffix', ({is, end}) => {
  check([
    (s) => {
      const {some, other} = parse(s)
      is(some, 'data')
      is(other, 'data')
      end()
    }
  ])

  process.nextTick(() => {
    setTimeout(()=> {})  
  })
  

})

