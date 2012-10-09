var to_a = function (i) { return i.to_a() };
var testCase = [

function classTest () {
	if (Rubylike.is_defined) {
		assert.strictEqual(Array.class(), 'Function');
	} else {
		assert.strictEqual(Rubylike.Object.prototype.class.call(Array), 'Function');
	}
},

function instanceTest () {
	if (Rubylike.is_defined) {
		assert.strictEqual(Array.new().class(), 'Array');
	} else {
		assert.strictEqual(Rubylike.Object.prototype.class.call(Rubylike.Array.new()), 'Array');
	}
},

function newTest () {
	if (Rubylike.is_defined) {
		assert.deepEqual(Array.new(), []);
		assert.deepEqual(Array.new(3), [nil,nil,nil]);
		assert.deepEqual(Array.new(3, 0), [0,0,0]);
		assert.deepEqual(Array.new([1,2,3]), [1,2,3]);
		assert.deepEqual(Array.new(3, {"foo":5}).to_a(), [{"foo":5},{"foo":5},{"foo":5}]);
		assert.throws(function(){Array.new("foo")});
		assert.throws(function(){Array.new("1")});
		assert.throws(function(){Array.new({})});
		assert.throws(function(){Array.new(null)});
		assert.throws(function(){Array.new(function(){})});
	} else {
		assert.deepEqual(Rubylike.Array.new(), {length:0});
		assert.deepEqual(Rubylike.Array.new(3), {0:null,1:null,2:null,length:3});
		assert.deepEqual(Rubylike.Array.new(3, 0), {0:0,1:0,2:0,length:3});
		assert.deepEqual(Rubylike.Array.new([1,2,3]), {0:1,1:2,2:3,length:3});
		assert.deepEqual(Rubylike.Array.new(3, {"foo":5}), {0:{"foo":5},1:{"foo":5},2:{"foo":5},length:3});
		assert.throws(function(){Rubylike.Array.new("foo")});
		assert.throws(function(){Rubylike.Array.new("1")});
		assert.throws(function(){Rubylike.Array.new({})});
		assert.throws(function(){Rubylike.Array.new(null)});
		assert.throws(function(){Rubylike.Array.new(function(){})});
	}
},

function to_aTest () {
	var fn = function(){};
	var array = [1,Rubylike.Array.new(),[3],{4:5},"6",null,undefined,{},/\s/,fn];
	if (Rubylike.is_defined) {
		assert.deepEqual(array, [1,[],[3],{4:5},"6",null,undefined,{},/\s/,fn]);
		assert.deepEqual(array.to_a(), [1,[],[3],{4:5},"6",null,undefined,{},/\s/,fn]);
		assert.deepEqual(array, [1,[],[3],{4:5},"6",null,undefined,{},/\s/,fn]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array, {0:1,1:{length:0},2:[3],3:{4:5},4:"6",5:null,6:undefined,7:{},8:/\s/,9:fn,length:10});
		assert.deepEqual(array.to_a(), [1,{length:0},[3],{4:5},"6",null,undefined,{},/\s/,fn]);
		assert.deepEqual(array, {0:1,1:{length:0},2:[3],3:{4:5},4:"6",5:null,6:undefined,7:{},8:/\s/,9:fn,length:10});
	}
},

function to_ary () {
	var array = [1,2,3];
	if (Rubylike.is_defined) {
		assert.ok(array.to_ary() === array);
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.to_ary() === array);
		assert.deepEqual(array.to_ary(), {0:1,1:2,2:3,length:3});
	}
},

function assocTest () {
	var array = [[1,15], Rubylike.Array.new([2,25]), ["foo",35], [{"a":3},3]];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.assoc(2), [2,25]);
		assert.strictEqual(array.assoc(100), nil);
		assert.strictEqual(array.assoc(15), nil);
		assert.deepEqual(array.assoc("foo"), ["foo",35]);
		assert.deepEqual(array.assoc({"a":3}), [{"a":3},3]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.assoc(2), {0:2,1:25,length:2});
		assert.strictEqual(array.assoc(100), null);
		assert.strictEqual(array.assoc(15), null);
		assert.deepEqual(array.assoc("foo"), ["foo",35]);
		assert.deepEqual(array.assoc({"a":3}), [{"a":3},3]);
	}
},

function atTest () {
	var array = [0,1,2,"foo"];
	if (Rubylike.is_defined) {
		assert.strictEqual(array.at(1), 1);
		assert.strictEqual(array.at(3), "foo");
		assert.strictEqual(array.at(-1), "foo");
		assert.strictEqual(array.at(-2), 2);
		assert.strictEqual(array.at(10), nil);
		assert.strictEqual(array.at(-10), nil);
		assert.throws(function(){array.at("at")});
		assert.throws(function(){array.at(function(){})});
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.at(1), 1);
		assert.strictEqual(array.at(3), "foo");
		assert.strictEqual(array.at(-1), "foo");
		assert.strictEqual(array.at(-2), 2);
		assert.strictEqual(array.at(10), null);
		assert.strictEqual(array.at(-10), null);
		assert.throws(function(){array.at("at")});
		assert.throws(function(){array.at(function(){})});
	}
},

function clearTest () {
	var array = [1,2,3];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.strictEqual(array.clear(), copy);
		assert.ok(array === copy);
		assert.deepEqual(array, []);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.strictEqual(array.clear(), copy);
		assert.ok(array === copy);
		assert.deepEqual(array, {length:0});
	}
},

function cloneTest () {
	var array = [{"foo":1}];
	var copy;
	if (Rubylike.is_defined) {
		copy = array.clone();
		assert.ok(array !== copy);
		assert.ok(array[0] === copy[0]);
	} else {
		array = Rubylike.Array.new();
		copy = array.clone();
		assert.ok(array !== copy);
		assert.ok(array[0] === copy[0]);
	}
},

function collectTest () {
	var array = [10,20,30];
	var collect;
	if (Rubylike.is_defined) {
		collect = array.collect(function(i){return i * 10});
		assert.deepEqual(collect, [100,200,300]);
	} else {
		array = Rubylike.Array.new(array);
		collect = array.collect(function(i){return i * 10});
		assert.deepEqual(collect, {0:100,1:200,2:300,length:3});
	}
},

