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
	assert.throws(function(){Array.new("foo")});
	assert.throws(function(){Array.new("1")});
	assert.throws(function(){Array.new({})});
	assert.throws(function(){Array.new(null)});
	assert.throws(function(){Array.new(function(){})});
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
	assert.strictEqual(array.at(-1), "foo");
	assert.strictEqual(array.at(-2), 2);
	assert.strictEqual(array.at(10), nil);
	assert.strictEqual(array.at(-10), nil);
	assert.strictEqual(array.at("at"), nil);
	assert.strictEqual(array.at(function(){}), nil);
},

function clearTest () {
	var array = [1,2,3];
	var copy = array;
	assert.strictEqual(array.clear(), copy);
	assert.ok(array === copy);
	assert.deepEqual(array, []);
},

function cloneTest () {
	var array = [{"foo":1}];
	var copy = array.clone();
	assert.ok(array !== copy);
	assert.ok(array[0] === copy[0]);
},

function collectTest () {
	var array = [10,20,30];
	var collect = array.collect(function(i){return i * 10});
	var tmp = [];
	assert.deepEqual(collect, [100,200,300]);
},

function combinationTest () {
	var array = [1,2,3,4];
	var copy = array;
	var tmp = [];
	var ret = array.combination(1,function(i){
		tmp.push(i[0] + 3);
		return tmp;
	});
	assert.deepEqual(array.combination(1), [[1],[2],[3],[4]]);
	assert.deepEqual(array.combination(2), [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]);
	assert.deepEqual(array.combination(3), [[1,2,3],[1,2,4],[1,3,4],[2,3,4]]);
	assert.deepEqual(array.combination(4), [[1,2,3,4]]);
	assert.deepEqual(array.combination(0), [[]]);
	assert.deepEqual(array.combination(5), []);
	assert.deepEqual(array.combination(6), []);
	assert.deepEqual(array.combination(-1), []);
	assert.ok(array === ret);
	assert.ok(array === copy);
	assert.deepEqual(tmp, [4,5,6,7]);
	assert.throws(function(){array.combination()});
	assert.throws(function(){array.combination("1")});
	assert.throws(function(){array.combination("a")});
	assert.throws(function(){array.combination(function(){return 1})});
	assert.throws(function(){array.combination([])});
	assert.throws(function(){array.combination({})});
},

function compactTest () {
	var array = [1,nil,2,nil,3,nil];
	assert.deepEqual(array.compact(), [1,2,3]);
	assert.deepEqual(array, [1,nil,2,nil,3,nil]);
},

function rejectTest () {
	var array = [1,2,3,2,1];
	var copy = array;
	assert.deepEqual(array.reject(function(i){return i === 2}), [1,3,1]);
	assert.deepEqual(array.reject(function(i){return i === 5}), nil);
	assert.ok(array === copy);
	assert.deepEqual(array,[1,2,3,2,1]);
},

function delete_ifTest () {
	var array = [1,2,3,2,1];
	var copy = array;
	assert.deepEqual(array.delete_if(function(i){return i === 2}), [1,3,1]);
	assert.ok(array === copy);
	assert.deepEqual(array, [1,3,1]);
},

function cycleTest () {
	var array = [1,2,3];
	var copy = array;
	var tmp = [];
	var n = 0;
	assert.deepEqual(array.cycle(1,function(i){return tmp.push(i)}), nil);
	assert.deepEqual(array.cycle(3,function(i){return tmp.push(i)}), nil);
	assert.deepEqual(array.cycle(7,function(i){return tmp.push(i)}), nil);
	assert.throws(function(){ array.cycle() });
	assert.throws(function(){ array.cycle(function(i){return;}) });
	assert.deepEqual(tmp, [1,1,2,3,1,2,3,1,2,3,1]);
},

function deleteTest () {
	var array = [1,2,3,2,1];
	var copy = array;
	var tmp = [];
	assert.deepEqual(array.delete(10), nil);
	assert.deepEqual(array.delete(2), 2);
	assert.deepEqual(array, [1,3,1]);
	assert.deepEqual(array.delete(1,function(i){tmp.push(i)}), 1);
	assert.deepEqual(tmp, [3]);
	assert.deepEqual(array, [3]);
	assert.ok(array === copy);
},

function delete_atTest () {
	var array = [0,1,2,3,4];
	var copy = array;
	assert.ok(array.delete_at(2) === 2);
	assert.deepEqual(array, [0,1,3,4]);
	assert.ok(array.delete_at(10) === null);
	assert.deepEqual(array, [0,1,3,4]);
	assert.ok(array.delete_at(-2) === 3);
	assert.deepEqual(array, [0,1,4]);
	assert.ok(array.delete_at(-10) === null);
	assert.deepEqual(array, [0,1,4]);
	assert.ok(array.delete_at(2) === 4);
	assert.deepEqual(array, [0,1]);
	assert.ok(array === copy);
},

function eachTest () {
	var i = 0;
	var array = [1,3,5];
	var tmp = [];
	var ret = array.each(function (i) {
		tmp.push(i);
	});
	assert.equal(i, 0, 'keep value');
	assert.deepEqual(array, [1,3,5]);
	assert.deepEqual(tmp, [1,3,5]);
	assert.ok(array === ret);
	assert.ok(array !== tmp);
},

function each_indexTest () {
	var i = 0;
	var array = [1,3,5];
	var tmp = [];
	assert.deepEqual(array, [1,3,5]);
	assert.ok(array === array.each_index(function (i) {tmp.push(i)}));
	assert.deepEqual(tmp, [0,1,2]);
},

function eqlTest () {
	var array = [1,2,3,4,-5];
	assert.ok(array.eql([1,2,3,4,-5]));
},

function fetchTest () {
	var array = [1,2,3,4,5];
	assert.ok(array.fetch(1) === 2);
	assert.throws(function(){array.fetch(10)});
	assert.ok(array.fetch(10, 999) === 999);
	assert.ok(array.fetch(10, function(i){return i+" is out"}) === "10 is out");
},

function fillTest () {
	var a = [0,1,2,3,4];
	assert.deepEqual(a.fill(10), [10,10,10,10,10]);
	assert.deepEqual(a.fill("a"), ["a","a","a","a","a"]);
	assert.deepEqual(a.fill(["a"]), [["a"],["a"],["a"],["a"],["a"]]);
	a[0].push("b");
	assert.deepEqual(a, [["a","b"],["a","b"],["a","b"],["a","b"],["a","b"]]);
	assert.ok(a[0] === a[1]);
	assert.deepEqual(a.fill("x",3,5), [["a","b"],["a","b"],["a","b"],"x","x","x","x","x"]);
	assert.deepEqual(a.fill(function(i){return i}), [0,1,2,3,4,5,6,7]);
	assert.deepEqual(a.fill(3, function(i){return i-3}), [0,1,2,0,1,2,3,4]);
	assert.deepEqual(a.fill(0, 3), [0,1,2,0,0,0,0,0]);
	assert.deepEqual(a.fill(4, 3, function(i){return i}), [0,1,2,0,4,5,6,0]);
	assert.throws(function(){a.fill()});
	assert.throws(function(){a.fill(0,0,0,0)});
},

function firstTest () {
	var array = [1,2,3]
	assert.strictEqual(array.first(), 1);
	assert.deepEqual(array.first(2), [1,2]);
	assert.ok(array.first(2) !== array);
	assert.ok(array.first(10) === array);
	assert.deepEqual(array, [1,2,3]);
	assert.throws(function(){array.first(-1)});
	assert.throws(function(){array.first("1")});
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
