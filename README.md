# stream-bifurcate

Bifurcates (forks) a stream into one or more distributaries. Chunks are written to only one distributary. Efforts are made to respect back pressure and not overload slow distributaries.

# Example
```js
var Tributary = require('stream-bifurcate');
var trb = new Tributary();

var o1 = trb.fork();
var o2 = trb.fork();

o1.on('data', function(d) { console.log(1, d) })
o2.on('data', function(d) { console.log(2, d) })

trb.write("one");
trb.write("two");

// Output:
// 1 'one'
// 2 'two
```

# API

## Tributary
A writable stream. Writes to the tributary are written to one of its distributaries.

### fork()
Returns a new Distributary and adds the distributary as a fork of this tributary. See example above.

## Distributary
A readable stream.
