var to_a = function(i){ return i.to_a() };

var test_case_hash = [

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
		assert.deepEqual(Hash.new(null), {});
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

function allTest () {
	var hash = {"a":1, "b":2};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.all() === true);
	assert.ok(hash.all(function(k){ return /\w/.test(k[0]) }) === true);
	assert.ok(hash.all(function(k,v){ return /\w/.test(k); }) === true);
	assert.ok(hash.all(function(k,v){ return v < 2 }) === false);
},

function anyTest () {
	var hash = {"a":1, "b":2};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.any() === true);
	assert.ok(hash.any(function(k){ return k[0] === "b" }) === true);
	assert.ok(hash.any(function(k,v){ return k === "a" }) === true);
	assert.ok(hash.any(function(k,v){ return 2 < v }) === false);
},

function assocTest () {
	var hash = {"colors":["red","blue","green"],"letters":["a","b","c"]};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.assoc("letters"), ["letters",["a","b","c"]]);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.assoc("letters").to_a(), ["letters",["a","b","c"]]);
	}
	assert.deepEqual(hash.assoc("foo"), null);
},

function clearTest () {
	var hash = {'a':1,'b':2,'c':3};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.clear() === hash);
	assert.deepEqual(hash, {});
},

function cloneTest () {
	var hash = {"have":"have a","as":"as a","array":[123]};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	var hash2 = hash.clone();
	hash2["have"] = "has";
	assert.deepEqual(hash2, {"have":"has","as":"as a","array":[123]});
	assert.deepEqual(hash, {"have":"have a","as":"as a","array":[123]});
	hash2["array"].splice(0, 1);
	assert.deepEqual(hash2, {"have":"has","as":"as a","array":[]});
	assert.deepEqual(hash, {"have":"have a","as":"as a","array":[]});
},

function collectTest () {
	var hash = {"a":1,"b":2,"c":3};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.collect(function(k){ return k[0] }), ["a","b","c"]);
		assert.deepEqual(hash.collect(function(k,v){ return v * v }), [1,4,9]);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.collect(function(k){ return k[0] }).to_a(), ["a","b","c"]);
		assert.deepEqual(hash.collect(function(k,v){ return v * v }).to_a(), [1,4,9]);
	}
},

function deleteTest () {
	var hash = {"ab":"some","cd":"all"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.delete("ab") === "some");
	assert.ok(hash.delete("ef") === null);
	assert.ok(hash.delete("ef", function(key){return key+" Nothing"}) === "ef Nothing");
	assert.deepEqual(hash, {"cd":"all"});
},

function delete_ifTest () {
	var hash = {2:"8",4:"6",6:"4",8:"2"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.delete_if(function(key, value){ return +key < +value }) === hash);
	assert.deepEqual(hash, {6:"4",8:"2"});
},

function rejectTest () {
	var hash = {2:"8",4:"6",6:"4",8:"2"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.reject(function(key, value){ return +key < +value }) !== hash);
	assert.deepEqual(hash.reject(function(key, value){ return +key < +value }), {6:"4",8:"2"});
	assert.deepEqual(hash, {2:"8",4:"6",6:"4",8:"2"});
},

function eachTest () {
	var hash = {"a":100, 2:["some"], "c":"c"};
	var ret = [];
	var i = 999;
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		var each_ret = hash.each(function(i){
			ret.push(i);
		});
		assert.deepEqual(ret, [["2",["some"]], ["a",100], ["c","c"]]);
	} else {
		hash = Rubylike.Hash.new(hash);
		var each_ret = hash.each(function(i){
			ret.push(i);
		});
		assert.deepEqual(ret.map(to_a), [["2",["some"]], ["a",100], ["c","c"]]);
	}
	assert.deepEqual(hash, {"a":100, "2":["some"], "c":"c"});
	assert.strictEqual(i, 999);
	assert.deepEqual(each_ret, hash);

	ret = [];
	each_ret = hash.each(function(key, value){
		ret.push([key, value]);
	});
	assert.deepEqual(ret, [["2",["some"]], ["a",100], ["c","c"]]);
	assert.deepEqual(hash, {"a":100, "2":["some"], "c":"c"});
	assert.strictEqual(i, 999);
	assert.deepEqual(each_ret, hash);
},

