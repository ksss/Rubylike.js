#! /usr/bin/env node
var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = [

function classTest () {
	if (Rubylike.is_defined) {
		assert.strictEqual(Array.class(), 'Function');
	} else {
		assert.strictEqual(Rubylike.Object.prototype.class.call(Array), 'Function');
	}
},

function instanceTest () {
	if (Rubylike.is_defined) {
		assert.strictEqual(Array.new().class(), 'Array');
	} else {
		assert.strictEqual(Rubylike.Object.prototype.class.call([]), 'Array');
	}
},

function newTest () {
	if (Rubylike.is_defined) {
		assert.deepEqual(Array.new(), []);
		assert.deepEqual(Array.new(3), [nil,nil,nil]);
		assert.deepEqual(Array.new(3, 0), [0,0,0]);
		assert.deepEqual(Array.new([1,2,3]), [1,2,3]);
		assert.deepEqual(Array.new(3, {"foo":5}).to_a(), [{"foo":5},{"foo":5},{"foo":5}]);
		assert.throws(function(){Array.new("foo")});
		assert.throws(function(){Array.new("1")});
		assert.throws(function(){Array.new({})});
		assert.throws(function(){Array.new(null)});
		assert.throws(function(){Array.new(function(){})});
	} else {
		assert.deepEqual(Rubylike.Array.new(), {length:0});
		assert.deepEqual(Rubylike.Array.new(3), {0:null,1:null,2:null,length:3});
		assert.deepEqual(Rubylike.Array.new(3, 0), {0:0,1:0,2:0,length:3});
		assert.deepEqual(Rubylike.Array.new([1,2,3]), {0:1,1:2,2:3,length:3});
		assert.deepEqual(Rubylike.Array.new(3, {"foo":5}), {0:{"foo":5},1:{"foo":5},2:{"foo":5},length:3});
		assert.throws(function(){Rubylike.Array.new("foo")});
		assert.throws(function(){Rubylike.Array.new("1")});
		assert.throws(function(){Rubylike.Array.new({})});
		assert.throws(function(){Rubylike.Array.new(null)});
		assert.throws(function(){Rubylike.Array.new(function(){})});
	}
},

function assocTest () {
	var array = [[1,15], Rubylike.Array.new([2,25]), ["foo",35], [{"a":3},3]];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.assoc(2), [2,25]);
		assert.strictEqual(array.assoc(100), nil);
		assert.strictEqual(array.assoc(15), nil);
		assert.deepEqual(array.assoc("foo"), ["foo",35]);
		assert.deepEqual(array.assoc({"a":3}), [{"a":3},3]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.assoc(2), {0:2,1:25,length:2});
		assert.strictEqual(array.assoc(100), null);
		assert.strictEqual(array.assoc(15), null);
		assert.deepEqual(array.assoc("foo"), ["foo",35]);
		assert.deepEqual(array.assoc({"a":3}), [{"a":3},3]);
	}
},

function atTest () {
	var array = [0,1,2,"foo"];
	if (Rubylike.is_defined) {
		assert.strictEqual(array.at(1), 1);
		assert.strictEqual(array.at(3), "foo");
		assert.strictEqual(array.at(-1), "foo");
		assert.strictEqual(array.at(-2), 2);
		assert.strictEqual(array.at(10), nil);
		assert.strictEqual(array.at(-10), nil);
		assert.strictEqual(array.at("at"), nil);
		assert.strictEqual(array.at(function(){}), nil);
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.at(1), 1);
		assert.strictEqual(array.at(3), "foo");
		assert.strictEqual(array.at(-1), "foo");
		assert.strictEqual(array.at(-2), 2);
		assert.strictEqual(array.at(10), null);
		assert.strictEqual(array.at(-10), null);
		assert.strictEqual(array.at("at"), null);
		assert.strictEqual(array.at(function(){}), null);
	}
},

function clearTest () {
	var array = [1,2,3];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.strictEqual(array.clear(), copy);
		assert.ok(array === copy);
		assert.deepEqual(array, []);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.strictEqual(array.clear(), copy);
		assert.ok(array === copy);
		assert.deepEqual(array, {length:0});
	}
},