function combinationTest () {
	var array = [1,2,3,4];
	var copy, tmp, ret;
	if (Rubylike.is_defined) {
		copy = array;
		tmp = [];
		ret = array.combination(1,function(i){
			tmp.push(i[0] + 3);
			return tmp;
		});
		assert.deepEqual(array.combination(1), [[1],[2],[3],[4]]);
		assert.deepEqual(array.combination(2), [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]);
		assert.deepEqual(array.combination(3), [[1,2,3],[1,2,4],[1,3,4],[2,3,4]]);
		assert.deepEqual(array.combination(4), [[1,2,3,4]]);
		assert.deepEqual(array.combination(0), [[]]);
		assert.deepEqual(array.combination(5), []);
		assert.deepEqual(array.combination(6), []);
		assert.deepEqual(array.combination(-1), []);
		assert.ok(array === ret);
		assert.ok(array === copy);
		assert.deepEqual(tmp, [4,5,6,7]);
		assert.throws(function(){array.combination()});
		assert.throws(function(){array.combination("1")});
		assert.throws(function(){array.combination("a")});
		assert.throws(function(){array.combination(function(){return 1})});
		assert.throws(function(){array.combination([])});
		assert.throws(function(){array.combination({})});
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		tmp = [];
		ret = array.combination(1,function(i){
			tmp.push(i[0] + 3);
			return tmp;
		});
		assert.deepEqual(array.combination(1).to_a(), [[1],[2],[3],[4]]);
		assert.deepEqual(array.combination(2).to_a(), [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]);
		assert.deepEqual(array.combination(3).to_a(), [[1,2,3],[1,2,4],[1,3,4],[2,3,4]]);
		assert.deepEqual(array.combination(4).to_a(), [[1,2,3,4]]);
		assert.deepEqual(array.combination(0).to_a(), [[]]);
		assert.deepEqual(array.combination(5).to_a(), []);
		assert.deepEqual(array.combination(6).to_a(), []);
		assert.deepEqual(array.combination(-1).to_a(), []);
		assert.ok(array === ret);
		assert.ok(array === copy);
		assert.deepEqual(tmp, [4,5,6,7]);
		assert.throws(function(){array.combination()});
		assert.throws(function(){array.combination("1")});
		assert.throws(function(){array.combination("a")});
		assert.throws(function(){array.combination(function(){return 1})});
		assert.throws(function(){array.combination([])});
		assert.throws(function(){array.combination({})});
	}
},

function compactTest () {
	var array = [1,null,2,null,3,null];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.compact(), [1,2,3]);
		assert.deepEqual(array, [1,nil,2,nil,3,nil]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.compact().to_a(), [1,2,3]);
		assert.deepEqual(array.to_a(), [1,null,2,null,3,null]);
	}
},

function concatTest () {
	var array = [1,2];
	var a = [3,4];
	if (Rubylike.is_defined) {
		assert.ok(array.concat(a) === array);
		assert.deepEqual(array, [1,2,3,4]);
		assert.deepEqual(a, [3,4]);
	} else {
		array = Rubylike.Array.new(array);
		a = Rubylike.Array.new(a);
		assert.ok(array.concat(a) === array);
		assert.deepEqual(array.to_a(), [1,2,3,4]);
		assert.deepEqual(a.to_a(), [3,4]);
	}
},

function rejectTest () {
	var array = [1,2,3,2,1];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.reject(function(i){return i === 2}), [1,3,1]);
		assert.deepEqual(array.reject(function(i){return i === 5}), nil);
		assert.ok(array === copy);
		assert.deepEqual(array,[1,2,3,2,1]);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.reject(function(i){return i === 2}).to_a(), [1,3,1]);
		assert.deepEqual(array.reject(function(i){return i === 5}), null);
		assert.ok(array === copy);
		assert.deepEqual(array.to_a(),[1,2,3,2,1]);
	}
},

function delete_ifTest () {
	var array = [1,2,3,2,1];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.delete_if(function(i){return i === 2}), [1,3,1]);
		assert.ok(array === copy);
		assert.deepEqual(array, [1,3,1]);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.delete_if(function(i){return i === 2}).to_a(), [1,3,1]);
		assert.ok(array === copy);
		assert.deepEqual(array.to_a(), [1,3,1]);
	}
},

function cycleTest () {
	var array = [1,2,3];
	var copy;
	var tmp = [];
	var n = 0;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.cycle(1,function(i){return tmp.push(i)}), nil);
		assert.deepEqual(array.cycle(3,function(i){return tmp.push(i)}), nil);
		assert.deepEqual(array.cycle(7,function(i){return tmp.push(i)}), nil);
		assert.throws(function(){ array.cycle() });
		assert.throws(function(){ array.cycle(function(i){return;}) });
		assert.deepEqual(tmp, [1,1,2,3,1,2,3,1,2,3,1]);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.cycle(1,function(i){return tmp.push(i)}), null);
		assert.deepEqual(array.cycle(3,function(i){return tmp.push(i)}), null);
		assert.deepEqual(array.cycle(7,function(i){return tmp.push(i)}), null);
		assert.throws(function(){ array.cycle() });
		assert.throws(function(){ array.cycle(function(i){return;}) });
		assert.deepEqual(tmp, [1,1,2,3,1,2,3,1,2,3,1]);
	}
},

function deleteTest () {
	var array = [1,2,3,2,1];
	var tmp = [];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.delete(10), nil);
		assert.deepEqual(array.delete(2), 2);
		assert.deepEqual(array, [1,3,1]);
		assert.deepEqual(array.delete(1,function(i){tmp.push(i)}), 1);
		assert.deepEqual(tmp, [3]);
		assert.deepEqual(array, [3]);
		assert.ok(array === copy);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.delete(10), null);
		assert.deepEqual(array.delete(2), 2);
		assert.deepEqual(array.to_a(), [1,3,1]);
		assert.deepEqual(array.delete(1,function(i){tmp.push(i)}), 1);
		assert.deepEqual(tmp, [3]);
		assert.deepEqual(array.to_a(), [3]);
		assert.ok(array === copy);
	}
},

function delete_atTest () {
	var array = [0,1,2,3,4];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.ok(array.delete_at(2) === 2);
		assert.deepEqual(array, [0,1,3,4]);
		assert.ok(array.delete_at(10) === null);
		assert.deepEqual(array, [0,1,3,4]);
		assert.ok(array.delete_at(-2) === 3);
		assert.deepEqual(array, [0,1,4]);
		assert.ok(array.delete_at(-10) === null);
		assert.deepEqual(array, [0,1,4]);
		assert.ok(array.delete_at(2) === 4);
		assert.deepEqual(array, [0,1]);
		assert.ok(array === copy);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.ok(array.delete_at(2) === 2);
		assert.deepEqual(array.to_a(), [0,1,3,4]);
		assert.ok(array.delete_at(10) === null);
		assert.deepEqual(array.to_a(), [0,1,3,4]);
		assert.ok(array.delete_at(-2) === 3);
		assert.deepEqual(array.to_a(), [0,1,4]);
		assert.ok(array.delete_at(-10) === null);
		assert.deepEqual(array.to_a(), [0,1,4]);
		assert.ok(array.delete_at(2) === 4);
		assert.deepEqual(array.to_a(), [0,1]);
		assert.ok(array === copy);
	}
},

