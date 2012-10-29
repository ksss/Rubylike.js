var to_a = function(i){ return i.to_a() };

var testCase = [

function instanceTest () {
	if (Rubylike.is_defined) {
		assert.strictEqual(Hash.new().class(), 'Hash');
	} else {
		assert.strictEqual(Rubylike.Object.class(Rubylike.Hash.new()), 'Hash');
	}
},

function newTest () {
	if (Rubylike.is_defined) {
		assert.ok(Hash.new() instanceof Hash);
		assert.deepEqual(Hash.new(), new Object());
		assert.deepEqual(Hash.new(nil), {});
		assert.deepEqual(Hash.new(10), {});
		assert.deepEqual(Hash.new("a"), {});
		assert.deepEqual(Hash.new(/\d/), {});
		assert.deepEqual(Hash.new({"foo":3}), {"foo":3});
		assert.deepEqual(Hash.new({"foo":3}).class(), 'Hash');
		assert.deepEqual(Hash.new({"foo":{"bar":2}})["foo"].class(), 'Hash');
	} else {
		assert.ok(Rubylike.Hash.new() instanceof Rubylike.Hash);
		assert.deepEqual(Rubylike.Hash.new(), new Object());
		assert.deepEqual(Rubylike.Hash.new(null), {});
		assert.deepEqual(Rubylike.Hash.new(10), {});
		assert.deepEqual(Rubylike.Hash.new("a"), {});
		assert.deepEqual(Rubylike.Hash.new(/\d/), {});
		assert.deepEqual(Rubylike.Hash.new({"foo":3}), {"foo":3});
		assert.deepEqual(Rubylike.Hash.new({"foo":3}).class(), 'Hash');
		assert.deepEqual(Rubylike.Hash.new({"foo":{"bar":2}})["foo"].class(), 'Hash');
	}
},

function storeTest () {
	var hash = {'foo':123};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.ok(hash.store('bar','value') === 'value');
		assert.deepEqual(hash, {'foo':123,'bar':'value'});
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.ok(hash.store('bar','value') === 'value');
		assert.deepEqual(hash, {'foo':123,'bar':'value'});
	}
},

function assocTest () {
	var hash = {"colors":["red","blue","green"],"letters":["a","b","c"]};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.assoc("letters"), ["letters",["a","b","c"]]);
		assert.deepEqual(hash.assoc("foo"), null);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.assoc("letters").to_a(), ["letters",["a","b","c"]]);
		assert.deepEqual(hash.assoc("foo"), null);
	}
},

function clearTest () {
	var hash = {'a':1,'b':2,'c':3};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.ok(hash.clear() === hash);
		assert.deepEqual(hash, {});
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.ok(hash.clear() === hash);
		assert.deepEqual(hash, {});
	}
},

function cloneTest () {
	var hash = {"have":"have a","as":"as a","array":[123]};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		var hash2 = hash.clone();
		hash2["have"] = "has";
		assert.deepEqual(hash2, {"have":"has","as":"as a","array":[123]});
		assert.deepEqual(hash, {"have":"have a","as":"as a","array":[123]});
		hash2["array"].splice(0, 1);
		assert.deepEqual(hash2, {"have":"has","as":"as a","array":[]});
		assert.deepEqual(hash, {"have":"have a","as":"as a","array":[]});
	} else {
		hash = Rubylike.Hash.new(hash);
		var hash2 = hash.clone();
		hash2["have"] = "has";
		assert.deepEqual(hash2, {"have":"has","as":"as a","array":[123]});
		assert.deepEqual(hash, {"have":"have a","as":"as a","array":[123]});
		hash2["array"].splice(0, 1);
		assert.deepEqual(hash2, {"have":"has","as":"as a","array":[]});
		assert.deepEqual(hash, {"have":"have a","as":"as a","array":[]});
	}
},

function deleteTest () {
	var hash = {"ab":"some","cd":"all"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.ok(hash.delete("ab") === "some");
		assert.ok(hash.delete("ef") === null);
		assert.ok(hash.delete("ef", function(key){return key+" Nothing"}) === "ef Nothing");
		assert.deepEqual(hash, {"cd":"all"});
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.ok(hash.delete("ab") === "some");
		assert.ok(hash.delete("ef") === null);
		assert.ok(hash.delete("ef", function(key){return key+" Nothing"}) === "ef Nothing");
		assert.deepEqual(hash, {"cd":"all"});
	}
},

