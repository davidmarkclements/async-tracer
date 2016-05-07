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
var areaMap = [
  'misc','crypto','fs','fs','dns','dns','http','stream','stream','stream',
  'process','dns','stream','process','fs','net','net','timers','tls','tty',
  'dgram','dgram','stream','zlib'
]

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
  var legacy = false
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
    // covers 5.9.1 down to 5, 4 and below is legacy
    legacy = (process.version[1] !== '5')
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
      fs.write(f, s + '', enable)
    }
  }

  function init(uid, provider, parentUid, parentHandle) {
    if (legacy) {
      Object.defineProperty(this, '_legacy_uid', {value: provider})
      provider = uid
      uid = this._legacy_uid
    }

    var op = mappings[provider]
    var area = areaMap[provider]
    var ctx = contexts ? this : null
    ops.set(uid, {op: op, ctx: ctx, area: area})
    var parent = parentHandle && 
      parentHandle.constructor.name.toUpperCase().replace('WRAP', '')
    var s = stacks
    write('{' + prefix + '"opid":' + uid + ',"op":"' + op + '",' + '"phase":"init","area":"' + area + '"' + (parent ? ',"parentopid":' + parentUid + ',"parentop":"' + parent + '"' : '') + ',"time":' + Date.now() + (s ? ',"stacks":' + stack() : '') + suffix + '}\n')
  }
  function pre(uid) {
    uid = uid || this._legacy_uid
    var state = ops.get(uid)
    var ctx = state.ctx
    write('{' + prefix + '"opid":' + uid + ',"op":"' + state.op + '","phase":"pre","area":"' + state.area + '","time":' + Date.now() + (ctx ? ",ctx:" + stringify(ctx) : '') + suffix + '}\n')
  }
  function post(uid, threw) {
    uid = uid || this._legacy_uid
    var state = ops.get(uid)
    var ctx = state.ctx
    write('{' + prefix + '"opid":' + uid + ',"op":"' + state.op + '","phase":"post","area":"' + state.area + '"' + (threw ? ',"threw":' + threw : '') + ',"time":' + Date.now() + (ctx ? ",ctx:" + stringify(ctx) : '') + suffix + '}\n')
  }
  function destroy(uid) { 
    var state = ops.get(uid)
    write('{' + prefix + '"opid":' + uid + ',"op":"' + state.op + '","phase":"destroy","area":"' + state.area + '","time":' + Date.now() + suffix + '}\n')
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