function cloneTest () {
	var array = [{"foo":1}];
	var copy;
	if (Rubylike.is_defined) {
		copy = array.clone();
		assert.ok(array !== copy);
		assert.ok(array[0] === copy[0]);
	} else {
		array = Rubylike.Array.new();
		copy = array.clone();
		assert.ok(array !== copy);
		assert.ok(array[0] === copy[0]);
	}
},

function collectTest () {
	var array = [10,20,30];
	var collect;
	if (Rubylike.is_defined) {
		collect = array.collect(function(i){return i * 10});
		assert.deepEqual(collect, [100,200,300]);
	} else {
		array = Rubylike.Array.new(array);
		collect = array.collect(function(i){return i * 10});
		assert.deepEqual(collect, {0:100,1:200,2:300,length:3});
	}
},

function combinationTest () {
	var array = [1,2,3,4];
	var copy, tmp, ret;
	if (Rubylike.is_defined) {
		copy = array;
		tmp = [];
		ret = array.combination(1,function(i){
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
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		tmp = [];
		ret = array.combination(1,function(i){
			tmp.push(i[0] + 3);
			return tmp;
		});
		assert.deepEqual(array.combination(1).to_a(), [[1],[2],[3],[4]]);
		assert.deepEqual(array.combination(2).to_a(), [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]);
		assert.deepEqual(array.combination(3).to_a(), [[1,2,3],[1,2,4],[1,3,4],[2,3,4]]);
		assert.deepEqual(array.combination(4).to_a(), [[1,2,3,4]]);
		assert.deepEqual(array.combination(0).to_a(), [[]]);
		assert.deepEqual(array.combination(5).to_a(), []);
		assert.deepEqual(array.combination(6).to_a(), []);
		assert.deepEqual(array.combination(-1).to_a(), []);
		assert.ok(array === ret);
		assert.ok(array === copy);
		assert.deepEqual(tmp, [4,5,6,7]);
		assert.throws(function(){array.combination()});
		assert.throws(function(){array.combination("1")});
		assert.throws(function(){array.combination("a")});
		assert.throws(function(){array.combination(function(){return 1})});
		assert.throws(function(){array.combination([])});
		assert.throws(function(){array.combination({})});
	}
},

function compactTest () {
	var array = [1,null,2,null,3,null];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.compact(), [1,2,3]);
		assert.deepEqual(array, [1,nil,2,nil,3,nil]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.compact().to_a(), [1,2,3]);
		assert.deepEqual(array.to_a(), [1,null,2,null,3,null]);
	}
},

function rejectTest () {
	var array = [1,2,3,2,1];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.reject(function(i){return i === 2}), [1,3,1]);
		assert.deepEqual(array.reject(function(i){return i === 5}), nil);
		assert.ok(array === copy);
		assert.deepEqual(array,[1,2,3,2,1]);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.reject(function(i){return i === 2}).to_a(), [1,3,1]);
		assert.deepEqual(array.reject(function(i){return i === 5}), null);
		assert.ok(array === copy);
		assert.deepEqual(array.to_a(),[1,2,3,2,1]);
	}
},

function delete_ifTest () {
	var array = [1,2,3,2,1];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.delete_if(function(i){return i === 2}), [1,3,1]);
		assert.ok(array === copy);
		assert.deepEqual(array, [1,3,1]);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.delete_if(function(i){return i === 2}).to_a(), [1,3,1]);
		assert.ok(array === copy);
		assert.deepEqual(array.to_a(), [1,3,1]);
	}
},

function cycleTest () {
	var array = [1,2,3];
	var copy;
	var tmp = [];
	var n = 0;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.cycle(1,function(i){return tmp.push(i)}), nil);
		assert.deepEqual(array.cycle(3,function(i){return tmp.push(i)}), nil);
		assert.deepEqual(array.cycle(7,function(i){return tmp.push(i)}), nil);
		assert.throws(function(){ array.cycle() });
		assert.throws(function(){ array.cycle(function(i){return;}) });
		assert.deepEqual(tmp, [1,1,2,3,1,2,3,1,2,3,1]);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.cycle(1,function(i){return tmp.push(i)}), null);
		assert.deepEqual(array.cycle(3,function(i){return tmp.push(i)}), null);
		assert.deepEqual(array.cycle(7,function(i){return tmp.push(i)}), null);
		assert.throws(function(){ array.cycle() });
		assert.throws(function(){ array.cycle(function(i){return;}) });
		assert.deepEqual(tmp, [1,1,2,3,1,2,3,1,2,3,1]);
	}
},

