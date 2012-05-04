#! /usr/bin/env node

var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = [

function newTest () {
	assert.deepEqual(Hash.new(), {});
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
	hash.each(function(i){
		ret.push(i);
	});
	assert.deepEqual(ret, [[2, ["some"]], ["a", 100], ["c", "c"]]);
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

var hash = {"a": 100, 2: ["some"], "c": "c"};

function p () {
	console.log(Array.prototype.slice.call(arguments));
}
