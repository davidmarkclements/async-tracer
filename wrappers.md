
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

## Provider -> Area mappings

```
NONE: 0, -> misc
CRYPTO: 1, ->  crypto
FSEVENTWRAP: 2, -> fs
FSREQWRAP: 3, -> fs
GETADDRINFOREQWRAP: 4, -> dns
GETNAMEINFOREQWRAP: 5, -> dns
HTTPPARSER: 6, -> http
JSSTREAM: 7, -> stream
PIPEWRAP: 8, -> stream
PIPECONNECTWRAP: 9,  -> stream
PROCESSWRAP: 10, -> process
QUERYWRAP: 11,  ->  dns
SHUTDOWNWRAP: 12,  ->  stream
SIGNALWRAP: 13, -> process
STATWATCHER: 14,  -> fs
TCPWRAP: 15, -> net
TCPCONNECTWRAP: 16, -> net
TIMERWRAP: 17, -> timers
TLSWRAP: 18,  -> tls
TTYWRAP: 19,   -> tty
UDPWRAP: 20,   -> dgram
UDPSENDWRAP: 21, -> dgram
WRITEWRAP: 22,  ->  stream
ZLIB: 23 -> zlib
```

## Area -> Provider Number mappings

```
0: misc
1: crypto
2: fs
3: fs
4: dns
5: dns
6: http
7: stream
8: stream
9: stream
10: process
11: dns
12: stream
13: process
14: fs
15: net
16: net
17: timers
18: tls
19: tty
20: dgram
21: dgram
22: stream
23: zlib
```