function deleteTest () {
	var array = [1,2,3,2,1];
	var tmp = [];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.delete(10), nil);
		assert.deepEqual(array.delete(2), 2);
		assert.deepEqual(array, [1,3,1]);
		assert.deepEqual(array.delete(1,function(i){tmp.push(i)}), 1);
		assert.deepEqual(tmp, [3]);
		assert.deepEqual(array, [3]);
		assert.ok(array === copy);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.delete(10), null);
		assert.deepEqual(array.delete(2), 2);
		assert.deepEqual(array.to_a(), [1,3,1]);
		assert.deepEqual(array.delete(1,function(i){tmp.push(i)}), 1);
		assert.deepEqual(tmp, [3]);
		assert.deepEqual(array.to_a(), [3]);
		assert.ok(array === copy);
	}
},

function delete_atTest () {
	var array = [0,1,2,3,4];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
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
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.ok(array.delete_at(2) === 2);
		assert.deepEqual(array.to_a(), [0,1,3,4]);
		assert.ok(array.delete_at(10) === null);
		assert.deepEqual(array.to_a(), [0,1,3,4]);
		assert.ok(array.delete_at(-2) === 3);
		assert.deepEqual(array.to_a(), [0,1,4]);
		assert.ok(array.delete_at(-10) === null);
		assert.deepEqual(array.to_a(), [0,1,4]);
		assert.ok(array.delete_at(2) === 4);
		assert.deepEqual(array.to_a(), [0,1]);
		assert.ok(array === copy);
	}
},

function eachTest () {
	var array = [1,3,5];
	var i = 0;
	var tmp = [];
	var ret;
	if (Rubylike.is_defined) {
		ret = array.each(function (i) {
			tmp.push(i);
		});
		assert.ok(i === 0);
		assert.deepEqual(array, [1,3,5]);
		assert.deepEqual(tmp, [1,3,5]);
		assert.ok(array === ret);
		assert.ok(array !== tmp);
	} else {
		array = Rubylike.Array.new(array);
		ret = array.each(function (i) {
			tmp.push(i);
		});
		assert.ok(i === 0);
		assert.deepEqual(array.to_a(), [1,3,5]);
		assert.deepEqual(tmp, [1,3,5]);
		assert.ok(array === ret);
		assert.ok(array !== tmp);
	}
},

function each_indexTest () {
	var array = [1,3,5];
	var i = 0;
	var tmp = [];
	if (Rubylike.is_defined) {
		assert.deepEqual(array, [1,3,5]);
		assert.ok(array === array.each_index(function (i) {tmp.push(i)}));
		assert.deepEqual(tmp, [0,1,2]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.to_a(), [1,3,5]);
		assert.ok(array === array.each_index(function (i) {tmp.push(i)}));
		assert.deepEqual(tmp, [0,1,2]);
	}
},

function eqlTest () {
	var array = [1,2,3,4,-5];
	if (Rubylike.is_defined) {
		assert.ok(array.eql([1,2,3,4,-5]));
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(Rubylike.Object.prototype.eql.call(array.to_a(), [1,2,3,4,-5]));
	}
},

function fetchTest () {
	var array = [1,2,3,4,5];
	if (Rubylike.is_defined) {
		assert.ok(array.fetch(1) === 2);
		assert.ok(array.fetch(10, 999) === 999);
		assert.ok(array.fetch(10, function(i){return i+" is out"}) === "10 is out");
		assert.throws(function(){array.fetch()});
		assert.throws(function(){array.fetch(10)});
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.fetch(1) === 2);
		assert.ok(array.fetch(10, 999) === 999);
		assert.ok(array.fetch(10, function(i){return i+" is out"}) === "10 is out");
		assert.throws(function(){array.fetch()});
		assert.throws(function(){array.fetch(10)});
	}
},

