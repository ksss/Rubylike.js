#! /usr/bin/env node

var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = [

function newTest () {
	assert.strictEqual(nil, null, 'can use nil same null');
	assert.deepEqual(Array.new().to_a(), new Array());
	assert.deepEqual(Array.new(3).to_a(), [nil, nil, nil]);
	assert.deepEqual(Array.new(3, {"foo":5}).to_a(), [{"foo":5},{"foo":5},{"foo":5}]);
	assert.throws(function(){
		Array.new("foo")
	});
},

function pushTest () {
	var array = Array.new();
	array.push(1).push(3).push(5);
	assert.deepEqual(array.to_a(), [1,3,5]);
},

function popTest () {
	var array = Array.new([1,2,3,4,5,6,7]);
	assert.equal(array.pop(), 7);
	assert.deepEqual(array.to_a(), [1,2,3,4,5,6]);
	assert.deepEqual(array.pop(0), []);
	assert.deepEqual(array.to_a(), [1,2,3,4,5,6]);
	assert.deepEqual(array.pop(1), [6]);
	assert.deepEqual(array.to_a(), [1,2,3,4,5]);
	assert.deepEqual(array.pop(3), [3,4,5]);
	assert.deepEqual(array.pop(10), [1,2]);
	assert.deepEqual(array.to_a(), []);
},

function eachTest () {
	var i, ret
	i = 0;
	array = Array.new([1,3,5]);
	ret = array.each(function (i) {
		assert.equal(typeof i, 'number');
		assert.ok(0 < i);
		assert.ok(i < 6);
		i = i + 5;
	});
	assert.equal(i, 0, 'keep value');
	assert.deepEqual(ret, array.to_a());
	assert.throws(function(){
		[]._each(function(){});
	});
},

];

// outside Rubylike test
for (var i = 0, len = testCase.length; i < len; i += 1) {
	assert.throws(function(){
		testCase[i]();
	});
}

Array.prototype.foo = function () {return [3,2,1]};
Array.prototype._foo = function () {return [3,2,1]};

// inside Rubylike test
Rubylike(function(r){
	for (var i = 0, len = testCase.length; i < len; i += 1) {
		testCase[i]();
	}
});

assert.deepEqual([].foo(), [3,2,1]);
assert.deepEqual([]._foo(), [3,2,1]);

// outside Rubylike test
for (var i = 0, len = testCase.length; i < len; i += 1) {
	assert.throws(function(){
		testCase[i]();
	});
}

function p () {
	console.log(Array.prototype.slice.call(arguments));
}