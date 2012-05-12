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

function gsubTest () {
	assert.strictEqual('abcdefg'.gsub("def", '!!'), "abc!!g");
	assert.strictEqual('abcdefg'.gsub(/def/, '!!'), "abc!!g");
	assert.strictEqual('abcabc'.gsub(/b/, '<<$&>>'), "a<<b>>ca<<b>>c"); // RegExp use JavaScript
	assert.strictEqual('xxbbxbb'.gsub(/x+(b+)/, 'X<<$1>>'), "X<<bb>>X<<bb>>");
	assert.strictEqual('xbbb-xbbb'.gsub(/x(b+)/, '$1'), "bbb-bbb");
	assert.notStrictEqual('xbbb-xbbb'.gsub(/x(b+)/, '$$1'), "bbb-bbb");
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