function eachTest () {
	var array = [1,3,5];
	var i = 0;
	var tmp = [];
	var ret;
	if (Rubylike.is_defined) {
		ret = array.each(function (i) {
			tmp.push(i);
		});
		assert.ok(i === 0);
		assert.deepEqual(array, [1,3,5]);
		assert.deepEqual(tmp, [1,3,5]);
		assert.ok(array === ret);
		assert.ok(array !== tmp);
	} else {
		array = Rubylike.Array.new(array);
		ret = array.each(function (i) {
			tmp.push(i);
		});
		assert.ok(i === 0);
		assert.deepEqual(array.to_a(), [1,3,5]);
		assert.deepEqual(tmp, [1,3,5]);
		assert.ok(array === ret);
		assert.ok(array !== tmp);
	}
},

function each_indexTest () {
	var array = [1,3,5];
	var tmp = [];
	if (Rubylike.is_defined) {
		assert.deepEqual(array, [1,3,5]);
		assert.ok(array === array.each_index(function (i) {tmp.push(i)}));
		assert.deepEqual(tmp, [0,1,2]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.to_a(), [1,3,5]);
		assert.ok(array === array.each_index(function (i) {tmp.push(i)}));
		assert.deepEqual(tmp, [0,1,2]);
	}
},

function each_with_indexTest () {
	var array = [1,3,5];
	var tmp = [];
	if (Rubylike.is_defined) {
		assert.deepEqual(array, [1,3,5]);
		assert.ok(array === array.each_with_index(function (item, index) {tmp.push([item, index])}));
		assert.deepEqual(tmp, [[1,0],[3,1],[5,2]]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.to_a(), [1,3,5]);
		assert.ok(array === array.each_with_index(function (item, index) {tmp.push([item, index])}));
		assert.deepEqual(tmp, [[1,0],[3,1],[5,2]]);
	}
},

function eqlTest () {
	var array = [1,"2",{"a":{"b":3}},[[4]],-5];
	if (Rubylike.is_defined) {
		assert.ok(array.eql([1,"2",{"a":{"b":3}},[[4]],-5]));
		assert.ok([].eql([]));
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.eql.call(array.to_a(), [1,"2",{"a":{"b":3}},[[4]],-5]));
		assert.ok(Rubylike.Array.new().eql({length:0}));
	}
},

function fetchTest () {
	var array = [1,2,3,4,5];
	if (Rubylike.is_defined) {
		assert.ok(array.fetch(1) === 2);
		assert.ok(array.fetch(10, 999) === 999);
		assert.ok(array.fetch(10, function(i){return i+" is out"}) === "10 is out");
		assert.throws(function(){array.fetch()});
		assert.throws(function(){array.fetch(10)});
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.fetch(1) === 2);
		assert.ok(array.fetch(10, 999) === 999);
		assert.ok(array.fetch(10, function(i){return i+" is out"}) === "10 is out");
		assert.throws(function(){array.fetch()});
		assert.throws(function(){array.fetch(10)});
	}
},

function fillTest () {
	var a = [0,1,2,3,4];
	if (Rubylike.is_defined) {
		assert.deepEqual(a.fill(10), [10,10,10,10,10]);
		assert.deepEqual(a.fill("a"), ["a","a","a","a","a"]);
		assert.deepEqual(a.fill(["a"]), [["a"],["a"],["a"],["a"],["a"]]);
		a[0].push("b");
		assert.deepEqual(a, [["a","b"],["a","b"],["a","b"],["a","b"],["a","b"]]);
		assert.ok(a[0] === a[1]);
		assert.deepEqual(a.fill("x",3,5), [["a","b"],["a","b"],["a","b"],"x","x","x","x","x"]);
		assert.deepEqual(a.fill(function(i){return i}), [0,1,2,3,4,5,6,7]);
		assert.deepEqual(a.fill(3, function(i){return i-3}), [0,1,2,0,1,2,3,4]);
		assert.deepEqual(a.fill(0, 3), [0,1,2,0,0,0,0,0]);
		assert.deepEqual(a.fill(4, 5, function(i){return i}), [0,1,2,0,4,5,6,7,8]);
		assert.throws(function(){a.fill()});
		assert.throws(function(){a.fill(0,0,0,0)});
	} else {
		a = Rubylike.Array.new(a);
		assert.deepEqual(a.fill(10).to_a(), [10,10,10,10,10]);
		assert.deepEqual(a.fill("a").to_a(), ["a","a","a","a","a"]);
		assert.deepEqual(a.fill(["a"]).to_a(), [["a"],["a"],["a"],["a"],["a"]]);
		a[0].push("b");
		assert.deepEqual(a.to_a(), [["a","b"],["a","b"],["a","b"],["a","b"],["a","b"]]);
		assert.ok(a[0] === a[1]);
		assert.deepEqual(a.fill("x",3,5).to_a(), [["a","b"],["a","b"],["a","b"],"x","x","x","x","x"]);
		assert.deepEqual(a.fill(function(i){return i}).to_a(), [0,1,2,3,4,5,6,7]);
		assert.deepEqual(a.fill(3, function(i){return i-3}).to_a(), [0,1,2,0,1,2,3,4]);
		assert.deepEqual(a.fill(0, 3).to_a(), [0,1,2,0,0,0,0,0]);
		assert.deepEqual(a.fill(4, 5, function(i){return i}).to_a(), [0,1,2,0,4,5,6,7,8]);
		assert.throws(function(){a.fill()});
		assert.throws(function(){a.fill(0,0,0,0)});
	}
},

function firstTest () {
	var array = [1,2,3];
	if (Rubylike.is_defined) {
		assert.strictEqual(array.first(), 1);
		assert.deepEqual(array.first(2), [1,2]);
		assert.ok(array.first(2) !== array);
		assert.ok(array.first(10) === array);
		assert.deepEqual(array, [1,2,3]);
		assert.throws(function(){array.first(-1)});
		assert.throws(function(){array.first("1")});
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.first(), 1);
		assert.deepEqual(array.first(2).to_a(), [1,2]);
		assert.ok(array.first(2) !== array);
		assert.ok(array.first(10) === array);
		assert.deepEqual(array.to_a(), [1,2,3]);
		assert.throws(function(){array.first(-1)});
		assert.throws(function(){array.first("1")});
	}
},

function flattenTest () {
	var array = [1,[2,3,[4],5]];
	var copy;
	if (Rubylike.is_defined) {
		copy = array;
		assert.deepEqual(array.flatten(), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(1), [1,2,3,[4],5]);
		assert.deepEqual(array.flatten(10), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(0), [1,[2,3,[4],5]]);
		assert.ok(array.flatten(0) !== array);
		assert.deepEqual(array.flatten(null), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(undefined), [1,2,3,4,5]);
		assert.deepEqual(array, [1,[2,3,[4],5]]);
		assert.ok(array === copy);
		assert.throws(function(){array.flatten("1")});
		assert.throws(function(){array.flatten([1])});
		assert.deepEqual([1,null,2,undefined,[],3].flatten(), [1,null,2,undefined,3]);
	} else {
		array = Rubylike.Array.new(array);
		copy = array;
		assert.deepEqual(array.flatten().to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(1).to_a(), [1,2,3,[4],5]);
		assert.deepEqual(array.flatten(10).to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(0).to_a(), [1,[2,3,[4],5]]);
		assert.ok(array.flatten(0) !== array);
		assert.deepEqual(array.flatten(null).to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.flatten(undefined).to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.to_a(), [1,[2,3,[4],5]]);
		assert.ok(array === copy);
		assert.throws(function(){array.flatten("1")});
		assert.throws(function(){array.flatten([1])});
		assert.deepEqual(Rubylike.Array.new([1,null,2,undefined,[],3]).flatten().to_a(), [1,null,2,undefined,3]);
	}
},

