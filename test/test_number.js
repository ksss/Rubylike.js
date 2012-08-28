#! /usr/bin/env node

var assert = require('assert');
var Rubylike = require('../lib/rubylike.js').Rubylike;

var testCase = [

function classTest () {
	assert.strictEqual(Number.class(), 'Function');
},

function to_sTest () {
	assert.strictEqual(5..to_s(), '5');
	assert.strictEqual(3.141.to_s(), '3.141');
},

function inspectTest () {
	assert.strictEqual(5..inspect(), '5');
	assert.strictEqual(3.141.inspect(), '3.141');
	assert.strictEqual(1e+10.inspect(), '10000000000');
},

function timesTest () {
	var ret = [];
	var t = 5..times(function(i){
		ret.push(i * i);
	});
	var nonblock = 5..times();
	assert.strictEqual(t, 5);
	assert.deepEqual(ret, [0,1,4,9,16]);
	assert.deepEqual(nonblock, [0,1,2,3,4]);
},

function uptoTest () {
	var ret, t, nonblock;

	ret = [];
	t = 1..upto(5, function(i){
		ret.push(i * i);
	});
	nonblock = 1..upto(5);
	assert.strictEqual(t, 1);
	assert.deepEqual(ret, [1,4,9,16,25]);
	assert.deepEqual(nonblock, [1,2,3,4,5]);

	ret = [];
	t = 5..upto(1, function(i){
		ret.push(i * i);
	});
	nonblock = (5).upto(1);
	assert.strictEqual(t, 5);
	assert.deepEqual(ret, []);
	assert.deepEqual(nonblock, []);

	assert.throws(function(){ (1).upto() });
},

function downtoTest () {
	var ret, t, nonblock;

	ret = [];
	t = 5..downto(1, function(i){
		ret.push(i * i);
	});
	nonblock = 5..downto(1);
	assert.strictEqual(t, 5);
	assert.deepEqual(ret, [25,16,9,4,1]);
	assert.deepEqual(nonblock, [5,4,3,2,1]);

	ret = [];
	t = 1..downto(5, function(i){
		ret.push(i * i);
	});
	nonblock = 1..downto(5);
	assert.strictEqual(t, 1);
	assert.deepEqual(ret, []);
	assert.deepEqual(nonblock, []);

	assert.throws(function(){ (1).downto() });
},

function stepTest () {
	var ret, t, nonblock;

	ret = [];
	t = 5..step(10, function(i){
		ret.push(i * i);
	});
	nonblock = 5..step(10);
	assert.strictEqual(t, 5);
	assert.deepEqual(ret, [25,36,49,64,81,100]);
	assert.deepEqual(nonblock, [5,6,7,8,9,10]);

	ret = [];
	t = 5..step(10, 2, function(i){
		ret.push(i * i);
	});
	nonblock = 5..step(10, 2);
	assert.strictEqual(t, 5);
	assert.deepEqual(ret, [25,49,81]);
	assert.deepEqual(nonblock, [5,7,9]);

	ret = [];
	t = 10..step(5, function(i){
		ret.push(i * i);
	});
	nonblock = 10..step(5);
	assert.strictEqual(t, 10);
	assert.deepEqual(ret, []);
	assert.deepEqual(nonblock, []);

	ret = [];
	t = 10..step(5, 2, function(i){
		ret.push(i * i);
	});
	nonblock = 10..step(5, 2);
	assert.strictEqual(t, 10);
	assert.deepEqual(ret, []);
	assert.deepEqual(nonblock, []);

	ret = [];
	t = 10..step(5, -2, function(i){
		ret.push(i * i);
	});
	nonblock = 10..step(5, -2);
	assert.strictEqual(t, 10);
	assert.deepEqual(ret, [100,64,36]);
	assert.deepEqual(nonblock, [10,8,6]);

	assert.throws(function(){ (1).step() });
},

function gcdTest () {
	assert.strictEqual(30..gcd(45), 15);
	assert.strictEqual(100..gcd(30), 10);
	assert.strictEqual(10..gcd(10), 10);
	assert.strictEqual(0..gcd(10), 10);
	assert.strictEqual(0..gcd(0), 0);
	assert.strictEqual((-20).gcd(10), 10);
	assert.throws(function(){ 3.5.gcd(2) });
},

function realTest () {
	assert.strictEqual(10..real(), 10);
	assert.strictEqual(1.1.real(), 1.1);
	assert.strictEqual(0..real(), 0);
	assert.strictEqual(-10..real(), -10);
},

function nextTest () {
	assert.strictEqual(10..next(), 11);
	assert.throws(function(){ 1.1.next() });
	assert.strictEqual(0..next(), 1);
	assert.strictEqual(0..next().next(), 2);
	assert.strictEqual((-10).next(), -9);
},

function divTest () {
	assert.strictEqual(3..div(2), 1);
	assert.strictEqual((-3).div(2), -2);
	assert.strictEqual(3..div(-2), -2);
	assert.strictEqual((-3.0).div(2), -2);
	assert.strictEqual(10..div(5.2), 1);
},

function eqlTest () {
	assert.ok(3..eql(3));
	assert.ok(1.5.eql(1.5));
	assert.ok((-3).eql(-3));
	assert.ok(0..eql(0.0));
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
