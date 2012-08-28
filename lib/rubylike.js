(function(){

var Rubylike = function (block) {
	if (typeof block !== 'function') {
		throw new TypeError("arguments must be a function");
	}
	Rubylike.define();
	var ret = block();
	Rubylike.remove();
	return ret;
};

// {{{ Object
Rubylike.Object = function Object () {
};
Rubylike.Object.new = function () {
	return new Rubylike.Object();
};
Rubylike.Object.prototype.class = function () {
	if (this === null) return 'Null';
	if (this === undefined) return 'Undefined';
	var tc = this.constructor;
	return typeof(tc) === 'function'
		? ('' + tc).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1')
		: tc;
};
Rubylike.Object.prototype.eql = function (obj) {
	var ka, kb, key;
	if (this.valueOf() === obj.valueOf()) {
		return true;
	} else if (this instanceof Date && obj instanceof Date) {
		return this.getTime() === obj.getTime();
	} else if (typeof this != 'object' && typeof obj != 'object') {
		return this === obj;
	}

	try {
		keysa = Object.keys(this);
		keysb = Object.keys(obj);
		if (keysa.length !== keysb.length) return false;
		keysa.sort();
		keysb.sort();
		for (var i = 0, len = keysa.length; i < len; i += 1) {
			if (keysa[i] !== keysb[i]) return false;
		}
		for (key in this) if (this.hasOwnProperty(key)) {
			if (typeof this[key] === 'object') {
				return this[key].eql(obj[key]);
			} else if (this[key] !== obj[key]) {
				return false;
			}
		}
	} catch (ex) {
		return false;
	}
	return true;
};
Rubylike.Object.prototype.methods = function () {
	return Rubylike[this.class()]._methods;
};
// }}}

// {{{ Array
Rubylike.Array = function Array () {
};
Rubylike.Array.new = function (size, val) {
	var ret = new Rubylike.Array();
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
Rubylike.Array.prototype.push = function (obj) {
	this._push(obj);
	return this;
};
Rubylike.Array.prototype.pop = function (n) {
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
};
Rubylike.Array.prototype.shift = function (n) {
	var ret = [], len = this.length;
	if (len === 0) {
		return (0 < arguments.length) ? ret : null;
	} else if (arguments.length === 0) {
		return this._shift();
	} else if (len <= n) {
		n = len;
	}
	for (var i = 0; i < n; i += 1) {
		ret.push(this._shift());
	}
	return ret;
};
Rubylike.Array.prototype.first = function () {
	return this[0];
};
Rubylike.Array.prototype.to_a = function () {
	return this;
};
Rubylike.Array.prototype.each = function (block) {
	var enumerator = [];
	if (typeof block === 'function') {
		this.forEach(block);
		return this;
	} else {
		for (var i = 0, len = this.length; i < len; i += 1) {
			enumerator.push(i);
		}
		return enumerator;
	}
};
Rubylike.Array.prototype.inject = function () {
	var sum, callback;
	if (arguments.length === 1) {
		sum = this.shift();
	} else if (arguments.length === 2) {
		sum = arguments[0];
	}
	callback = arguments[arguments.length - 1];
	this.each(function(i){
		sum = callback(sum, i);
	});
	return sum;
};
// }}}

// {{{ Hash
Rubylike.Hash = function Hash (obj) {
	if (typeof obj === 'object') {
		for (var key in obj) if (obj.hasOwnProperty(key)) {
			this[key] = (Object.prototype.toString.call(obj[key]) === '[object Object]')
				? Rubylike.Hash.new(obj[key])
				: this[key] = obj[key];
		}
	}
	return this;
};
Rubylike.Hash.new = function (obj) {
	return new Rubylike.Hash(obj);
};
Rubylike.Hash.prototype.to_a = function () {
	var key, value, ret;
	ret = [];
	for (key in this) if (this.hasOwnProperty(key)) {
		value = this[key];
		ret.push([key, value]);
	}
	return ret;
};
Rubylike.Hash.prototype.to_hash = function () {
	return Rubylike.Hash.new(this);
};
Rubylike.Hash.prototype.first = function () {
	return this.to_a()[0];
};
Rubylike.Hash.prototype.shift = function () {
	var first = this.first();
	delete this[first[0]];
	return first;
};
Rubylike.Hash.prototype.each = function (block) {
	var enumerator = [];
	if (typeof block === 'function') {
		if (block.length === 1) {
			var array = this.to_a();
			array.forEach(block);
		} else {
			for (var key in this) if (this.hasOwnProperty(key)) {
				var value = this[key];
				block(key, value);
			}
		}
		return this;
	} else {
		for (var key in this) if (this.hasOwnProperty(key)) {
			var value = this[key];
			enumerator.push(key, value);
		}
		return enumerator;
	}
};
Rubylike.Hash.prototype.each_key = function (block) {
	var enumerator = [];
	if (typeof block === 'function') {
		for (var key in this) if (this.hasOwnProperty(key)) {
			block(key);
		}
		return this;
	} else {
		for (var key in this) if (this.hasOwnProperty(key)) {
			enumerator.push(key);
		}
		return enumerator;
	}
};
Rubylike.Hash.prototype.inject = function () {
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
};
Rubylike.Hash.prototype.length = function () {
	var count = 0;
	for (var key in this) if (this.hasOwnProperty(key)) {
		count += 1;
	}
	return count;
}
Rubylike.Hash.prototype.size = Rubylike.Hash.prototype.length;
Rubylike.Hash.prototype.keys = function () {
	return Object.keys(this);
};
Rubylike.Hash.prototype.key = function (value) {
	for (var key in this) if (this.hasOwnProperty(key)) {
		if (this[key] === value) return key;
		if (Rubylike.Hash.prototype.eql.call(this[key], value)) return key;
	}
	return null;
};
Rubylike.Hash.prototype.merge = function (other, block) {
	var self, key;
	self = Rubylike.Hash.new(this); // self clone
	try {
		if (!other instanceof Object) other = other.to_hash();
	} catch (ex) {
		throw new TypeError('\'merge`: can\'t convert ' + other.class() + 'into Hash')
	}
	if (arguments.length === 1) {
		for (key in other) if (other.hasOwnProperty(key)) {
			self[key] = other[key];
		}
	} else {
		for (key in other) if (other.hasOwnProperty(key)) {
			self[key] = block(key, self[key], other[key]);
		}
	}
	return self;
};
// }}}

// {{{ String
Rubylike.String = function String () {
};
Rubylike.String.new = function (string) {
	if (arguments.length === 0) {
		string = '';
	}
	if (typeof string === 'string') {
		return string;
	}
	throw new TypeError("can't convert " + string.class() + " into String");
};
Rubylike.String.prototype.sub = function (pattern, replace) {
	return (Object.prototype.toString.call(replace) === '[object Object]')
		? this.replace(pattern, function (match, index, self) {
			return replace[match] || '';
		})
		: this.replace(pattern, replace);
};
Rubylike.String.prototype.gsub = function (pattern, replace) {
	pattern = pattern.toString().replace(/\/(.*)\/.*$/, '$1');
	pattern = new RegExp(pattern, 'g');
	return Rubylike.String.prototype.sub.call(this, pattern, replace);
};
Rubylike.String.prototype.chop = function () {
	return /\r\n$/.test(this)
		? this.replace(/\r\n$/, '')
		: this.slice(0, this.length - 1);
};
Rubylike.String.prototype.chomp = function (rs) {
	var reg;
	if (arguments.length === 0) {
		return this.replace(/\r$|\n$/,'');
	} else if (typeof rs === 'string') {
		reg = new RegExp(rs + '$');
		return this.replace(reg, '');
	} else if (rs == null) {
		return this.valueOf();
	} else {
		throw new TypeError('`chomp\': can\'t convert '+rs.class()+' into String');
	}
};
Rubylike.String.prototype.each_char = function (block) {
	var enumerator = [];
	if (typeof block === 'function') {
		for (var i = 0, len = this.length; i < len; i += 1) {
			block(this.charAt(i));
		}
		return this.valueOf();
	} else {
		for (var i = 0, len = this.length; i < len; i += 1) {
			enumerator.push(this.charAt(i));
		}
		return enumerator;
	}
};
Rubylike.String.prototype.chars = Rubylike.String.prototype.each_char;
Rubylike.String.prototype.clear = function () {
	return '';
};
Rubylike.String.prototype.clone = function () {
	return this.toString();
};
Rubylike.String.prototype.match = function (reg, pos) {
	if (arguments.length === 1) {
		pos = 0;
	}
	var str = this.slice(pos, this.length);
	var m = str._match(reg); // javascript :match is include self at m[0]
	return (m !== null) ? m.slice(1, m.length) : null;
};
Rubylike.String.prototype.insert = function (pos, other) {
	return this.slice(0, pos) + other + this.slice(pos, this.length);
};
Rubylike.String.prototype.empty = function () {
	return this.valueOf() === '';
};
Rubylike.String.prototype.index = function (pattern, pos) {
	pos = pos || 0;
	var self = this.slice(pos, this.length);
	var i = (0 <= pos) ? pos : this.length + pos;
	var ret;
	if (typeof pattern === 'string') {
		ret = this.indexOf(pattern, i);
	} else if (typeof pattern === 'number') {
		ret = this.indexOf(String.fromCharCode(pattern), i);
	} else if (pattern instanceof RegExp) {
		ret = self.search(pattern) + i;
	}
	return ret === -1 ? null
		 : ret !== undefined ? ret
		 : null;
};
// }}}

// {{{ Number
Rubylike.Number = function Number () {
};
Rubylike.Number.prototype.to_s = function () {
	return this + '';
};
Rubylike.Number.prototype.inspect = function () {
	return this.to_s();
};
Rubylike.Number.prototype.times = function (block) {
	var enumerator, self, i;
	enumerator = [];
	self = this.valueOf();

	if (0 <= self) {
		if (typeof block === 'function') {
			for (i = 0; i < self; i += 1) {
				block(i);
			}
			return self;
		} else {
			for (i = 0; i < self; i += 1) {
				enumerator.push(i);
			}
			return enumerator;
		}
	}
};
Rubylike.Number.prototype.upto = function (to, block) {
	if (arguments.length === 0) {
		throw new TypeError('`upto\': wrong number of arguments (0 for 1..2)');
	}
	return this.step(to, 1, block);
};
Rubylike.Number.prototype.downto = function (to, block) {
	if (arguments.length === 0) {
		throw new TypeError('`downto\': wrong number of arguments (0 for 1..2)');
	}
	return this.step(to, -1, block);
};
Rubylike.Number.prototype.step = function (limit, step, block) {
	var enumerator, self, i;
	enumerator = [];
	self = this.valueOf();

	if (arguments.length === 0) {
		throw new TypeError('`step\': wrong number of arguments (0 for 1..2)');
	} else if (arguments.length === 1) {
		step = 1;
	} else if (typeof step === 'function') {
		block = step;
		step = 1;
	}

	if (0 < step) {
		if (typeof block === 'function') {
			for (i = self; i <= limit; i += step) {
				block(i);
			}
			return self;
		} else {
			for (i = self; i <= limit; i += step) {
				enumerator.push(i);
			}
			return enumerator;
		}
	} else {
		if (typeof block === 'function') {
			for (i = self; limit <= i; i += step) {
				block(i);
			}
			return self;
		} else {
			for (i = self; limit <= i; i += step) {
				enumerator.push(i);
			}
			return enumerator;
		}
	}
};
Rubylike.Number.prototype.gcd = function (num) {
	var absself, absnum, m, n;
	absself = Math.abs(this.valueOf());
	absnum = Math.abs(num);
	if (Math.floor(absself) - absself !== 0 || Math.floor(absnum) - absnum !== 0) {
		throw new TypeError('`gcd\' not an integer');
	}
	m = (absnum < absself) ? absself : absnum;
	n = (absnum < absself) ? absnum : absself;
	return (n === 0) ? m : n.gcd(m % n);
};
Rubylike.Number.prototype.real = function () {
	return this.valueOf();
};
Rubylike.Number.prototype.next = function () {
	var self = this.valueOf();
	if (Math.floor(self) - self !== 0) {
		throw new TypeError('`next\' not an integer');
	}
	return self + 1;
};
Rubylike.Number.prototype.div = function (other) {
	return Math.floor(this / other);
};
// }}}

// className(Array) => 'Array'
var className = function (obj) {
	return typeof(obj) === 'function'
		? ('' + obj).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1')
		: obj;
};

var define = function (obj, methods) {
	if (Rubylike[className(obj)]._methods === undefined) {
		Rubylike[className(obj)]._methods = [];
	}
	for (var method in methods) if (methods.hasOwnProperty(method)) {
		Rubylike[className(obj)]._methods.push(method);
		if (typeof obj.prototype[method] === 'function' && className(obj) !== 'Hash') {
			obj.prototype['_' + method] = obj.prototype[method];
			Rubylike[className(obj)]._methods.push('_' + method);
		}
		obj.prototype[method] = methods[method];
	}
};

var remove = function (obj) {
	var methods = Rubylike[className(obj)]._methods;
	delete obj.new;
	for (var i = 0, len = methods.length; i < len; i += 1) {
		var method = methods[i];
		delete obj.prototype[method];
		delete obj.prototype['_' + method];
	}
};

Rubylike.define = function () {
	nil = null;
	define(Object, Rubylike.Object.prototype);
	define(Array, Rubylike.Array.prototype);
	define(String, Rubylike.String.prototype);
	define(Number, Rubylike.Number.prototype);
	Hash = Rubylike.Hash;
	define(Hash, Rubylike.Hash.prototype);

	Object.new = Rubylike.Object.new;
	Array.new = Rubylike.Array.new;
	Hash.new = Rubylike.Hash.new;
	String.new = Rubylike.String.new;
	Number.new = Rubylike.Number.new;
};

Rubylike.remove = function () {
	remove(Object);
	remove(Array);
	remove(String);
	remove(Number);
	delete Hash;
	delete nil;
};

this.Rubylike = Rubylike;

function p () {
	console.log(Array.prototype.slice.call(arguments));
}

}).call(this);
