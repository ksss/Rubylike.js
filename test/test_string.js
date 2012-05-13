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

function subTest () {
	assert.strictEqual('abcdefg'.sub("def", '!!'), "abc!!g");
	assert.strictEqual('abcdefg'.sub(/def/, '!!'), "abc!!g");
	assert.strictEqual('abcabc'.sub(/b/, '<<$&>>'), "a<<b>>cabc"); // RegExp use JavaScript
	assert.strictEqual('xbbb-xbbb'.sub(/x(b+)/, '$1'), "bbb-xbbb");
	assert.notStrictEqual('xbbb-xbbb'.sub(/x+(b+)/, '$$1'), "bbb-xbbb");
	assert.strictEqual("abcabc".sub(/[ab]/, {"a": "!", "1": "#"}), "!bcabc");
	assert.strictEqual("abcabc".sub(/[bc]/, {'b':'B', 'c':'C'}), "aBcabc");
	assert.strictEqual("abcabc".sub(/b/, Hash.new({'b':'B', 'c':'C'})), "aBcabc");
},

function gsubTest () {
	assert.strictEqual('abcdefg'.gsub("def", '!!'), "abc!!g");
	assert.strictEqual('abcdefg'.gsub(/def/, '!!'), "abc!!g");
	assert.strictEqual('abcabc'.gsub(/b/, '<<$&>>'), "a<<b>>ca<<b>>c");
	assert.strictEqual('xxbbxbb'.gsub(/x+(b+)/, 'X<<$1>>'), "X<<bb>>X<<bb>>");
	assert.strictEqual('xbbb-xbbb'.gsub(/x(b+)/, '$1'), "bbb-bbb");
	assert.notStrictEqual('xbbb-xbbb'.gsub(/x(b+)/, '$$1'), "bbb-bbb");
	assert.strictEqual("abcabc".gsub(/[ab]/, {"a": "!", "1": "#"}), "!c!c");
	assert.strictEqual("abcabc".gsub(/[bc]/, {'b':'B', 'c':'C'}), "aBCaBC");
	assert.strictEqual("abcabc".gsub(/[bc]/, Hash.new({'b':'B', 'c':'C'})), "aBCaBC");
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
