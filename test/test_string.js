#! /usr/bin/env node

var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = [

function classTest () {
	assert.strictEqual(String.class(), 'Function');
},

function instanceTest () {
	assert.strictEqual(String.new().class(), 'String');
},

function newTest () {
	assert.strictEqual(String.new(), new String().valueOf());
	assert.strictEqual(String.new(), '');
	assert.strictEqual(String.new("foo"), "foo");
	assert.throws(function(){ String.new([1,2,3]) });
},

];

function p () {
	console.log(Array.prototype.slice.call(arguments));
}
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
