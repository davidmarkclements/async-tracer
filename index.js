var fs = require('fs')
var wrap = process.binding('async_wrap')
var pid = process.pid
var hostname = require('os').hostname()

var mappings = Object.keys(wrap.Providers)
  .reduce(function (o, k) {
   o[wrap.Providers[k]] = k.replace('WRAP', '')
   return o
  }, {})


module.exports = function (f, opts) {
  var prepareStackTrace = Error.prepareStackTrace
  var stackTraceLimit = Error.stackTraceLimit

  opts = opts || {}
  var autostart = opts.autostart
  var append = opts.append
  var stacks = opts.stacks
  var inject = opts.inject || ''

  f = f || 1  

  if (typeof autostart === 'undefined') {
    autostart = true
  }

  if (typeof inject === 'object') {
    inject = JSON.stringify(opts.inject)
    inject = ',' + inject.substring(1, inject.length - 1)
  } else {
    inject = ''
  }

  if (typeof f === 'string') {
    f = fs.openSync(f, append ? 'a' : 'w')
  }
  var ops = new Map
  var enable = function () { wrap.enable() }
  var disable = function () { wrap.disable() }

  try { 
    wrap.setupHooks({init: init, pre: pre, post: post, destroy: destroy})
  } catch(e) {
    wrap.setupHooks(init, pre, post, destroy)
  }
  
  if (autostart) { enable() }

  var writing = false

  return {
    enable: enable,
    disable: disable
  }

  function write(s) {
    disable()
    if (f.pipe && f.cork) {
      f.write(s, enable)
    } else {
      fs.write(f, s, enable)      
    }
  }

  function init(uid, provider, parentUid, parentHandle) {
    var op = mappings[provider]
    ops.set(uid, op)
    var parent = parentHandle && 
      parentHandle.constructor.name.toUpperCase().replace('WRAP', '')
    var s = stacks
    write('{"op":"' + op + '",' + (parent ? '"parentOp":"' + parent + '",' : '') + '"phase":"init"' + ',"pid":' + pid + ',"hostname":"' + hostname + '","time":' + Date.now() + (s ? ',"stacks":' + stack() : '') + inject + '}\n')
  }
  function pre(uid) {
    write('{"op":"' + ops.get(uid) + '","phase":"pre","pid":' + pid + ',"hostname":"' + hostname + '","time":' + Date.now() + inject + '}\n')
  }
  function post(uid, threw) {
    write('{"op":"' + ops.get(uid) + '","phase":"post"' + (threw ? ',"threw":' + threw : '') + ',"pid":' + pid + ',"hostname":"' + hostname + '","time":' + Date.now() + inject + '}\n')
  }
  function destroy(uid) { 
    write('{"op":"' + ops.get(uid) + '","phase":"destroy","pid":' + pid + ',"hostname":"' + hostname + '","time":' + Date.now() + inject + '}\n')
    ops.delete(uid)
  }
  function stack() {
    Error.prepareStackTrace = function (s, frames) {
      var stacks = '['
      var f
      var i = 3
      var len = frames.length

      for (i; i < len; i++) {
        f = frames[i]
        stacks += '"' + (f.getFunctionName() || f.getMethodName() || '') + ':' + 
          f.getFileName() + ':' + f.getLineNumber() + ':' + f.getColumnNumber() + '"' +
          (i === len - 1 ? '' : ',')
      }

      return stacks + ']'
    }
    Error.stackTraceLimit = Infinity
    var s = Error().stack
    Error.prepareStackTrace = prepareStackTrace
    return s
  }


}