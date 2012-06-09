#! /usr/bin/env node

var assert = require('assert');
var util = require('util');
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

function eqlTest () {
	assert.ok('string'.eql('string'));
},

function chopTest () {
	assert.strictEqual("foo\r\n".chop(), 'foo');
	assert.strictEqual("bar\n".chop(), 'bar');
	assert.strictEqual("baz".chop(), 'ba');
	assert.strictEqual("".chop(), '');
},

function chompTest () {
	assert.strictEqual("foo\r\nfoo\rfoo\n".chomp(), "foo\r\nfoo\rfoo");
	assert.strictEqual("bar\n".chomp(), 'bar');
	assert.strictEqual("bar\r".chomp(), 'bar');
	assert.strictEqual("baz".chomp(), 'baz');
	assert.strictEqual("".chomp(), '');
	assert.strictEqual("foo\r\nfoo\rfoo\n".chomp('\n'), "foo\r\nfoo\rfoo");
	assert.strictEqual("foo\r\nfoo\rfoo\n".chomp('\r'), "foo\r\nfoo\rfoo\n");
	assert.strictEqual("bar\n".chomp('a'), "bar\n");
	assert.strictEqual("bar".chomp('r'), "ba");
	assert.strictEqual("bar".chomp('a'), "bar");
	assert.strictEqual("bar".chomp(null), "bar");
	assert.throws(function(){"bar\r".chomp(1)});
},

function each_charTest () {
	var str = "abc def";
	var tmp = [];
	var ch = 'foo';
	var enumerator = str.each_char();
	var ret = str.each_char(function(ch){
		tmp.push(ch);
	});
	assert.deepEqual(tmp, ['a','b','c',' ','d','e','f']);
	assert.strictEqual(ret, str);
	assert.strictEqual(ch, 'foo')
	assert.deepEqual(enumerator, ['a','b','c',' ','d','e','f']);
},

function charsTest () {
	var str = "abc def";
	var tmp = [];
	var ch = 'foo';
	var enumerator = str.chars();
	var ret = str.chars(function(ch){
		tmp.push(ch);
	});
	assert.deepEqual(tmp, ['a','b','c',' ','d','e','f']);
	assert.strictEqual(ret, str);
	assert.strictEqual(ch, 'foo')
	assert.deepEqual(enumerator, ['a','b','c',' ','d','e','f']);
},

function clearTest () {
	assert.strictEqual('foo'.clear(), '');
},

function cloneTest () {
	assert.strictEqual('foo'.clone(), 'foo');
},

function matchTest () {
	assert.ok(!!"foo".match(/foo/));
	assert.deepEqual("foo".match(/foo/), []);
	assert.deepEqual("foobar".match(/(.).(.)/, 3), ["b","r"]);
	assert.deepEqual("foobar".match(/(.).(.)/, -3), ["b","r"]);
	assert.deepEqual("foobar".match(/baz/), nil);
},

function insertTest () {
	assert.strictEqual("foobaz".insert(3, "bar"), "foobarbaz");
	assert.strictEqual("foobaz".insert(3, ""), "foobaz");
},

function emptyTest () {
	assert.ok(''.empty());
	assert.ok(!'foo'.empty());
},

function indexTest () {
	assert.ok("astrochemistry".index("str") === 1);
	assert.ok("regexpindex".index(/e.*x/, 2) === 3);
	assert.ok("character".index('a') === 2);
	assert.ok("character".index('zzz') === null);
	assert.ok("character".index(97) === 2);
	assert.ok("foobarfoobar".index("bar", 6) === 9);
	assert.ok("foobarfoobar".index("bar", -4) === 9);
	assert.ok("aaa".index() === null);
},

//function nextTest () {
//	assert.strictEqual('a'.next(), 'b');
//	assert.strictEqual('aa'.next(), 'ab');
//	assert.strictEqual('88'.next().next(), '90');
//	assert.strictEqual('99'.next(), '100');
//	assert.strictEqual('-9'.next(), '-10');
//	assert.strictEqual('9'.next(), '10');
//	assert.strictEqual('09'.next(), '10');
//
//	assert.strictEqual('ZZ'.next(), 'AAA');
//	assert.strictEqual('zz'.next(), 'aaa');
//	assert.strictEqual('a9'.next(), 'b0');
//	assert.strictEqual('Az'.next(), 'Ba');
//	assert.strictEqual('1.9.8.'.next(), '1.9.9.');
//	assert.strictEqual('1.9.9'.next(), '2.0.0');
//	assert.strictEqual('.'.next(), '/');
//	assert.strictEqual(''.next(), '');
//}

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