function each_consTest () {
	var ret = [];
	var hash = {"a":100, 2:["some"], "c":"c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.each_cons(2, function(i){ ret.push(i); }) === null);
	assert.deepEqual(ret, [[["2",["some"]],["a",100]],[["a",100],["c","c"]]]);
	ret = [];
	assert.ok(hash.each_cons(2, function(i,j){ ret.push(j); }) === null);
	assert.deepEqual(ret, [["a",100],["c","c"]]);
},

function each_sliceTest () {
	var ret = [];
	var hash = {"a":100, "b":["some"], "c":"c", "d":"foo", "e":"bar"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.each_slice(2, function(i){ ret.push(i); }) === null);
	assert.deepEqual(ret, [[["a",100],["b",["some"]]],[["c","c"],["d","foo"]],[["e","bar"]]]);
	ret = [];
	assert.ok(hash.each_slice(2, function(i,j){ ret.push(j); }) === null);
	assert.deepEqual(ret, [["b",["some"]],["d","foo"],undefined]);
},

function each_keyTest () {
	var ret = [];
	var hash = {"a":100, 2:["some"], "c":"c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	var each_ret = hash.each_key(function(i){ ret.push(i); });
	assert.deepEqual(ret, ["2", "a", "c"]);
	assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
	assert.ok(each_ret === hash);
},

function each_valueTest () {
	var ret = [];
	var hash = {"a":100, 2:["some"], "c":"c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	var each_ret = hash.each_value(function(i){ ret.push(i); });
	assert.deepEqual(ret, [["some"],100,"c"]);
	assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
	assert.ok(each_ret === hash);
},

function each_with_indexTest () {
	var ret = [];
	var hash = {"a":100, "b":["some"], "c":"c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.each_with_index(function(item,index){ ret.push([item,index]); }) === hash);
	assert.deepEqual(ret, [[["a",100],0],[["b",["some"],1]],[["c","c"],2]]);
	assert.ok(false);
},

function each_with_objectTest () {
	var ret = [];
	var hash = {"a":100, 2:["some"], "c":"c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.each_with_object(function(item,index){ ret.push(i); }) === hash);
	assert.ok(false);
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
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(!hash.equal({"a":1}));
	assert.ok(hash.equal(hash));
},

function fetchTest () {
	var hash = {"foo":123};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.fetch("foo") === 123);
	assert.ok(hash.fetch("bar") === null);
	assert.ok(hash.fetch("bar", "error") === "error");
	assert.ok(hash.fetch("bar", function(key){ return key+" not exist"}) === "bar not exist");
},

function flattenTest () {
	var hash = {1:"one",2:[2,"two"],3:"three"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.flatten(), ["1","one","2",[2,"two"],"3","three"]);
		assert.deepEqual(hash.flatten(1), ["1","one","2",[2,"two"],"3","three"]);
		assert.deepEqual(hash.flatten(2), ["1","one","2",2,"two","3","three"]);
		assert.deepEqual(hash.flatten(0), [["1","one"],["2",[2,"two"]],["3","three"]]);
		assert.deepEqual(hash.flatten(-1), ["1","one","2",2,"two","3","three"]);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.flatten().to_a(), ["1","one","2",[2,"two"],"3","three"]);
		assert.deepEqual(hash.flatten(1).to_a(), ["1","one","2",[2,"two"],"3","three"]);
		assert.deepEqual(hash.flatten(2).to_a(), ["1","one","2",2,"two","3","three"]);
		assert.deepEqual(hash.flatten(0).map(to_a).to_a(), [["1","one"],["2",[2,"two"]],["3","three"]]);
		assert.deepEqual(hash.flatten(-1).to_a(), ["1","one","2",2,"two","3","three"]);
	}
},

function countTest () {
	var hash = {1:"one",2:null,3:undefined,4:"four",5:5};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.count(), 5);
	assert.ok(hash.count(["1","one"]), 1);
	assert.ok(hash.count(function(i){ return !i[1] }), 2);
	assert.ok(hash.count(function(i,j){ return !j }), 2);
},

function cycleTest () {
	var hash = {1:"one",2:"two",3:"three"};
	var tmp = [];
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.cycle(3, function(i){ i[1] = i[1]+'!'; tmp.push(i[1]); }) === null);
	assert.deepEqual(tmp, ['one!','two!','three!','one!!','two!!','three!!','one!!!','two!!!','three!!!']);
	assert.throws(function(){ hash.cycle() });
	assert.throws(function(){ hash.cycle(function(){}) });
},

