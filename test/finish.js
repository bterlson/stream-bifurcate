var Tributary = require('../');
var test = require('tape');

test("ending input ends outputs (no data)", function(t) {
  t.plan(2);

  var input = new Tributary();
  var o1 = input.fork();
  var o2 = input.fork();
  o1.on('end', function() {
    t.ok(true, "should be called");
  })

  o2.on('end', function() {
    t.ok(true, "should be called");
  });
  o1.resume();
  o2.resume();
  input.end();
});

test("ending input ends outputs (with data)", function(t) {
  t.plan(6);

  var input = new Tributary();
  var o1 = input.fork();
  var o2 = input.fork();
  o1.on('end', function() {
    t.ok(true, "should be called");
  })

  o2.on('end', function() {
    t.ok(true, "should be called");
  });

  o1.on('data', function(d) {
    t.ok(d === 'a' || d === 'c', 'data for o1')
  })

  o2.on('data', function(d) {
    t.ok(d === 'b' || d === 'd', 'data for o2')
  })

  input.write("a");
  input.write("b");
  input.write("c");
  input.write("d");
  
  input.end();
});
