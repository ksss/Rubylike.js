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

this.Rubylike = function (block) {

var Rubylike = {
	'Array': {},
	'String': {},
	'Hash': {},
	'methods': {},
	'version': '0.0.1',
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

var include = function () {
	var args, methods, method, ret;
	args = Array.prototype.slice.call(arguments);
	methods = {
		'each': function (block) {
			var array, i;
			array = this.to_a();
			if (typeof array.forEach === 'function') {
				array.forEach(block);
				return array;
			}
			for (i = 0, len = array.length; i < len; i += 1) (function (it) {
				block(it);
			})(this[i]);
			return array;
		},
		'first': function () {
			return this.to_a()[0];
		},
		'inject': function () {
			var sum, callback;
			if (arguments.length === 1) {
				sum = this.to_a()[0];
				this.shift();
			} else if (arguments.length === 2) {
				sum = arguments[0];
			}
			callback = arguments[arguments.length - 1];
			this.each(function(i){
				sum = callback(sum, i);
			});
			return sum;
		},
	};
	ret = {};
	for (var i = 0, len = args.length; i < len; i += 1) {
		method = methods[args[i]];
		if (typeof method === 'function') {
			ret[args[i]] = method;
		}
	}
	return ret;
};

Array.new = function (size, val) {
	var ret = [];
	if (arguments.length === 0) {
		return ret;
	}
	switch (size.class()) {
		case 'Number':
			if (val === undefined) val = null;
			for (var i = 0; i < size; i += 1) {
				ret[i] = val;
			}
			break;
		case 'Array':
			ret = size;
			break;
		case 'Undefined':
			break;
		default:
			throw new TypeError("can't convert " + size.class() + " into Integer");
			break;
	}
	return ret;
};

define(Array, {
	'push': function (obj) {
		this._push(obj);
		return this;
	},
	'pop': function (n) {
		var ret = [];
		if (arguments.length === 0) {
			return this._pop();
		} else if (this.length < n) {
			n = this.length;
		} else if (n < 0) {
			throw new TypeError('negative array size');
		}
		for (var i = 0; i < n; i += 1) {
			ret[i] = this._pop();
		}
		return ret.reverse();
	},
	'to_a': function () {
		return this;
	},
});
define(Array, include('each', 'first', 'inject'));

String.new = function (string) {
	if (arguments.length === 0) {
		string = '';
	}
	if (typeof string === 'string') {
		return string;
	}
	throw new TypeError("can't convert " + string.class() + " into String");
};

Hash = function Hash (obj) {
	if (typeof obj === 'object') {
		for (var key in obj) if (obj.hasOwnProperty(key)) {
			this[key] = obj[key];
		}
	}
	return this;
};
Hash.new = function (obj) {
	return new Hash(obj);
};
define(Hash, {
	'to_a': function () {
		var key, value, ret;
		ret = [];
		for (key in this) if (this.hasOwnProperty(key)) {
			value = this[key];
			ret._push([key, value]);
		}
		return ret;
	},
	'shift': function () {
		var first = this.first();
		delete this[first[0]];
		return first;
	},
});
define(Hash, include('each', 'first', 'inject'));

define(Object, {
	'class': function () {
		if (this === null) return 'Null';
		if (this === undefined) return 'Undefined';
		var tc = this.constructor;
		return typeof(tc) === 'function'
			? 'name' in tc
				? tc.name
				: ('' + tc).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1')
			: tc;
	},
});
Rubylike.Array = Array;
Rubylike.String = String;
Rubylike.Hash = Hash;
nil = null;

block(Rubylike);

delete nil;
remove(String);
remove(Array);
remove(Hash);
delete Hash;
delete Object.prototype.class;

return Rubylike;

};

function p () {
	console.log(Array.prototype.slice.call(arguments));
}