function findTest () {
	var hash = {1:"one",2:"two",3:"three"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.deepEqual(hash.find(function(i){ return i[1] === "one" }), [1,"one"]);
	assert.deepEqual(hash.find(function(i,j){ return j === "one" }), [1,"one"]);
	assert.deepEqual(hash.find(function(i,j){ return i === '3' }), ['3','three']);
	assert.ok(hash.find("not found", function(i,j){ return i === '4' }) === "not found");
	assert.ok(hash.find(function(i,j){ return i === '4' }) === null);
},

function has_keyTest () {
	var hash = {1:"one",2:null,3:undefined};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.has_key(1));
	assert.ok(hash.has_key(2));
	assert.ok(hash.has_key(3));
	assert.ok(!hash.has_key(4));
},

function has_valueTest () {
	var hash = {1:"one",2:null,3:undefined,4:{"foo":5}};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.has_value("one") === true);
	assert.ok(hash.has_value(null) === true);
	assert.ok(hash.has_value(undefined) === true);
	assert.ok(hash.has_value() === true);
	assert.ok(hash.has_value({"foo":5}) === true);
	assert.ok(hash.has_value(5) === false);
},

function to_sTest () {
	var hash = {"c":300,"a":100,"d":400,"c":300};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.strictEqual(hash.to_s(), "{\"c\":300,\"a\":100,\"d\":400}");
},

function invertTest () {
	var hash = {"a":0,"b":100,"c":200,"d":300,"e":300};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.deepEqual(hash.invert(), {0:"a",100:"b",200:"c",300:"e"})
},

function keep_ifTest () {
	var hash = {1:"one",2:"two",3:"three"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.keep_if(function(key, value){ return 2 < key}) === hash);
	assert.deepEqual(hash, {3:"three"});
},

function selectTest () {
	var hash = {"a":100,"b":200,"c":300};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.deepEqual(hash.select(function(k,v){ return "a" < k }), {"b":200,"c":300});
	assert.deepEqual(hash.select(function(k,v){ return v < 200 }), {"a":100});
},

function rassocTest () {
	var hash = {1:"one",2:"two",3:"three","ii":"two"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.rassoc("two"), ["2","two"]);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.rassoc("two").to_a(), ["2","two"]);
	}
	assert.ok(hash.rassoc("four") === null);
	
},

function replaceTest () {
	var hash = {1:'a',2:'b'};
	var bar = {2:'B',3:'C'};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.replace(bar) === hash);
	assert.deepEqual(hash, {2:'B',3:'C'});
},

function firstTest () {
	var hash = {"a":1,"b":2};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.first(), ["a", 1]);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.first().to_a(), ["a", 1]);
	}
	assert.deepEqual(hash, {"a":1, "b":2});
},

function storeTest () {
	var hash = {'foo':123};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.store('bar','value') === 'value');
	assert.deepEqual(hash, {'foo':123,'bar':'value'});
},

function shiftTest () {
	var hash = {"a":1,"b":2};
	if (Rubylike.is_defined) {
		var hash = Hash.new(hash);
		assert.deepEqual(hash.shift(), ["a", 1]);
	} else {
		var hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.shift().to_a(), ["a", 1]);
	}
	assert.deepEqual(hash, {"b":2});
},

function sortTest () {
	var hash = {"a":20,"c":10,"b":30};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.sort(), [["a",20],["b",30],["c",10]]);
		assert.deepEqual(hash.sort(function(a,b){ return Rubylike.ship(a[1],b[1]) }), [["c",10],["a",20],["b",30]]);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.sort().map(to_a).to_a(), [["a",20],["b",30],["c",10]]);
		assert.deepEqual(hash.sort(function(a,b){ return Rubylike.ship(a[1],b[1]) }).map(to_a).to_a(), [["c",10],["a",20],["b",30]]);
	}
},