function delete_ifTest () {
	var hash = {2:"8",4:"6",6:"4",8:"2"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.ok(hash.delete_if(function(key, value){ return +key < +value }) === hash);
		assert.deepEqual(hash, {6:"4",8:"2"});
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.ok(hash.delete_if(function(key, value){ return +key < +value }) === hash);
		assert.deepEqual(hash, {6:"4",8:"2"});
	}
},

function rejectTest () {
	var hash = {2:"8",4:"6",6:"4",8:"2"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.ok(hash.reject(function(key, value){ return +key < +value }) !== hash);
		assert.deepEqual(hash.reject(function(key, value){ return +key < +value }), {6:"4",8:"2"});
		assert.deepEqual(hash, {2:"8",4:"6",6:"4",8:"2"});
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.ok(hash.reject(function(key, value){ return +key < +value }) !== hash);
		assert.deepEqual(hash.reject(function(key, value){ return +key < +value }), {6:"4",8:"2"});
		assert.deepEqual(hash, {2:"8",4:"6",6:"4",8:"2"});
	}
},

function eachTest () {
	var ret = [];
	var i = 999;
	if (Rubylike.is_defined) {
		var hash = Hash.new({"a":100, 2:["some"], "c":"c"});
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
	} else {
		var hash = Rubylike.Hash.new({"a":100, 2:["some"], "c":"c"});
		var each_ret = hash.each(function(i){
			ret.push(i);
		});
		assert.deepEqual(ret.map(to_a), [[2,["some"]], ["a",100], ["c","c"]]);
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
	}
},

function each_keyTest () {
	var ret = [];
	var hash = {"a":100, 2:["some"], "c":"c"};
	if (Rubylike.is_defined) {
		var hash = Hash.new(hash);
		var each_ret = hash.each_key(function(i){ ret.push(i); });
		assert.deepEqual(ret, ["2", "a", "c"]);
		assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
		assert.ok(each_ret === hash);
	} else {
		var hash = Rubylike.Hash.new(hash);
		var each_ret = hash.each_key(function(i){ ret.push(i); });
		assert.deepEqual(ret, ["2", "a", "c"]);
		assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
		assert.ok(each_ret === hash);
	}
},

function each_valueTest () {
	var ret = [];
	var hash = {"a":100, 2:["some"], "c":"c"};
	if (Rubylike.is_defined) {
		var hash = Hash.new(hash);
		var each_ret = hash.each_value(function(i){ ret.push(i); });
		assert.deepEqual(ret, [["some"],100,"c"]);
		assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
		assert.ok(each_ret === hash);
	} else {
		var hash = Rubylike.Hash.new(hash);
		var each_ret = hash.each_value(function(i){ ret.push(i); });
		assert.deepEqual(ret, [["some"],100,"c"]);
		assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
		assert.ok(each_ret === hash);
	}
},

function emptyTest () {
	var hash = {};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.ok(hash.empty());
		assert.ok(!Hash.new({"a":1}).empty());
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.ok(hash.empty());
		assert.ok(!Rubylike.Hash.new({"a":1}).empty());
	}
},

function equalTest () {
	var hash = {"a":1};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.ok(!hash.equal({"a":1}));
		assert.ok(hash.equal(hash));
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.ok(!hash.equal({"a":1}));
		assert.ok(hash.equal(hash));
	}
},
// function fetchTest() {
// 	var hash = {"foo":123};
// 	if (Rubylike.is_defined) {
// 		hash = Hash.new(hash);
// 		assert.ok(hash.fetch("foo") === 123);
// 		assert.ok(hash.fetch("bar") === null);
// 		assert.ok(hash.fetch("bar", "error") === "error");
// 		assert.ok(hash.fetch("bar", function(key){ return key+" not exist"}) === "bar not exist");
// 		assert.ok(hash.fetch("bar", function(key){ return key+" not exist"}) === "bar not exist");
// 	} else {
// 		hash = Rubylike.Hash.new(hash);
// 	}
// },
function () {
	var hash = {};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
},
function () {
	var hash = {};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
},
function () {
	var hash = {};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
},
function () {
	var hash = {};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
},
function () {
	var hash = {};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
},
function () {
	var hash = {};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
},
function firstTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"a":1,"b":2});
		assert.deepEqual(hash.first(), ["a", 1]);
		assert.deepEqual(hash, {"a":1, "b":2});
	} else {
		var hash = Rubylike.Hash.new({"a":1,"b":2});
		assert.deepEqual(hash.first(), ["a", 1]);
		assert.deepEqual(hash, {"a":1, "b":2});
	}
},

function shiftTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"a":1,"b":2});
		assert.deepEqual(hash.shift(), ["a", 1]);
		assert.deepEqual(hash, {"b":2});
	} else {
		var hash = Rubylike.Hash.new({"a":1,"b":2});
		assert.deepEqual(hash.shift(), ["a", 1]);
		assert.deepEqual(hash, {"b":2});
	}
},

function to_aTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"a": 100, 2: ["some"], "c": "c"});
		assert.deepEqual(hash.to_a(), [[2, ["some"]], ["a", 100], ["c", "c"]]); // JavaScript hash are automatically sorted
		assert.deepEqual(hash, {"a": 100, 2: ["some"], "c": "c"});
	} else {
		var hash = Rubylike.Hash.new({"a": 100, 2: ["some"], "c": "c"});
		assert.deepEqual(hash.to_a(), [[2, ["some"]], ["a", 100], ["c", "c"]]); // JavaScript hash are automatically sorted
		assert.deepEqual(hash, {"a": 100, 2: ["some"], "c": "c"});
	}
},

function to_hashTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"a":100, 2:["some"], "c":"c"});
		assert.deepEqual(hash.to_hash(), {"a":100, 2:["some"], "c":"c"});
		assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
	} else {
		var hash = Rubylike.Hash.new({"a":100, 2:["some"], "c":"c"});
		assert.deepEqual(hash.to_hash(), {"a":100, 2:["some"], "c":"c"});
		assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
	}
},

function injectTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"a":1, "b":2, "c":3});
		var sum = 12345;
		var i = 100;
		var ret = hash.inject(function (sum, i) {
			return [sum[0] + i[0], sum[1] + i[1]];
		});
		assert.deepEqual(ret, ["abc", 6]);
		assert.strictEqual(sum, 12345);
		assert.strictEqual(i, 100);
	} else {
		var hash = Rubylike.Hash.new({"a":1, "b":2, "c":3});
		var sum = 12345;
		var i = 100;
		var ret = hash.inject(function (sum, i) {
			return [sum[0] + i[0], sum[1] + i[1]];
		});
		assert.deepEqual(ret, ["abc", 6]);
		assert.strictEqual(sum, 12345);
		assert.strictEqual(i, 100);
	}
},

function lengthTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.ok(hash.length(), 3);
	} else {
		var hash = Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.ok(hash.length(), 3);
	}
},

function sizeTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.ok(hash.size(), 3);
	} else {
		var hash = Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.ok(hash.size(), 3);
	}
},

function eqlTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.ok(hash.eql({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}}));
		assert.ok(hash.eql(Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}})));
		assert.ok(!hash.eql(Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":6}}}})));
	} else {
		var hash = Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.ok(hash.eql({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}}));
		assert.ok(hash.eql(Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}})));
		assert.ok(!hash.eql(Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":6}}}})));
	}
},

function keysTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.deepEqual(hash.keys(), ["1","b","c"]);
	} else {
		var hash = Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.deepEqual(hash.keys(), ["1","b","c"]);
	}
},

function keyTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.deepEqual(hash.key(1), "b");
		assert.deepEqual(hash.key("b"), 1);
		assert.deepEqual(hash.key({"d":{"e":{"f":5}}}), "c");
	} else {
		var hash = Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.deepEqual(hash.key(1), "b");
		assert.deepEqual(hash.key("b"), 1);
		assert.deepEqual(hash.key({"d":{"e":{"f":5}}}), "c");
	}
},

function mergeTest () {
	if (Rubylike.is_defined) {
		var hash = Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.deepEqual(hash.merge({'b':5,'c':'foo'}), {"1":"b","b":5,"c":"foo"});
		assert.deepEqual(hash, {"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
	} else {
		var hash = Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
		assert.deepEqual(hash.merge({'b':5,'c':'foo'}), {"1":"b","b":5,"c":"foo"});
		assert.deepEqual(hash, {"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
	}
},

];

if (typeof require === 'function') {
	var assert = require('assert');
	var Rubylike = require('../rubylike.js').Rubylike;
}
this.testCase = this.testCase || {};
this.testCase.Hash = testCase;