function includeTest () {
	var array = ["a","b","c",Rubylike.Array.new([3])];
	if (Rubylike.is_defined) {
		assert.ok(array.include("b"));
		assert.ok(!array.include("z"));
		assert.ok(array.include([3]));
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.include("b"));
		assert.ok(!array.include("z"));
		assert.ok(array.include(Rubylike.Array.new([3])));
	}
},

function indexTest () {
	if (Rubylike.is_defined) {
		assert.ok([1,0,0,1,0].index(1) === 0);
		assert.ok([1,0,0,0,0].index(1) === 0);
		assert.ok([0,0,0,0,0].index(1) === null);
		assert.ok([0,1,0,1,0].index(function(v){ return v > 0 }) === 1);
		assert.ok([1,0,0,"1",0].index("1") === 3);
	} else {
		assert.ok(Rubylike.Array.new([1,0,0,1,0]).index(1) === 0);
		assert.ok(Rubylike.Array.new([1,0,0,0,0]).index(1) === 0);
		assert.ok(Rubylike.Array.new([0,0,0,0,0]).index(1) === null);
		assert.ok(Rubylike.Array.new([0,1,0,1,0]).index(function(v){ return v > 0 }) === 1);
		assert.ok(Rubylike.Array.new([1,0,0,"1",0]).index("1") === 3);
	}
},

function injectTest () {
	var array = [1,2,3,4,5];
	if (Rubylike.is_defined) {
		assert.strictEqual(array.inject(function(sum, i){ return sum * i }), 120);
		assert.ok(array.inject(10, function(sum, i){ return sum * i }), 1200);
		assert.ok([].inject() === null);
		assert.ok([3].inject() === 3);
		assert.ok([].inject(1,function(){}) === 1);
		assert.throws(function(){[2,3].inject()});
		assert.throws(function(){[].inject(1)});
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.inject(function(sum, i){ return sum * i }), 120);
		assert.ok(array.inject(10, function(sum, i){ return sum * i }), 1200);
		assert.ok(Rubylike.Array.new().inject() === null);
		assert.ok(Rubylike.Array.new([3]).inject() === 3);
		assert.ok(Rubylike.Array.new().inject(1,function(i){return i}) === 1);
		assert.throws(function(){Rubylike.Array.new([2,3]).inject()});
		assert.throws(function(){Rubylike.Array.new().inject(1)});
	}
},

function insertTest () {
	var array = [1,2,3];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.insert(2,"a","b"), [1,2,"a","b",3]);
		assert.deepEqual(array.insert(-2,"X"), [1,2,"a","b","X",3]);
		assert.deepEqual([].insert(2,1), [null,null,1]);
		assert.throws(function(){array.insert()});
		assert.throws(function(){array.insert("2",1)});
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.insert(2,"a","b").to_a(), [1,2,"a","b",3]);
		assert.deepEqual(array.insert(-2,"X").to_a(), [1,2,"a","b","X",3]);
		assert.deepEqual(Rubylike.Array.new().insert(2, 1).to_a(), [null,null,1]);
		assert.throws(function(){array.insert()});
		assert.throws(function(){array.insert("2",1)});
	}
},

function to_sTest () {
	var array = [1,Rubylike.Array.new(),"3",/a/,[null,null]];
	if (Rubylike.is_defined) {
		assert.strictEqual(array.to_s(), '[1, [], \"3\", /a/, [null, null]]');
		assert.strictEqual(array.inspect(), '[1, [], \"3\", /a/, [null, null]]');
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.to_s(), '[1, [], \"3\", /a/, [null, null]]');
		assert.strictEqual(array.inspect(), '[1, [], \"3\", /a/, [null, null]]');
	}
},

function keep_ifTest () {
	var a = 'a b c d e f'.split(/\s+/);
	if (Rubylike.is_defined) {
		assert.ok(a.keep_if(function(v){return v._match(/[a-z]/)}) === a);
		assert.deepEqual(a, ["a","b","c","d","e","f"]);
		assert.ok(a.keep_if(function(v){return v._match(/[aeiou]/)}) === a);
		assert.deepEqual(a, ["a","e"]);
	} else {
		a = Rubylike.Array.new(a);
		assert.ok(a.keep_if(function(v){return v.match(/[a-z]/)}) === a);
		assert.deepEqual(a.to_a(), ["a","b","c","d","e","f"]);
		assert.ok(a.keep_if(function(v){return v.match(/[aeiou]/)}) === a);
		assert.deepEqual(a.to_a(), ["a","e"]);
	}
},

function lastTest () {
	var array = [0,1,2];
	if (Rubylike.is_defined) {
		assert.ok(array.last() === 2);
		assert.ok([].last() === null);
		assert.deepEqual(array.last(0), []);
		assert.deepEqual(array.last(1), [2]);
		assert.deepEqual(array.last(2), [1,2]);
		assert.deepEqual(array.last(3), [0,1,2]);
		assert.deepEqual(array.last(4), [0,1,2]);
		assert.throws(function(){array.last(-1)});
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.last() === 2);
		assert.ok(Rubylike.Array.new().last() === null);
		assert.deepEqual(array.last(0).to_a(), []);
		assert.deepEqual(array.last(1).to_a(), [2]);
		assert.deepEqual(array.last(2).to_a(), [1,2]);
		assert.deepEqual(array.last(3).to_a(), [0,1,2]);
		assert.deepEqual(array.last(4).to_a(), [0,1,2]);
		assert.throws(function(){array.last(-1)});
	}
},

function popTest () {
	var array = [1,2,3,4,5,6,7,8,9];
	if (Rubylike.is_defined) {
		assert.strictEqual(array.pop(2).pop(), 9);
		assert.deepEqual(array, [1,2,3,4,5,6,7]);
		assert.strictEqual(array.pop(), 7);
		assert.deepEqual(array, [1,2,3,4,5,6]);
		assert.deepEqual(array.pop(0), []);
		assert.deepEqual(array, [1,2,3,4,5,6]);
		assert.deepEqual(array.pop(1), [6]);
		assert.deepEqual(array, [1,2,3,4,5]);
		assert.deepEqual(array.pop(3), [3,4,5]);
		assert.deepEqual(array.pop(10), [1,2]);
		assert.deepEqual(array, []);
		assert.deepEqual(array.pop(), null);
		assert.deepEqual(array.pop(1), []);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.pop(2).to_a(), [8,9]);
		assert.deepEqual(array.to_a(), [1,2,3,4,5,6,7]);
		assert.strictEqual(array.pop(), 7);
		assert.deepEqual(array.to_a(), [1,2,3,4,5,6]);
		assert.deepEqual(array.pop(0).to_a(), []);
		assert.deepEqual(array.to_a(), [1,2,3,4,5,6]);
		assert.deepEqual(array.pop(1).to_a(), [6]);
		assert.deepEqual(array.to_a(), [1,2,3,4,5]);
		assert.deepEqual(array.pop(3).to_a(), [3,4,5]);
		assert.deepEqual(array.pop(10).to_a(), [1,2]);
		assert.deepEqual(array.to_a(), []);
		assert.deepEqual(array.pop(), null);
		assert.deepEqual(array.pop(1).to_a(), []);
	}
},

