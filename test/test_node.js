#! /usr/bin/env node

var assert = require('assert');
var Rubylike = require('../rubylike.js').Rubylike;
var testCase = require('./test_array.js').testCase.Array
	.concat(require('./test_hash.js').testCase.Hash);
var i, len;

Array.prototype.foo = function () {return [3,2,1]};
Array.prototype._foo = function () {return [3,2,1]};

assert.ok(typeof Rubylike === 'function');
assert.throws(function(){ Rubylike() });
assert.ok(1 < Rubylike.Array.new().methods().length);
assert.ok(Rubylike.is_defined === false);
for (i = 0, len = testCase.length; i < len; i += 1) {
	testCase[i]();
}
Rubylike(function(R){
	assert.ok(Rubylike === R);
	assert.ok(Rubylike.is_defined === true);
	for (i = 0, len = testCase.length; i < len; i += 1) {
		testCase[i]();
	}
//	var hash = [];
//	for (var i = 0; i < 1000000; i++) {
//		hash.push(i);
//	}
//	console.time('flatten');
//	hash.clone();
//	console.timeEnd('flatten');
});
assert.ok(Rubylike.is_defined === false);
Rubylike(function(R){
	assert.ok(Rubylike === R);
	assert.ok(Rubylike.is_defined === true);
	for (i = 0, len = testCase.length; i < len; i += 1) {
		testCase[i]();
	}
});
assert.ok(Rubylike.is_defined === false);
Rubylike(function(R){
	assert.ok(Rubylike === R);
	assert.ok(Rubylike.is_defined === true);
	for (i = 0, len = testCase.length; i < len; i += 1) {
		testCase[i]();
	}
});
assert.ok(Rubylike.is_defined === false);
for (i = 0, len = testCase.length; i < len; i += 1) {
	testCase[i]();
}
//console.log(process.memoryUsage()['heapUsed'] / 1024 + ' KB');
assert.deepEqual([].foo(), [3,2,1]);
assert.deepEqual([]._foo(), [3,2,1]);