function fillTest () {
	var a = [0,1,2,3,4];
	if (Rubylike.is_defined) {
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
		assert.deepEqual(a.fill(4, 5, function(i){return i}), [0,1,2,0,4,5,6,7,8]);
		assert.throws(function(){a.fill()});
		assert.throws(function(){a.fill(0,0,0,0)});
	} else {
		a = Rubylike.Array.new(a);
		assert.deepEqual(a.fill(10).to_a(), [10,10,10,10,10]);
		assert.deepEqual(a.fill("a").to_a(), ["a","a","a","a","a"]);
		assert.deepEqual(a.fill(["a"]).to_a(), [["a"],["a"],["a"],["a"],["a"]]);
		a[0].push("b");
		assert.deepEqual(a.to_a(), [["a","b"],["a","b"],["a","b"],["a","b"],["a","b"]]);
		assert.ok(a[0] === a[1]);
		assert.deepEqual(a.fill("x",3,5).to_a(), [["a","b"],["a","b"],["a","b"],"x","x","x","x","x"]);
		assert.deepEqual(a.fill(function(i){return i}).to_a(), [0,1,2,3,4,5,6,7]);
		assert.deepEqual(a.fill(3, function(i){return i-3}).to_a(), [0,1,2,0,1,2,3,4]);
		assert.deepEqual(a.fill(0, 3).to_a(), [0,1,2,0,0,0,0,0]);
		assert.deepEqual(a.fill(4, 5, function(i){return i}).to_a(), [0,1,2,0,4,5,6,7,8]);
		assert.throws(function(){a.fill()});
		assert.throws(function(){a.fill(0,0,0,0)});
	}
},

function firstTest () {
	var array = [1,2,3];
	if (Rubylike.is_defined) {
		assert.strictEqual(array.first(), 1);
		assert.deepEqual(array.first(2), [1,2]);
		assert.ok(array.first(2) !== array);
		assert.ok(array.first(10) === array);
		assert.deepEqual(array, [1,2,3]);
		assert.throws(function(){array.first(-1)});
		assert.throws(function(){array.first("1")});
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.first(), 1);
		assert.deepEqual(array.first(2), [1,2]);
		assert.ok(array.first(2) !== array);
		assert.ok(array.first(10) === array);
		assert.deepEqual(array.to_a(), [1,2,3]);
		assert.throws(function(){array.first(-1)});
		assert.throws(function(){array.first("1")});
	}
},

function flattenTest () {
	var array = [1,[2,3,[4],5]];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.flatten(), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(1), [1,2,3,[4],5]);
		assert.deepEqual(array.flatten(10), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(0), [1,[2,3,[4],5]]);
		assert.ok(array.flatten(0) !== array);
		assert.deepEqual(array.flatten(null), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(undefined), [1,2,3,4,5]);
		assert.deepEqual(array, [1,[2,3,[4],5]]);
		assert.ok(array === copy);
		assert.throws(function(){array.flatten("1")});
		assert.throws(function(){array.flatten([1])});
		assert.deepEqual([1,null,2,undefined,[],3].flatten(), [1,null,2,undefined,3]);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.flatten().to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(1).to_a(), [1,2,3,[4],5]);
		assert.deepEqual(array.flatten(10).to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(0).to_a(), [1,[2,3,[4],5]]);
		assert.ok(array.flatten(0) !== array);
		assert.deepEqual(array.flatten(null).to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(undefined).to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.to_a(), [1,[2,3,[4],5]]);
		assert.ok(array === copy);
		assert.throws(function(){array.flatten("1")});
		assert.throws(function(){array.flatten([1])});
		assert.deepEqual(Rubylike.Array.new([1,null,2,undefined,[],3]).flatten().to_a(), [1,null,2,undefined,3]);
	}
},