function updateTest () {
	var hash = {1:'a',2:'b',3:'c'};
	var bar  = {2:'B',3:'C',4:'D'};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.update(bar) === hash);
	assert.deepEqual(hash, {1:"a",2:"B",3:"C",4:"D"});
	assert.deepEqual(hash.update(bar,function(key,hash_val,bar_val){ return hash_val + bar_val }), {1:"a",2:"BB",3:"CC",4:"DD"});
},

function valuesTest () {
	var hash = {"a":100,2:["some"],c:"c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.values(), [["some"],100,"c"]);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.values().to_a(), [["some"],100,"c"]);
	}
	assert.deepEqual(hash, {"a":100,2:["some"],c:"c"});
},
function values_at () {
	var hash = {1:"a",2:"b",3:"c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.values_at(), []);
		assert.deepEqual(hash.values_at(1,3,4), ["a","c",null]);
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.values_at().to_a(), []);
		assert.deepEqual(hash.values_at(1,3,4).to_a(), ["a","c",null]);
	}
},

function to_aTest () {
	var hash = {"a": 100, 2: ["some"], "c": "c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.deepEqual(hash.to_a(), [["2", ["some"]], ["a", 100], ["c", "c"]]); // JavaScript hash are automatically sorted
	assert.deepEqual(hash, {"a": 100, "2": ["some"], "c": "c"});
},

function to_hashTest () {
	var hash = {"a":100, 2:["some"], "c":"c"};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.deepEqual(hash.to_hash(), {"a":100, 2:["some"], "c":"c"});
	assert.deepEqual(hash, {"a":100, 2:["some"], "c":"c"});
},

function injectTest () {
	var hash = {"a":1, "b":2, "c":3};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
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
	var hash = {"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}};
	if (Rubylike.is_defined) {
		var hash = Hash.new(hash);
	} else {
		var hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.length(), 3);
},

function sizeTest () {
	var hash = {"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.ok(hash.size(), 3);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.size(), 3);
},

function eqlTest () {
	var hash = {"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.ok(hash.eql({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}}));
	assert.ok(hash.eql(Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}})));
	assert.ok(!hash.eql(Rubylike.Hash.new({"b":1, 1:"b", "c":{"d":{"e":{"f":6}}}})));
},

function keysTest () {
	var hash = {"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
	} else {
		hash = Rubylike.Hash.new(hash);
	}
	assert.deepEqual(hash.keys(), ["1","b","c"]);
},

function keyTest () {
	var hash = {"b":1,1:"b","c":{"d":{"e":{"f":5}}}};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		assert.deepEqual(hash.key(1), "b");
	} else {
		hash = Rubylike.Hash.new(hash);
		assert.deepEqual(hash.key(1), "b");
	}
	assert.deepEqual(hash.key("b"), "1");
	assert.deepEqual(hash.key({"d":{"e":{"f":5}}}), "c");
},

function mergeTest () {
	var hash = {"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}};
	var bar = {'b':5,'c':'foo'};
	if (Rubylike.is_defined) {
		hash = Hash.new(hash);
		bar = Hash.new(bar);
	} else {
		hash = Rubylike.Hash.new(hash);
		bar = Rubylike.Hash.new(bar);
	}
	assert.deepEqual(hash.merge(bar), {"1":"b","b":5,"c":"foo"});
	assert.deepEqual(hash.merge({'b':5,'c':'foo'}), {"1":"b","b":5,"c":"foo"});
	assert.deepEqual(hash, {"b":1, 1:"b", "c":{"d":{"e":{"f":5}}}});
	assert.deepEqual(hash.merge({'c':100},function(key,a_value,b_value){ return 'same' }), {"1":"b","b":1,"c":"same"});
},

];

if (typeof require === 'function') {
	var assert = require('assert');
	var Rubylike = require('../rubylike.js').Rubylike;
}
this.testCase = this.testCase || {};
this.testCase.Hash = test_case_hash;
