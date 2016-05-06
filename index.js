var fs = require('fs')
var wrap = process.binding('async_wrap')
var pid = process.pid
var hostname = require('os').hostname()
var util = require('util')
var stringify = require('json-stringify-safe')
var mappings = Object.keys(wrap.Providers)
  .reduce(function (o, k) {
   o[wrap.Providers[k]] = k.replace('WRAP', '')
   return o
  }, {})

module.exports = function (f, opts) {
  var prepareStackTrace = Error.prepareStackTrace
  var stackTraceLimit = Error.stackTraceLimit

  if (typeof f === 'object') {
    if (!f.pipe || !f.cork) {
      opts = f
      f = null
    }
  }

  opts = opts || {}
  var autostart = opts.autostart
  var append = opts.append
  var stacks = opts.stacks
  var suffix = opts.suffix
  var prefix = opts.prefix
  var contexts = opts.contexts

  f = f || 1  

  if (typeof autostart === 'undefined') {
    autostart = true
  }

  if (typeof prefix === 'object') {
    prefix = JSON.stringify(opts.prefix)
    prefix = prefix.substring(1, prefix.length - 1) + ','
  } else {
    prefix = ''
  }

  if (typeof suffix === 'object') {
    suffix = JSON.stringify(opts.suffix)
    suffix = ',' + suffix.substring(1, suffix.length - 1)
  } else {
    suffix = ''
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
    var ctx = this
    ops.set(uid, {op: op, ctx: ctx})
    var parent = parentHandle && 
      parentHandle.constructor.name.toUpperCase().replace('WRAP', '')
    var s = stacks
    write('{' + prefix + '"opid":' + uid + ',"op":"' + op + '",' + '"phase":"init"' + (parent ? ',"parentopid":' + parentUid + ',"parentop":"' + parent + '"' : '') + ',"time":' + Date.now() + (s ? ',"stacks":' + stack() : '') + suffix + '}\n')
  }
  function pre(uid) {
    var state = ops.get(uid)
    var ctx = "ctx:" + stringify(state.ctx)
    write('{' + prefix + '"opid":' + uid + ',"op":"' + state.op + '","phase":"pre","time":' + Date.now() + (contexts ? ',' + ctx : '') + suffix + '}\n')
  }
  function post(uid, threw) {
    var state = ops.get(uid)
    var ctx = "ctx:" + stringify(state.ctx)
    write('{' + prefix + '"opid":' + uid + ',"op":"' + state.op + '","phase":"post"' + (threw ? ',"threw":' + threw : '') + ',"time":' + Date.now() + (contexts ? ',' + ctx : '') + suffix + '}\n')
  }
  function destroy(uid) { 
    write('{' + prefix + '"opid":' + uid + ',"op":"' + ops.get(uid).op + '","phase":"destroy","time":' + Date.now() + suffix + '}\n')
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
    Error.stackTraceLimit = typeof stacks === 'number' ? stacks + 3 : Infinity
    var s = Error().stack
    Error.prepareStackTrace = prepareStackTrace
    return s
  }


}