function productTest () {
	var tmp = [];
	var a = [1,2];
	if (Rubylike.is_defined) {
		assert.deepEqual([1,2].product(), [[1],[2]]);
		assert.deepEqual([1,2].product([]), []);
		assert.deepEqual([].product(), []);
		assert.deepEqual([].product([]), []);
		assert.deepEqual([1].product([2]), [[1,2]]);
		assert.deepEqual([1,2].product([3,4]), [[1,3],[1,4],[2,3],[2,4]]);
		assert.deepEqual([1,2,3].product([4,5]), [[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]]);
		assert.deepEqual([1,2].product([3,4],[5,6]), [[1,3,5],[1,3,6],[1,4,5],[1,4,6],[2,3,5],[2,3,6],[2,4,5],[2,4,6]]);
		assert.deepEqual([1,2].product([3,4],[5,6],[7,8]), [[1,3,5,7],[1,3,5,8],[1,3,6,7],[1,3,6,8],[1,4,5,7],[1,4,5,8],[1,4,6,7],[1,4,6,8],[2,3,5,7],[2,3,5,8],[2,3,6,7],[2,3,6,8],[2,4,5,7],[2,4,5,8],[2,4,6,7],[2,4,6,8]]);
		assert.ok(a === a.product([3,4], function(i){ return tmp.push(i[0]) }));
		assert.deepEqual(tmp, [1,1,2,2]);
		assert.throws(function(){[1,2].product(1)});
		assert.throws(function(){[1,2].product("a")});
	} else {
		a = Rubylike.Array.new([1,2]);
		assert.deepEqual(Rubylike.Array.new([1,2]).product().map(function(i){ return i.to_a() }).to_a(), [[1],[2]]);
		assert.deepEqual(Rubylike.Array.new([1,2]).product([]).to_a(), []);
		assert.deepEqual(Rubylike.Array.new().product().to_a(), []);
		assert.deepEqual(Rubylike.Array.new().product([]).to_a(), []);
		assert.deepEqual(Rubylike.Array.new([1]).product([2]).map(function(i){ return i.to_a() }).to_a(), [[1,2]]);
		assert.deepEqual(Rubylike.Array.new([1,2]).product([3,4]).map(function(i){ return i.to_a() }).to_a(), [[1,3],[1,4],[2,3],[2,4]]);
		assert.deepEqual(Rubylike.Array.new([1,2,3]).product([4,5]).map(function(i){ return i.to_a() }).to_a(), [[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]]);
		assert.deepEqual(Rubylike.Array.new([1,2]).product([3,4],[5,6]).map(function(i){ return i.to_a() }).to_a(), [[1,3,5],[1,3,6],[1,4,5],[1,4,6],[2,3,5],[2,3,6],[2,4,5],[2,4,6]]);
		assert.deepEqual(Rubylike.Array.new([1,2]).product([3,4],[5,6],[7,8]).map(function(i){ return i.to_a() }).to_a(), [[1,3,5,7],[1,3,5,8],[1,3,6,7],[1,3,6,8],[1,4,5,7],[1,4,5,8],[1,4,6,7],[1,4,6,8],[2,3,5,7],[2,3,5,8],[2,3,6,7],[2,3,6,8],[2,4,5,7],[2,4,5,8],[2,4,6,7],[2,4,6,8]]);
		assert.ok(a === a.product([3,4], function(i){ return tmp.push(i[0]) }));
		assert.deepEqual(tmp, [1,1,2,2]);
		assert.throws(function(){[1,2].product(1)});
		assert.throws(function(){[1,2].product("a")});
	}
},

function pushTest () {
	var array;
	if (Rubylike.is_defined) {
		array = [0].push(1).push(3);
		array._push(5);
		array.push(6,7,8);
		array.push();
		assert.deepEqual(array, [0,1,3,5,6,7,8]);
	} else {
		array = Rubylike.Array.new([0]).push(1).push(3);
		array.push(5);
		array.push(6,7,8);
		array.push();
		assert.deepEqual(array.to_a(), [0,1,3,5,6,7,8]);
	}
},

function rassocTest () {
	var array = [[15,1],[25,2],[35,3],[45,"foo"],[55,{"a":5}]];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.rassoc(2), [25,2]);
		assert.strictEqual(array.rassoc(100), nil);
		assert.strictEqual(array.rassoc(15), nil);
		assert.deepEqual(array.rassoc("foo"), [45,"foo"]);
		assert.deepEqual(array.rassoc({"a":5}), [55,{"a":5}]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.rassoc(2), [25,2]);
		assert.strictEqual(array.rassoc(100), null);
		assert.strictEqual(array.rassoc(15), null);
		assert.deepEqual(array.rassoc("foo"), [45,"foo"]);
		assert.deepEqual(array.rassoc({"a":5}), [55,{"a":5}]);
	}
},

function repeated_combinationTest () {
	var array = [1,2,3];
	var tmp = [];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.repeated_combination(1), [[1],[2],[3]]);
		assert.deepEqual(array.repeated_combination(2), [[1,1],[1,2],[1,3],[2,2],[2,3],[3,3]]);
		assert.deepEqual(array.repeated_combination(3), [[1,1,1],[1,1,2],[1,1,3],[1,2,2],[1,2,3],[1,3,3],[2,2,2],[2,2,3],[2,3,3],[3,3,3]]);
		assert.deepEqual(array.repeated_combination(4), [[1,1,1,1],[1,1,1,2],[1,1,1,3],[1,1,2,2],[1,1,2,3],[1,1,3,3],[1,2,2,2],[1,2,2,3],[1,2,3,3],[1,3,3,3],[2,2,2,2],[2,2,2,3],[2,2,3,3],[2,3,3,3],[3,3,3,3]]);
		assert.deepEqual(array.repeated_combination(0), [[]]);
		assert.ok(array.repeated_combination(1, function(i){ return tmp.push(i)}) === array);
		assert.deepEqual(tmp, [[1],[2],[3]]);
	} else {
		array = Rubylike.Array.new(array);
		var to_a = function (i) { return i.to_a() };
		assert.deepEqual(array.repeated_combination(1).map(to_a).to_a(), [[1],[2],[3]]);
		assert.deepEqual(array.repeated_combination(2).map(to_a).to_a(), [[1,1],[1,2],[1,3],[2,2],[2,3],[3,3]]);
		assert.deepEqual(array.repeated_combination(3).map(to_a).to_a(), [[1,1,1],[1,1,2],[1,1,3],[1,2,2],[1,2,3],[1,3,3],[2,2,2],[2,2,3],[2,3,3],[3,3,3]]);
		assert.deepEqual(array.repeated_combination(4).map(to_a).to_a(), [[1,1,1,1],[1,1,1,2],[1,1,1,3],[1,1,2,2],[1,1,2,3],[1,1,3,3],[1,2,2,2],[1,2,2,3],[1,2,3,3],[1,3,3,3],[2,2,2,2],[2,2,2,3],[2,2,3,3],[2,3,3,3],[3,3,3,3]]);
		assert.deepEqual(array.repeated_combination(0).map(to_a).to_a(), [[]]);
		assert.ok(array.repeated_combination(1, function(i){ return tmp.push(i.to_a())}) === array);
		assert.deepEqual(tmp, [[1],[2],[3]]);
	}
},

