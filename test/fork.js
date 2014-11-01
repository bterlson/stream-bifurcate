var Tributary = require('../');
var test = require('tape');

test("one distributary", function(t) {
  t.plan(2);

  var input = new Tributary();
  var output = input.fork();
  var expectedChunks = ['a', 'b']
  var seen = 0;


  output.on('data', function(c) {
    t.deepEqual(c, expectedChunks[seen++]);
  });

  expectedChunks.forEach(function(c) { input.write(c) })
  input.end();
})

test("two distributaries", function(t) {
  t.plan(4);

  var input = new Tributary();
  var o1 = input.fork();
  var o2 = input.fork();
  var expectedChunks = ['a', 'b', 'c', 'd']
  var seen = 0;

  o1.on('data', function(c) {
      t.deepEqual(c, expectedChunks[seen++]);
  });

  o2.on('data', function(c) {
      t.deepEqual(c, expectedChunks[seen++]);
  });

  expectedChunks.forEach(function(c) { input.write(c) })
  input.end();
});
