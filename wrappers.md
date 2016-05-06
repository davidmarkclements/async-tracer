
## Provider -> Context mappings

```
NONE: 0,
CRYPTO: 1, ->  process.binding('crypto').randomBytes(0, function(){}).constructor
FSEVENTWRAP: 2, -> process.binding('fs_event_wrap').FSEvent
FSREQWRAP: 3, -> process.binding('fs').FSReqWrap
GETADDRINFOREQWRAP: 4, -> process.binding('cares_wrap').GetAddrInfoReqWrap
GETNAMEINFOREQWRAP: 5, -> process.binding('cares_wrap').GetNameInfoReqWrap
HTTPPARSER: 6, -> process.binding('http_parser').HTTPParser
JSSTREAM: 7, -> process.binding('js_stream').JSStream
PIPEWRAP: 8, -> process.binding('pipe_wrap').Pipe
PIPECONNECTWRAP: 9,  -> process.binding('pipe_wrap').PipeConnectWrap
PROCESSWRAP: 10, -> process.binding('process_wrap').Process
QUERYWRAP: 11,  ->  process.binding('cares_wrap').QueryReqWrap
SHUTDOWNWRAP: 12,  ->  process.binding('stream_wrap').ShutdownWrap
SIGNALWRAP: 13, -> process.binding('signal_wrap').Signal
STATWATCHER: 14,  -> process.binding('fs').StatWatcher
TCPWRAP: 15, -> process.binding('tcp_wrap').TCP
TCPCONNECTWRAP: 16, -> process.binding('tcp_wrap').TCPConnectWrap
TIMERWRAP: 17, -> process.binding('timer_wrap').Timer
TLSWRAP: 18,  -> process.binding('tls_wrap').TLSWrap  (process.binding('tls_wrap').wrap ?)
TTYWRAP: 19,   -> process.binding('tty_wrap').TTY
UDPWRAP: 20,   -> process.binding('udp_wrap').UDP
UDPSENDWRAP: 21, -> process.binding('udp_wrap').SendWrap
WRITEWRAP: 22,  ->  process.binding('stream_wrap').WriteWrap
ZLIB: 23 -> process.binding('zlib').Zlib
```