function repeated_permutationTest () {
	var array = [1,2];
	var tmp = [];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.repeated_permutation(1), [[1],[2]]);
		assert.deepEqual(array.repeated_permutation(2), [[1,1],[1,2],[2,1],[2,2]]);
		assert.deepEqual(array.repeated_permutation(3), [[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]);
		assert.deepEqual(array.repeated_permutation(4), [[1,1,1,1],[1,1,1,2],[1,1,2,1],[1,1,2,2],[1,2,1,1],[1,2,1,2],[1,2,2,1],[1,2,2,2],[2,1,1,1],[2,1,1,2],[2,1,2,1],[2,1,2,2],[2,2,1,1],[2,2,1,2],[2,2,2,1],[2,2,2,2]]);
		assert.deepEqual(array.repeated_permutation(0), [[]]);
		assert.ok(array.repeated_permutation(1, function(i){ return tmp.push(i)}) === array);
		assert.deepEqual(tmp, [[1],[2]]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.repeated_permutation(1).map(to_a).to_a(), [[1],[2]]);
		assert.deepEqual(array.repeated_permutation(2).map(to_a).to_a(), [[1,1],[1,2],[2,1],[2,2]]);
		assert.deepEqual(array.repeated_permutation(3).map(to_a).to_a(), [[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]);
		assert.deepEqual(array.repeated_permutation(4).map(to_a).to_a(), [[1,1,1,1],[1,1,1,2],[1,1,2,1],[1,1,2,2],[1,2,1,1],[1,2,1,2],[1,2,2,1],[1,2,2,2],[2,1,1,1],[2,1,1,2],[2,1,2,1],[2,1,2,2],[2,2,1,1],[2,2,1,2],[2,2,2,1],[2,2,2,2]]);
		assert.deepEqual(array.repeated_permutation(0).map(to_a).to_a(), [[]]);
		assert.ok(array.repeated_permutation(1, function(i){ return tmp.push(i.to_a())}) === array);
		assert.deepEqual(tmp, [[1],[2]]);
	}
},

function replaceTest () {
	var array = [1,2,3];
	var replace = [4,5,6];
	var hash1 = {0:7,1:8,2:9};
	var hash2 = {0:7,1:8,2:9};
	hash2.to_ary = function(){
		var ret = [];
		for (var i = 0; this[i] !== undefined; i++) {
			ret[i] = this[i];
		}
		return ret;
	};
	if (Rubylike.is_defined) {
		assert.ok(array.replace(replace) === array);
		assert.deepEqual(array, replace);
		assert.throws(function(){array.replace()});
		assert.throws(function(){array.replace(hash1)});
		assert.deepEqual(array.replace(hash2), [7,8,9]);
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.replace(replace) === array);
		assert.deepEqual(array.to_a(), replace);
		assert.throws(function(){array.replace()});
		assert.throws(function(){array.replace(hash1)});
		assert.deepEqual(array.replace(hash2).to_a(), [7,8,9]);
	}
},

function reverseTest () {
	var array = ["a", 2, true];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.reverse(), [true, 2, "a"]);
		assert.deepEqual(array, ["a", 2, true]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.reverse().to_a(), [true, 2, "a"]);
		assert.deepEqual(array.to_a(), ["a", 2, true]);
	}
},

function reverse_eachTest () {
	var array = [1,3,5];
	var tmp = [];
	if (Rubylike.is_defined) {
		assert.ok(array.reverse_each(function (i) {tmp.push(i)}) === array);
		assert.deepEqual(array, [1,3,5]);
		assert.deepEqual(tmp, [5,3,1]);
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.reverse_each(function (i) {tmp.push(i)}) === array);
		assert.deepEqual(array.to_a(), [1,3,5]);
		assert.deepEqual(tmp, [5,3,1]);
	}
},

function rindexTest () {
	if (Rubylike.is_defined) {
		assert.ok([1,0,0,1,0].rindex(1) === 3);
		assert.ok([1,0,0,0,0].rindex(1) === 0);
		assert.ok([0,0,0,0,0].rindex(1) === null);
		assert.ok([0,1,0,1,0].rindex(function(v){ return v > 0 }) === 3);
		assert.ok([1,0,0,"1",0].rindex("1") === 3);
	} else {
		assert.ok(Rubylike.Array.new([1,0,0,1,0]).rindex(1) === 3);
		assert.ok(Rubylike.Array.new([1,0,0,0,0]).rindex(1) === 0);
		assert.ok(Rubylike.Array.new([0,0,0,0,0]).rindex(1) === null);
		assert.ok(Rubylike.Array.new([0,1,0,1,0]).rindex(function(v){ return v > 0 }) === 3);
		assert.ok(Rubylike.Array.new([1,0,0,"1",0]).rindex("1") === 3);
	}
},

function rotateTest () {
	var array = ["a","b","c","d"];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.rotate(), ["b","c","d","a"]);
		assert.deepEqual(array, ["a","b","c","d"]);
		assert.deepEqual(array.rotate(2), ["c","d","a","b"]);
		assert.deepEqual(array.rotate(-1), ["d","a","b","c"]);
		assert.deepEqual(array.rotate(-3), ["b","c","d","a"]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.rotate().to_a(), ["b","c","d","a"]);
		assert.deepEqual(array.to_a(), ["a","b","c","d"]);
		assert.deepEqual(array.rotate(2).to_a(), ["c","d","a","b"]);
		assert.deepEqual(array.rotate(-1).to_a(), ["d","a","b","c"]);
		assert.deepEqual(array.rotate(-3).to_a(), ["b","c","d","a"]);
	}
},

