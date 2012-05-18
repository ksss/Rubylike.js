#! /usr/bin/env node

var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = [

function classTest () {
	assert.strictEqual(Number.class(), 'Function');
},

function to_sTest () {
	assert.strictEqual((5).to_s(), '5');
},

function timesTest () {
	var ret = [];
	var t = (5).times(function(i){
		ret.push(i * i);
	});
	var nonblock = (5).times();
	assert.strictEqual(t, 5);
	assert.deepEqual(ret, [0,1,4,9,16]);
	assert.deepEqual(nonblock, [0,1,2,3,4]);
},

function uptoTest () {
	var ret = [];
	var t = (1).upto(5, function(i){
		ret.push(i * i);
	});
	var nonblock = (1).upto(5);
	assert.strictEqual(t, 1);
	assert.deepEqual(ret, [1,4,9,16,25]);
	assert.deepEqual(nonblock, [1,2,3,4,5]);
},

function downtoTest () {
	var ret = [];
	var t = (5).downto(1, function(i){
		ret.push(i * i);
	});
	assert.strictEqual(t, 5);
	assert.deepEqual(ret, [25,16,9,4,1]);
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
