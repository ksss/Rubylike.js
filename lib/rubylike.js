// var foo = new Bar();
// typeName(foo); => 'Bar'
var typeName = function (obj) {
	if (obj === null) return 'Null';
	if (obj === undefined) return 'Undefined';
	var tc = obj.constructor;
	return typeof(tc) === 'function'
		? 'name' in tc
			? tc.name
			: ('' + tc).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1')
		: tc;
};

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

var isArray = function (array)  {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(array);
	} else {
		return typeName(array) === 'Array';
	}
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

var Rubylike = function (block) {

var Rubylike = {
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
	var args = Array.prototype.slice.call(arguments);
	var methods = {
		'class': function () {
			return typeName(this);
		},
		'to_a': function () {
			var key, value, ret, type;
			ret = [];
			type = typeName(this);
			switch (type) {
				case 'Array':
					ret = this;
					break;
				case 'Hash':
					for (key in this) if (this.hasOwnProperty(key)) {
						value = this[key];
						ret._push([key, value]);
					}
					break;
				default:
					throw new TypeError("can\'t convert " + type + " into Array");
					break;
			}
			return ret;
		},
		'each': function (block) {
			var array = this.to_a();
			if (typeof array.forEach === 'function') {
				array.forEach(block);
				return array;
			}
			for (var i = 0, len = array.length; i < len; i += 1) (function (it) {
				block(it);
			})(this[i]);
			return array;
		},
	};
	var ret = {};
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
	switch (typeName(size)) {
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
			throw new TypeError("can't convert " + typeName(size) + " into Integer");
			break;
	}
	return ret;
};

String.new = function (string) {
	if (arguments.length === 0) {
		string = '';
	}
	if (typeof string === 'string') {
		return string;
	}
	throw new TypeError("can't convert " + typeName(string) + " into String");
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

define(Array, {
	'push': function (obj) {
		this._push(obj);
		return this;
	},
	'pop': function (n) {
		var ret = [];
		if (arguments.length === 0) {
			return this._pop();
		}
		if (this.length < n) {
			n = this.length;
		}
		if (n < 0) {
			throw new TypeError('negative array size');
		}
		for (var i = 0; i < n; i += 1) {
			ret[i] = this._pop();
		}
		return ret.reverse();
	},
});
define(Array, include('to_a', 'each', 'class'));

define(Hash, {
});
define(Hash, include('to_a', 'each'));

nil = null;

block(Rubylike);

delete nil;

remove(String);
remove(Array);
remove(Hash);
delete Hash;

return Rubylike;

};

this.Rubylike = Rubylike;
function p () {
	console.log(Array.prototype.slice.call(arguments));
}
