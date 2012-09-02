#! /usr/bin/env node

var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = [

function classTest () {
	assert.strictEqual(Array.class(), 'Function');
},

function instanceTest () {
	assert.strictEqual(Array.new().class(), 'Array');
},

function newTest () {
	assert.deepEqual(Array.new(), new Array());
	assert.deepEqual(Array.new(3), [nil, nil, nil]);
	assert.deepEqual(Array.new([1,2,3]), [1,2,3]);
	assert.deepEqual(Array.new(3, {"foo":5}), [{"foo":5},{"foo":5},{"foo":5}]);
	assert.throws(function(){
		Array.new("foo")
	});
},

function assocTest () {
	var array = [[1,15], [2,25], ["foo",35], [{"a":3},3]];
	assert.deepEqual(array.assoc(2), [2,25]);
	assert.strictEqual(array.assoc(100), nil);
	assert.strictEqual(array.assoc(15), nil);
	assert.deepEqual(array.assoc("foo"), ["foo",35]);
	assert.deepEqual(array.assoc({"a":3}), [{"a":3},3]);
},

function atTest () {
	var array = [0,1,2,"foo"];
	assert.strictEqual(array.at(1), 1);
	assert.strictEqual(array.at(3), "foo");
	assert.strictEqual(array.at(10), nil);
	assert.strictEqual(array.at("at"), nil);
},

function clearTest () {
	var array = [1,2,3];
	var array_copy = array;
	assert.strictEqual(array.clear(), array_copy);
	assert.strictEqual(array, array_copy);
	assert.deepEqual(array, []);
},

function cloneTest () {
	var array = [{"foo":1}];
	var copy = array.clone();
	assert.ok(array !== copy);
	assert.ok(array[0] === copy[0]);
	array = [1,2,3];
},

function collectTest () {
	var array = [10,20,30];
	var collect = array.collect(function(i){return i * 10});
	var enumerator = array.collect();
	var tmp = [];
	enumerator.each(function(i){
		tmp.push(i + 2);
	});
	assert.deepEqual(collect, [100,200,300]);
	assert.deepEqual(tmp, [12,22,32]);
},

function eachTest () {
	var i = 0;
	var array = [1,3,5];
	var enumerator = array.each();
	var ret = array.each(function (i) {
		assert.equal(typeof i, 'number');
		assert.ok(0 < i);
		assert.ok(i < 6);
		i = i + 5;
	});
	assert.equal(i, 0, 'keep value');
	assert.deepEqual(ret, array);
	assert.deepEqual(enumerator, [1,3,5]);
	assert.throws(function(){
		[]._each(function(){});
	});
},

function pushTest () {
	var array = [0].push(1).push(3);
	array._push(5);
	assert.deepEqual(array, [0,1,3,5]);
},

function popTest () {
	var array = [1,2,3,4,5,6,7,8,9];
	assert.strictEqual(array.pop(2)._pop(), 9);
	assert.deepEqual(array, [1,2,3,4,5,6,7]);
	assert.strictEqual(array.pop(), 7);
	assert.deepEqual(array, [1,2,3,4,5,6]);
	assert.deepEqual(array.pop(0), []);
	assert.deepEqual(array, [1,2,3,4,5,6]);
	assert.deepEqual(array.pop(1), [6]);
	assert.deepEqual(array, [1,2,3,4,5]);
	assert.deepEqual(array.pop(3), [3,4,5]);
	assert.deepEqual(array.pop(10), [1,2]);
	assert.deepEqual(array, []);
},

function shiftTest () {
	var array = [1,2,3,4,5,6,7,8,9];
	assert.strictEqual(array.shift(), 1);
	assert.deepEqual(array, [2,3,4,5,6,7,8,9]);
	assert.deepEqual(array.shift(1), [2]);
	assert.deepEqual(array, [3,4,5,6,7,8,9]);
	assert.deepEqual(array.shift(3), [3,4,5]);
	assert.deepEqual(array, [6,7,8,9]);
	assert.deepEqual(array.shift(10), [6,7,8,9]);
	assert.deepEqual(array, []);
	assert.strictEqual(array.shift(), null);
	assert.deepEqual(array.shift(1), []);
	assert.deepEqual(array, []);
},

function firstTest () {
	var array = [1,2,3]
	assert.strictEqual(array.first(), 1);
	assert.deepEqual(array, [1,2,3]);
},

function injectTest () {
	var array = [1,2,3,4,5];
	var sum = 12345;
	var i = 100;
	var ret = array.inject(function (sum, i) {
		return sum * i;
	});
	assert.strictEqual(ret, 120);
	assert.strictEqual(sum, 12345);
	assert.strictEqual(i, 100);
},

function eqlTest () {
	var array = [1,2,3,4,-5];
	assert.ok(array.eql([1,2,3,4,-5]));
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
assert.ok(typeof Rubylike === 'function');
assert.throws(function(){ Rubylike() });
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
