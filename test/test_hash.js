#! /usr/bin/env node

var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = [

function classTest () {
	assert.strictEqual(Hash.class(), 'Function');
},

function instanceTest () {
	assert.strictEqual(Hash.new().class(), 'Hash');
},

function newTest () {
	assert.ok(Hash.new() instanceof Hash);
	assert.deepEqual(Hash.new(), new Object());
	assert.deepEqual(Hash.new(nil), {});
	assert.deepEqual(Hash.new(10), {});
	assert.deepEqual(Hash.new("a"), {});
	assert.deepEqual(Hash.new(/\d/), {});
	assert.deepEqual(Hash.new({"foo":3}), {"foo":3});
	assert.deepEqual(Hash.new({"foo":3}).class(), 'Hash');
	assert.deepEqual(Hash.new({"foo":{"bar":2}})["foo"].class(), 'Hash');
	assert.deepEqual(Hash.new({"foo":["bar",2]})["foo"].class(), 'Array');
	assert.deepEqual(Hash.new({"foo":(new String('a'))})["foo"].class(), 'String');
	assert.deepEqual(Hash.new({"foo":(new Number('a'))})["foo"].class(), 'Number');
	assert.deepEqual(Hash.new({"foo":(new RegExp('a'))})["foo"].class(), 'RegExp');
	assert.deepEqual(Hash.new({"foo":(new Function('a'))})["foo"].class(), 'Function');
},

function to_aTest () {
	var hash = Hash.new({"a": 100, 2: ["some"], "c": "c"});
	assert.deepEqual(hash.to_a(), [[2, ["some"]], ["a", 100], ["c", "c"]]); // JavaScript hash are automatically sorted
	assert.deepEqual(hash, {"a": 100, 2: ["some"], "c": "c"});
},

function to_hashTest () {
	var hash = Hash.new({"a":100, 2:["some"], "c":"c"});
	assert.deepEqual(hash.to_hash(), {"a":100, 2:["some"], "c":"c"});
	assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
},

function eachTest () {
	var hash = Hash.new({"a":100, 2:["some"], "c":"c"});
	var ret = [];
	var i = 999;
	var each_ret = hash.each(function(i){
		ret.push(i);
	});
	assert.deepEqual(ret, [[2,["some"]], ["a",100], ["c","c"]]);
	assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
	assert.strictEqual(i, 999);
	assert.deepEqual(each_ret, hash);

	ret = [];
	each_ret = hash.each(function(key, value){
		ret.push([key, value]);
	});
	assert.deepEqual(ret, [[2,["some"]], ["a",100], ["c","c"]]);
	assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
	assert.strictEqual(i, 999);
	assert.deepEqual(each_ret, hash);
},

function each_keyTest () {
	var hash = Hash.new({"a":100, 2:["some"], "c":"c"});
	var ret = [];
	var i = 999;
	var each_ret = hash.each_key(function(i){
		ret.push(i);
	});
	assert.deepEqual(ret, ["2", "a", "c"]);
	assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
	assert.strictEqual(i, 999);
	assert.deepEqual(each_ret, hash);
},

function firstTest () {
	var hash = Hash.new({"a":1,"b":2});
	assert.deepEqual(hash.first(), ["a", 1]);
	assert.deepEqual(hash, {"a":1, "b":2});
},

function shiftTest () {
	var hash = Hash.new({"a":1,"b":2});
	assert.deepEqual(hash.shift(), ["a", 1]);
	assert.deepEqual(hash, {"b":2});
},

function injectTest () {
	var hash = Hash.new({"a":1, "b":2, "c":3});
	var sum = 12345;
	var i = 100;
	var ret = hash.inject(function (sum, i) {
		return [sum[0] + i[0], sum[1] + i[1]];
	});
	assert.deepEqual(ret, ["abc", 6]);
	assert.strictEqual(sum, 12345);
	assert.strictEqual(i, 100);
},

function lengthTest () {
	var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
	assert.ok(hash.length(), 3);
},

function sizeTest () {
	var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
	assert.ok(hash.size(), 3);
},

function eqlTest () {
	var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
	assert.ok(hash.eql({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}}));
	assert.ok(hash.eql(Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}})));
	assert.ok(!hash.eql(Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":6}}}})));
},

function keysTest () {
	var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
	assert.deepEqual(hash.keys(), ["1","b","c"]);
},

function keyTest () {
	var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
	assert.deepEqual(hash.key(1), "b");
	assert.deepEqual(hash.key("b"), 1);
	assert.deepEqual(hash.key({"d":{"e":{"f":5}}}), "c");
},

];

// outside Rubylike test
for (var i = 0, len = testCase.length; i < len; i += 1) {
	assert.throws(function(){
		testCase[i]();
	});
}
// inside Rubylike test
Rubylike(function(r){
	for (var i = 0, len = testCase.length; i < len; i += 1) {
		testCase[i]();
	}
});

// outside Rubylike test
for (var i = 0, len = testCase.length; i < len; i += 1) {
	assert.throws(function(){
		testCase[i]();
	});
}