function sampleTest () {
	var array = [1,2,3,4,5,6,7,8,9,10];
	if (Rubylike.is_defined) {
		assert.ok(typeof array.sample() === 'number');
		assert.ok(array.sample(3).length === 3);
		assert.deepEqual(array, [1,2,3,4,5,6,7,8,9,10]);
		assert.ok([].sample() === null);
		assert.deepEqual([].sample(1), []);
		assert.throws(function(){array.sample("1")});
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(typeof array.sample() === 'number');
		assert.ok(array.sample(3).length === 3);
		assert.deepEqual(array.to_a(), [1,2,3,4,5,6,7,8,9,10]);
		assert.ok(Rubylike.Array.new().sample() === null);
		assert.deepEqual(Rubylike.Array.new().sample(1), {length:0});
		assert.throws(function(){array.sample("1")});
	}
},

function selectTest () {
	var a = 'a b c d e f'.split(/\s+/);
	if (Rubylike.is_defined) {
		assert.ok(a.select(function(v){return v._match(/[a-z]/)}) === null);
		assert.deepEqual(a, ["a","b","c","d","e","f"]);
		assert.ok(a.select(function(v){return v._match(/[aeiou]/)}) === a);
		assert.deepEqual(a, ["a","e"]);
	} else {
		a = Rubylike.Array.new(a);
		assert.ok(a.select(function(v){return v.match(/[a-z]/)}) === null);
		assert.deepEqual(a.to_a(), ["a","b","c","d","e","f"]);
		assert.ok(a.select(function(v){return v.match(/[aeiou]/)}) === a);
		assert.deepEqual(a.to_a(), ["a","e"]);
	}
},

function shiftTest () {
	var array = [1,2,3,4,5,6,7,8,9];
	var ruby;
	if (Rubylike.is_defined) {
		assert.strictEqual(array.shift(), 1);
		assert.deepEqual(array, [2,3,4,5,6,7,8,9]);
		assert.deepEqual(array.shift(1), [2]);
		assert.deepEqual(array, [3,4,5,6,7,8,9]);
		assert.deepEqual(array.shift(3), [3,4,5]);
		assert.deepEqual(array, [6,7,8,9]);
		assert.deepEqual(array.shift(10), [6,7,8,9]);
		assert.deepEqual(array, []);
		assert.strictEqual(array.shift(), null);
		assert.deepEqual(array.shift(1), []);
		assert.deepEqual(array, []);
		assert.throws(function(){ array.shift("5") });
		assert.throws(function(){ array.shift(-1) });
	} else {
		array = Rubylike.Array.new(array);
		assert.strictEqual(array.shift(), 1);
		assert.deepEqual(array.to_a(), [2,3,4,5,6,7,8,9]);
		assert.deepEqual(array.shift(1).to_a(), [2]);
		assert.deepEqual(array.to_a(), [3,4,5,6,7,8,9]);
		assert.deepEqual(array.shift(3).to_a(), [3,4,5]);
		assert.deepEqual(array.to_a(), [6,7,8,9]);
		assert.deepEqual(array.shift(10).to_a(), [6,7,8,9]);
		assert.deepEqual(array.to_a(), []);
		assert.strictEqual(array.shift(), null);
		assert.deepEqual(array.shift(1).to_a(), []);
		assert.deepEqual(array.to_a(), []);
		assert.throws(function(){ array.shift("5") });
		assert.throws(function(){ array.shift(-1) });
	}
},

function shuffleTest () {
	var array = [1,2,3,[4],{5:6}];
	if (Rubylike.is_defined) {
		assert.ok(array.shuffle() !== array);
		assert.ok(array.shuffle().length === array.length);
		array.shuffle().each(function(i){
			assert.ok(array.include(i));
		});
		assert.deepEqual([].shuffle(), [])
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.shuffle() !== array);
		assert.ok(array.shuffle().length === array.length);
		array.shuffle().each(function(i){
			assert.ok(array.include(i));
		});
	}
},

function sliceTest () {
	var array = [0,1,2];
	if (Rubylike.is_defined) {
		assert.ok(array.slice(1) === 1);
		assert.ok(array.slice(2) === 2);
		assert.ok(array.slice(10) === null);
		assert.deepEqual(array.slice(0, 2), [0, 1]);
		assert.deepEqual(array.slice(2, 3), [2]);
		assert.deepEqual(array.slice(10, 1), null);
		assert.deepEqual(array.slice(0, -1), null);
		assert.throws(function(){array.slice(0,"1")});
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.slice(1) === 1);
		assert.ok(array.slice(2) === 2);
		assert.ok(array.slice(10) === null);
		assert.deepEqual(array.slice(0, 2).to_a(), [0, 1]);
		assert.deepEqual(array.slice(2, 3).to_a(), [2]);
		assert.deepEqual(array.slice(10, 1), null);
		assert.deepEqual(array.slice(0, -1), null);
		assert.throws(function(){array.slice(0,"1")});
	}
},

function sortTest () {
	var a = ["d","a","e","c","b"];
	var b = ["9","7","10","11","8"];
	var strings = ["a","A",".","@","["];
	if (Rubylike.is_defined) {
		assert.deepEqual(a.sort(), ["a","b","c","d","e"]);
		assert.deepEqual(b.sort(), ["10","11","7","8","9"]);
		assert.deepEqual(b.sort(function(x,y){ return x - y; }), ["7","8","9","10","11"]);
		assert.deepEqual(strings.sort(function(a, b){ if(a<b){return -1;}else if(a>b){return 1;}return 0;}), [".","@","A","[","a"]);
	} else {
		a = Rubylike.Array.new(a);
		b = Rubylike.Array.new(b);
		strings = Rubylike.Array.new(strings);
		assert.deepEqual(a.sort().to_a(), ["a","b","c","d","e"]);
		assert.deepEqual(b.sort().to_a(), ["10","11","7","8","9"]);
		assert.deepEqual(b.sort(function(x,y){ return x - y; }).to_a(), ["7","8","9","10","11"]);
		assert.deepEqual(strings.sort(function(a, b){ if(a<b){return -1;}else if(a>b){return 1;}return 0;}).to_a(), [".","@","A","[","a"]);
	}
},

function sort_byTest () {
	var array = ["9","7","10","11","8"];
	var rands = [];
	for (i = 0; i < 10; i++) {
		rands.push(Math.floor(Math.random() * 1000));
	}
	var strings = ["a","A",".","@","["];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.sort_by(function(i){ return i }), ["10","11","7","8","9"]);
		assert.deepEqual(array.sort_by(function(i){ return +i }), ["7","8","9","10","11"]);
		assert.deepEqual(rands.sort(function(a,b){ return a - b }), rands.sort_by(function(v){ return v }));
		assert.deepEqual(strings.sort_by(function(i){ return i }), [".","@","A","[","a"]);
	} else {
		array = Rubylike.Array.new(array);
		rands = Rubylike.Array.new(rands);
		strings = Rubylike.Array.new(strings);
		assert.deepEqual(array.sort_by(function(i){ return i }).to_a(), ["10","11","7","8","9"]);
		assert.deepEqual(array.sort_by(function(i){ return +i }).to_a(), ["7","8","9","10","11"]);
		assert.deepEqual(rands.sort(function(a,b){ return a - b }), rands.sort_by(function(v){ return v }));
		assert.deepEqual(strings.sort_by(function(i){ return i }).to_a(), [".","@","A","[","a"]);
	}
},

