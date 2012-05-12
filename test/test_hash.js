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
},

function to_aTest () {
	var hash = Hash.new({"a": 100, 2: ["some"], "c": "c"});
	assert.deepEqual(hash.to_a(), [[2, ["some"]], ["a", 100], ["c", "c"]]); // JavaScript hash are automatically sorted
	assert.deepEqual(hash, {"a": 100, 2: ["some"], "c": "c"});
},

function eachTest () {
	var hash = Hash.new({"a": 100, 2: ["some"], "c": "c"});
	var ret = [];
	var i = 999;
	hash.each(function(i){
		ret.push(i);
	});
	assert.deepEqual(ret, [[2, ["some"]], ["a", 100], ["c", "c"]]);
	assert.deepEqual(hash, {"a": 100, 2: ["some"], "c": "c"});
	assert.strictEqual(i, 999);
},

function firstTest () {
	var hash = Hash.new({"a":1, "b":2});
	assert.deepEqual(hash.first(), ["a", 1]);
	assert.deepEqual(hash, {"a":1, "b":2});
},

function shiftTest () {
	var hash = Hash.new({"a":1, "b":2});
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