function indexTest () {
	if (Rubylike.is_defined) {
		assert.ok([1,0,0,1,0].index(1) === 0);
		assert.ok([1,0,0,0,0].index(1) === 0);
		assert.ok([0,0,0,0,0].index(1) === null);
		assert.ok([0,1,0,1,0].index(function(v){ return v > 0 }) === 1);
		assert.ok([1,0,0,"1",0].index("1") === 3);
	} else {
		assert.ok(Rubylike.Array.new([1,0,0,1,0]).index(1) === 0);
		assert.ok(Rubylike.Array.new([1,0,0,0,0]).index(1) === 0);
		assert.ok(Rubylike.Array.new([0,0,0,0,0]).index(1) === null);
		assert.ok(Rubylike.Array.new([0,1,0,1,0]).index(function(v){ return v > 0 }) === 1);
		assert.ok(Rubylike.Array.new([1,0,0,"1",0]).index("1") === 3);
	}
},

function pushTest () {
	var array;
	if (Rubylike.is_defined) {
		array = [0].push(1).push(3);
		array._push(5);
		assert.deepEqual(array, [0,1,3,5]);
	} else {
		array = Rubylike.Array.new([0]).push(1).push(3);
		array.push(5);
		assert.deepEqual(array.to_a(), [0,1,3,5]);
	}
},

function popTest () {
	var array = [1,2,3,4,5,6,7,8,9];
	if (Rubylike.is_defined) {
		assert.strictEqual(array.pop(2).pop(), 9);
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
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.pop(2).pop(), 9);
		assert.deepEqual(array.to_a(), [1,2,3,4,5,6,7]);
		assert.strictEqual(array.pop(), 7);
		assert.deepEqual(array.to_a(), [1,2,3,4,5,6]);
		assert.deepEqual(array.pop(0).to_a(), []);
		assert.deepEqual(array.to_a(), [1,2,3,4,5,6]);
		assert.deepEqual(array.pop(1).to_a(), [6]);
		assert.deepEqual(array.to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.pop(3).to_a(), [3,4,5]);
		assert.deepEqual(array.pop(10).to_a(), [1,2]);
		assert.deepEqual(array.to_a(), []);
	}
},

function shiftTest () {
	var array = [1,2,3,4,5,6,7,8,9];
	var ruby;
	if (Rubylike.is_defined) {
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
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.shift(), 1);
		assert.deepEqual(array.to_a(), [2,3,4,5,6,7,8,9]);
		assert.deepEqual(array.shift(1).to_a(), [2]);
		assert.deepEqual(array.to_a(), [3,4,5,6,7,8,9]);
		assert.deepEqual(array.shift(3).to_a(), [3,4,5]);
		assert.deepEqual(array.to_a(), [6,7,8,9]);
		assert.deepEqual(array.shift(10).to_a(), [6,7,8,9]);
		assert.deepEqual(array.to_a(), []);
		assert.strictEqual(array.shift(), null);
		assert.deepEqual(array.shift(1).to_a(), []);
		assert.deepEqual(array.to_a(), []);
	}
},

function injectTest () {
	var array = [1,2,3,4,5];
	var sum = 12345;
	var i = 100;
	var ret;
	if (Rubylike.is_defined) {
		ret = array.inject(function (sum, i) {
			return sum * i;
		});
		assert.strictEqual(ret, 120);
		assert.strictEqual(sum, 12345);
		assert.strictEqual(i, 100);
	} else {
		array = Rubylike.Array.new(array);
		ret = array.inject(function (sum, i) {
			return sum * i;
		});
		assert.strictEqual(ret, 120);
		assert.strictEqual(sum, 12345);
		assert.strictEqual(i, 100);
	}
},

];
Array.prototype.foo = function () {return [3,2,1]};
Array.prototype._foo = function () {return [3,2,1]};

assert.ok(typeof Rubylike === 'function');
assert.throws(function(){ Rubylike() });
assert.ok(1 < Rubylike.Array.new().methods().length);
assert.ok(Rubylike.is_defined === false);
Rubylike(function(r){
	assert.ok(Rubylike.is_defined === true);
	for (var i = 0, len = testCase.length; i < len; i += 1) {
		testCase[i]();
	}
});
assert.ok(Rubylike.is_defined === false);
for (var i = 0, len = testCase.length; i < len; i += 1) {
	testCase[i]();
}

assert.deepEqual([].foo(), [3,2,1]);
assert.deepEqual([]._foo(), [3,2,1]);