function transposeTest () {
	var array = [[1,2],[3,4],[5,6]];
	if (Rubylike.is_defined) {
		assert.deepEqual(array.transpose(), [[1,3,5],[2,4,6]]);
		assert.deepEqual(array.transpose().transpose(), [[1,2],[3,4],[5,6]]);
		assert.deepEqual([].transpose(), []);
		assert.throws(function(){[1,2,3].transpose()});
		assert.throws(function(){[[1,2,3],1].transpose()});
		assert.throws(function(){[[1,2],[3,4,5],[6,7]].transpose()});
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.transpose().map(function(i){ return i.to_a() }).to_a(), [[1,3,5],[2,4,6]]);
		assert.deepEqual(array.transpose().transpose().map(function(i){ return i.to_a() }).to_a(), [[1,2],[3,4],[5,6]]);
		assert.deepEqual(Rubylike.Array.new().transpose().to_a(), []);
		assert.throws(function(){Rubylike.Array.new([1,2,3]).transpose()});
		assert.throws(function(){Rubylike.Array.new([[1,2,3],1]).transpose()});
		assert.throws(function(){Rubylike.Array.new([[1,2],[3,4,5],[6,7]]).transpose()});
	}
},

function uniqTest () {
	if (Rubylike.is_defined) {
		assert.deepEqual([1,1,1].uniq(), [1]);
		assert.deepEqual([1,4,1].uniq(), [1,4]);
		assert.deepEqual([1,3,2,2,3].uniq(), [1,3,2]);
		assert.deepEqual([1,3,2,"2","3"].uniq(), [1,3,2,"2","3"]);
		assert.deepEqual([1,3,2,"2","3"].uniq(function(n){ return n.to_s() }), [1,3,2]);
		assert.deepEqual([[1],[1],[2],{a:3},{a:3}].uniq(), [[1],[2],{a:3}]);
	} else {
		assert.deepEqual(Rubylike.Array.new([1,1,1]).uniq().to_a(), [1]);
		assert.deepEqual(Rubylike.Array.new([1,4,1]).uniq().to_a(), [1,4]);
		assert.deepEqual(Rubylike.Array.new([1,3,2,2,3]).uniq().to_a(), [1,3,2]);
		assert.deepEqual(Rubylike.Array.new([1,3,2,"2","3"]).uniq().to_a(), [1,3,2,"2","3"]);
		assert.deepEqual(Rubylike.Array.new([1,3,2,"2","3"]).uniq(function(n){ return n+'' }).to_a(), [1,3,2]);
		assert.deepEqual(Rubylike.Array.new([[1],[1],[2],{a:3},{a:3}]).uniq().to_a(), [[1],[2],{a:3}]);
	}
},

function unshiftTest () {
	var array = [1,2,3];
	if (Rubylike.is_defined) {
		assert.ok(array.unshift(0) === array);
		assert.deepEqual(array, [0,1,2,3]);
		assert.deepEqual(array.unshift([0]), [[0],0,1,2,3]);
		assert.deepEqual(array.unshift(1,2), [1,2,[0],0,1,2,3]);
	} else {
		array = Rubylike.Array.new(array);
		assert.ok(array.unshift(0) === array);
		assert.deepEqual(array.to_a(), [0,1,2,3]);
		assert.deepEqual(array.unshift([0]).to_a(), [[0],0,1,2,3]);
		assert.deepEqual(array.unshift(1,2).to_a(), [1,2,[0],0,1,2,3]);
	}
},

function values_atTest () {
	var array = 'a b c d e'.split(/\s+/);
	if (Rubylike.is_defined) {
		assert.deepEqual(array.values_at(0,2,4), ["a","c","e"]);
		assert.deepEqual(array.values_at(0,2,4), ["a","c","e"]);
		assert.deepEqual(array.values_at(3,4,5,6,35), ["d","e",null,null,null]);
		assert.deepEqual(array.values_at(0,-1,-2), ["a","e","d"]);
		assert.deepEqual(array.values_at(-4,-5,-6,-35), ["b","a",null,null]);
	} else {
		array = Rubylike.Array.new(array);
		assert.deepEqual(array.values_at(0,2,4).to_a(), ["a","c","e"]);
		assert.deepEqual(array.values_at(3,4,5,6,35).to_a(), ["d","e",null,null,null]);
		assert.deepEqual(array.values_at(0,-1,-2).to_a(), ["a","e","d"]);
		assert.deepEqual(array.values_at(-4,-5,-6,-35).to_a(), ["b","a",null,null]);
	}
},

function zipTest () {
	var a = [4,5,6];
	var b = [7,8,9];
	var tmp = [];
	if (Rubylike.is_defined) {
		assert.deepEqual([1,2,3].zip(a, b), [[1,4,7],[2,5,8],[3,6,9]]);
		assert.deepEqual([1,2].zip(a, b), [[1,4,7],[2,5,8]]);
		assert.deepEqual(a.zip([1,2], [8]), [[4,1,8],[5,2,null],[6,null,null]]);
		assert.deepEqual([1,2,3,4,5].zip(["a","b","c"],["A","B","C","D"]), [[1,"a","A"],[2,"b","B"],[3,"c","C"],[4,null,"D"],[5,null,null]]);
		assert.deepEqual([1,2,3].zip([4,5,6],[7,8,9],function(i){ tmp.push(i) }), null);
		assert.deepEqual(tmp, [[1,4,7],[2,5,8],[3,6,9]]);
	} else {
		a = Rubylike.Array.new(a);
		b = Rubylike.Array.new(b);
		assert.deepEqual(Rubylike.Array.new([1,2,3]).zip(a, b).map(to_a).to_a(), [[1,4,7],[2,5,8],[3,6,9]]);
		assert.deepEqual(Rubylike.Array.new([1,2]).zip(a, b).map(to_a).to_a(), [[1,4,7],[2,5,8]]);
		assert.deepEqual(a.zip([1,2], [8]).map(to_a).to_a(), [[4,1,8],[5,2,null],[6,null,null]]);
		assert.deepEqual(Rubylike.Array.new([1,2,3,4,5]).zip(["a","b","c"],["A","B","C","D"]).map(to_a).to_a(), [[1,"a","A"],[2,"b","B"],[3,"c","C"],[4,null,"D"],[5,null,null]]);
		assert.deepEqual(Rubylike.Array.new([1,2,3]).zip([4,5,6],[7,8,9],function(i){ tmp.push(i.to_a()) }), null);
		assert.deepEqual(tmp, [[1,4,7],[2,5,8],[3,6,9]]);
	}
},

];

if (typeof require === 'function') {
	var assert = require('assert');
	var Rubylike = require('../rubylike.js').Rubylike;
}
this.testCase = this.testCase || {};
this.testCase.Array = testCase;
