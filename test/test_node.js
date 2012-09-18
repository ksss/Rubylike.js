#! /usr/bin/env node
var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = require('./test_array.js').testCase;

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
});
assert.ok(Rubylike.is_defined === false);
for (i = 0, len = testCase.length; i < len; i += 1) {
	testCase[i]();
}

assert.deepEqual([].foo(), [3,2,1]);
assert.deepEqual([]._foo(), [3,2,1]);
