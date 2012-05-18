(function(){

// className(Array) => 'Array'
var className = function (obj) {
	if (obj === null) return 'Null';
	if (obj === undefined) return 'Undefined';
	return typeof(obj) === 'function'
		? 'name' in obj
			? obj.name
			: ('' + obj).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1')
		: obj;
};

var marge = function (obj1, obj2) {
	if (typeof obj1 !== 'object') {
		obj1 = {};
	}
	for (var key in obj2) if (obj2.hasOwnProperty(key)) {
		obj1[key] = obj2[key];
	}
	return obj1;
};

var define = function (obj, methods) {
	Rubylike.methods[className(obj)] = marge(Rubylike.methods[className(obj)], methods);
	for (var method in methods) if (methods.hasOwnProperty(method)) {
		if (typeof obj.prototype[method] === 'function') {
			obj.prototype['_' + method] = obj.prototype[method];
		}
		obj.prototype[method] = methods[method];
	}
};

var remove = function (obj) {
	delete obj.new;
	for (var method in obj.prototype) if (obj.prototype.hasOwnProperty(method)) {
		if (typeof Rubylike.methods[className(obj)][method] === 'function') {
			delete obj.prototype[method];
			delete obj.prototype['_' + method];
		}
	}
};

var Rubylike = function (block) {
	if (typeof block !== 'function') { throw new TypeError("arguments must be a function"); }

	Rubylike.define();
	block();
	Rubylike.remove();
};

Rubylike.Array = require('./rubylike/array.js').Rubylike.Array;
Rubylike.Hash = require('./rubylike/hash.js').Rubylike.Hash;
Rubylike.String = require('./rubylike/string.js').Rubylike.String;
Rubylike.Number = require('./rubylike/number.js').Rubylike.Number;

Rubylike.methods = {};

Rubylike.define = function () {
	Object.prototype.class = function () {
		if (this === null) return 'Null';
		if (this === undefined) return 'Undefined';
		var tc = this.constructor;
		return typeof(tc) === 'function'
			? ('' + tc).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1')
			: tc;
	};
	nil = null;
	define(Array, Rubylike.Array.prototype);
	define(String, Rubylike.String.prototype);
	define(Number, Rubylike.Number.prototype);
	Hash = Rubylike.Hash;
	Array.new = Rubylike.Array.new;
	Hash.new = Rubylike.Hash.new;
	String.new = Rubylike.String.new;
	Number.new = Rubylike.Number.new;
};

Rubylike.remove = function () {
	remove(Array);
	remove(String);
	remove(Number);
	delete Hash;
	delete Object.prototype.class;
	delete nil;
};

function p () {
	console.log(Array.prototype.slice.call(arguments));
}

this.Rubylike = Rubylike;

}).call(this);
