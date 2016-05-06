# async-tracer

Trace all async operations, output as newline delimited JSON logs,
with minimal overhead.

## Examples


### Write to a stream

```js
require('async-tracer')(process.stderr)
```

### Write to a path

```js
require('async-tracer')('/var/async.' + process.pid + '.log')
```

### Write to a file handle

```js
require('async-tracer')(1) // 1 is STDOUT, default
require('async-tracer')() //same thing
```


## API

```js
require('async-tracer') => (WritableStream, opts) => {enable, disable}
```

```js
require('async-tracer') => (String: path, ops) => {enable, disable}
```

```js
require('async-tracer') => (Number: handle, opts) => {enable, disable}
```

### Interface

#### `enable`

Start tracing (will start automatically if `autostart` option is `true`)

#### `disable`

Stop all tracing

### Opts

#### `autostart` [default: `true`] `Boolean`

Begin tracing immediately

#### `append` [default: `false`] `Boolean`

Only applies to when a path is supplied, opens file with `a` flag
instead of `w` flag.

#### `inject` [default: `undefined`] `Object`

Additional data to attach to each log message.

#### `stacks` [default: `false`] `Boolean`

If `true` then include an array of call sites in
each `init` log. The stacks array takes the following form:

```
["functionName:fileName:lineNum:colNum"]
```

## Benchmarks

Overhead of using `async-tracer` is minimal

```sh
npm run benchmark
```

```
Profiling traced server for 10 seconds
Running 10s test @ http://localhost:3000
10 connections with 10 pipelining factor

Stat         Avg      Stdev     Max
Latency (ms) 0.21     0.65      36
Req/Sec      38101.82 1252.42   39327
Bytes/Sec    4.25 MB  141.99 kB 4.46 MB

4190k requests in 10s, 46.52 MB read
Profiling control server for 10 seconds
Running 10s test @ http://localhost:3000
10 connections with 10 pipelining factor

Stat         Avg      Stdev     Max
Latency (ms) 0.18     0.58      35
Req/Sec      41098.19 1571.58   42783
Bytes/Sec    4.57 MB  193.79 kB 4.98 MB

4520k requests in 10s, 50.18 MB read
```

## Test

```sh
npm test
```

## License

MIT

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)