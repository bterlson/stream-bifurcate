var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var util = require('util');

module.exports = Tributary;

util.inherits(Tributary, Writable);
function Tributary() {
    var self = this;
    Writable.call(this, { objectMode: true });

    this.forks = [];
    this._queue = [];
    this._waiting = [];
    this._closed = false;

    this.on('finish', function() {
        self._closed = true;
        self._drain();
    })
}

Tributary.prototype.fork = function() {
    this.forks.push(new Distributary(this));
    return this.forks[this.forks.length - 1];
}

Tributary.prototype._write = function(chunk, enc, cb) {
    this._queue.push([chunk, cb]);
    this._drain();
}

Tributary.prototype._drain = function() {
    if(this.forks.length === 0) return;
    if(this._queue.length === 0) {
        if(this._closed) this._closeDistributaries();
        return;
    }
    if(this._waiting.length === 0) return;

    var job = this._queue.shift();
    
    // find most empty waiting stream
    var index = this._waiting.reduce(function(least, f, i, arr) {
        if(arr[i]._readableState.buffer.length < arr[least]._readableState.buffer.length)
            return i;
        
        return least;
    }, 0);

    var s = this._waiting.splice(index, 1)[0];
    s.push(job[0])
    job[1]();
}

Tributary.prototype._closeDistributaries = function() {
    this.forks.forEach(function(f) {
        f.push(null);
    })
}

util.inherits(Distributary, Readable);
function Distributary(trib) {
    Readable.call(this, { objectMode: true });
    this._tributary = trib;
}

Distributary.prototype._read = function() {
    if(!this._tributary._waiting.indexOf(this) > -1) {
        this._tributary._waiting.push(this);
    }

    this._tributary._drain();
}
