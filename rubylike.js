/*
 * Rubylike.js (https://github.com/ksss/Rubylike.js)
 * Copyright (c) 2012 ksss <co000ri@gmail.com>
 *
 * License:: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
;(function(){

function Rubylike (block) {
	if (typeof block !== 'function') {
		throw new TypeError("arguments must be a function");
	}
	Rubylike.include();
	var ret = block(Rubylike);
	Rubylike.remove();
	return ret;
};

/*
 * className(Array)                => 'Array'
 * className(new Array())          => 'Array'
 * className(Rubylike.Array['new']()) => 'Array'
 */
function className (obj) {
	if (obj === null) return 'nil';
	if (obj === undefined) return 'undefined';
	switch ({}.toString.call(obj)) {
		case '[object Number]': return 'Number';
	}
	var reg = /^\s*function\s*([^\(]*)[\S\s]+$/im;
	return typeof(obj) === 'function'
		? (obj+'').replace(reg, '$1')
		: (obj.constructor+'').replace(reg, '$1');
};

function define (obj, ruby) {
	if (Rubylike[className(obj)]._methods === undefined) {
		Rubylike[className(obj)]._methods = [];
	}
	obj['new'] = ruby['new'];
	for (var method in ruby.prototype) if (ruby.prototype.hasOwnProperty(method)) {
		Rubylike[className(obj)]._methods.push(method);
		if (typeof obj.prototype[method] === 'function' && className(obj) !== 'Hash') {
			obj.prototype['_' + method] = obj.prototype[method];
			Rubylike[className(obj)]._methods.push('_' + method);
		}
		obj.prototype[method] = ruby.prototype[method];
	}
};

function remove (obj) {
	var methods = JS.Array.sort.call(Rubylike[className(obj)]._methods).reverse();
	Rubylike[className(obj)]._methods = [];
	delete obj['new'];
	for (var i = 0, len = methods.length; i < len; i += 1) {
		var method = methods[i];
		if (/^_/.test(method) && method !== '_methods') {
			obj.prototype[method.substr(1, method.length - 1)] = obj.prototype[method];
		}
		delete obj.prototype[method];
	}
};

Rubylike.def = function (dest, obj) {
	for (var key in obj) if (obj.hasOwnProperty(key)) {
		dest[key] = obj[key];
	}
	return dest;
};
Rubylike.def(Rubylike, {
	version: '0.0.0',
	is_defined: false,
	include: function () {
		Hash = Rubylike.Hash;
		define(Object, Rubylike.Object);
		define(Array, Rubylike.Array);
		define(Hash, Rubylike.Hash);
		define(String, Rubylike.String);
		define(Number, Rubylike.Number);
		Rubylike.is_defined = true;
	},
	remove: function () {
		remove(Object);
		remove(Array);
		remove(String);
		remove(Number);
		delete Hash;
		Rubylike.is_defined = false;
	},
	ship: function (a, b) {
		if (a < b) return -1;
		else if (a > b) return 1;
		return 0;
	},
	raise: function (name, message) {
		var error = new Error();
		error.name = name;
		error.message = message;
		throw error;
	},
	alias: function (obj, function_map) {
		for (var key in function_map) if (function_map.hasOwnProperty(key)) {
			obj.prototype[key] = obj.prototype[function_map[key]];
		}
		return obj;
	},
	extend: function (dest, src) {
		var proto = src.prototype;
		for (var key in proto) if (proto.hasOwnProperty(key)) {
			dest.prototype[key] = src.prototype[key]
		}
		return dest;
	}
});

// original javascript methods
var JS = {
	Array: {
		pop:     Array.prototype.pop,
		push:    Array.prototype.push,
		reverse: Array.prototype.reverse,
		shift:   Array.prototype.shift,
		sort:    Array.prototype.sort,
		splice:  Array.prototype.splice,
		unshift: Array.prototype.unshift,
		concat:  Array.prototype.concat,
		join:    Array.prototype.join,
		slice:   Array.prototype.slice,
		map:     Array.prototype.map,
		every:   Array.prototype.every
	}
};

// {{{ Object
Rubylike.Object = function Object () {
};
Rubylike.Object['new'] = function () {
	return new Rubylike.Object();
};
Rubylike.def(Rubylike.Object, {
	'class': function (a) {
		return className(a);
	},
	eql: function (a, b) {
		var ka, kb, key, keysa, keysb;
		if (a === b) {
			return true;
		} else if (a === null || a === undefined || b === null || b === undefined) {
			return false;
		} else if (a.prototype !== b.prototype) {
			return false;
		} else if (a.valueOf() === b.valueOf()) {
			return true;
		} else if (a instanceof Date && b instanceof Date) {
			return a.getTime() === b.getTime();
		} else if (typeof a != 'object' && typeof b != 'object') {
			return a === b;
		}

		try {
			keysa = Object.keys(a);
			keysb = Object.keys(b);
		} catch (ex) {
			return false;
		}
		if (keysa.length !== keysb.length) return false;
		JS.Array.sort.call(keysa);
		JS.Array.sort.call(keysb);
		for (var i = 0, len = keysa.length; i < len; i += 1) {
			if (keysa[i] !== keysb[i]) return false;
		}
		for (i = keysa.length - 1; 0 <= i; i--) {
			key = keysa[i];
			if (!Rubylike.Object.eql(a[key], b[key])) return false;
		}
		return true;
	},
	equal: function (a, b) {
		return a.valueOf() === b.valueOf();
	},
	methods: function (a) {
		return Rubylike[a['class']()]._methods;
	}
});
// }}}

// {{{ Enumerator
Rubylike.Enumerator = function Enumerator () {
};
Rubylike.Enumerator.def = function(functions) {
	return Rubylike.def(Rubylike.Enumerator.prototype, functions);
};
Rubylike.Enumerator.def({
	all: function (block) {
		var self = this.to_a();
		if (typeof block === 'function') {
			var handler = (block.length === 1) ? 'call' : 'apply';
			for (var i = 0, len = self.length; i < len; i += 1) {
				if (!block[handler](self, self[i])) return false;
			}
		} else {
			for (var i = 0, len = this.length; i < len; i += 1) {
				if (!self[i]) return false;
			}
		}
		return true;
	},
	any: function (block) {
		var self = this.to_a();
		if (typeof block === 'function') {
			var handler = (block.length === 1) ? 'call' : 'apply';
			for (var i = 0, len = self.length; i < len; i += 1) {
				if (block[handler](self, self[i])) return true;
			}
		} else {
			for (var i = 0, len = self.length; i < len; i += 1) {
				if (self[i]) return true;
			}
		}
		return false;
	},
	collect: function (block) {
		var self = this.to_a();
		var new_array = Rubylike.Array['new']();
		var handler = (block.length === 1) ? 'call' : 'apply';

		for (var i = 0, len = self.length; i < len; i += 1) {
			JS.Array.push.call(new_array, block[handler](self, self[i]));
		}
		return new_array;
	},
	count: function () {
		if (arguments.length === 0) {
			if (typeof this.size === 'function') {
				return this.size();
			} else {
				return this.to_a().length;
			}
		}

		var count = 0;
		var self = this.to_a();
		var args = arguments[0];
		if (typeof args === 'function') {
			var handler = (args.length === 1) ? 'call' : 'apply';
			for (var i = 0, len = self.length; i < len; i += 1) {
				if (args[handler](self, self[i])) count++;
			}
		} else {
			for (var i = 0, len = self.length; i < len; i += 1) {
				if (Rubylike.Object.eql(args, self[i])) count++;
			}
		}
		return count;
	},
	cycle: function (n, block) {
		if (arguments.length !== 2) {
			Rubylike.raise('TypeError', "`cycle': wrong number of arguments ("+arguments.length+" for 2)");
		}

		var self = this.to_a();
		var handler = (block.length === 1) ? 'call' : 'apply';
		for (var i = 0, len = self.length; i < len * n; i += 1) {
			block[handler](self, self[i % len])
		}
		return null;
	},
	find: function (ifnone, block) {
		if (arguments.length === 1) {
			block = ifnone;
			ifnone = null;
		}
		var self = this.to_a();
		var handler = (block.length === 1) ? 'call' : 'apply';
		for (var i = 0, len = self.length; i < len; i += 1) {
			if (block[handler](self, self[i])) return self[i];
		}
		return ifnone;
	},
	drop: function (n) {
		var self = this.to_a();
		return JS.Array.slice.call(self, n, self.length);
	},
	drop_while: function (block) {
		var self = this.to_a();
		var handler = (block.length === 1) ? 'call' : 'apply';
		for (var i = 0, len = self.length; i < len; i += 1) {
			if (!block[handler](self, self[i])) break;
		}
		return JS.Array.slice.call(self, i, self.length);
	},
	each_cons: function (n, block) {
		var self = this.to_a();
		var handler = (block.length === 1) ? 'call' : 'apply';
		for (var i = 0, len = self.length - n + 1; i < len; i += 1) {
			block[handler](self, JS.Array.slice.call(self, i, i + n));
		}
		return null;
	},
	each_slice: function (n, block) {
		var self = this.to_a();
		var handler = (block.length === 1) ? 'call' : 'apply';
		for (var i = 0, len = self.length; i < len; i += n) {
			sliced = JS.Array.slice.call(self, i, i+n);
			block[handler](self, sliced);
		}
		return null;
	},
	each_with_index: function (block) {
		var self = this.to_a();
		var handler = (block.length === 1) ? 'call' : 'apply';
		for (var i = 0, len = self.length; i < len; i += 1) {
			block[handler](self, self[i], i);
		}
		return this;
	},
	each_with_object: function (obj, block) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			block(this[i], obj);
		}
		return obj;
	},
	to_a: function () {
		var key, value, ret;
		ret = []; // return original Array
		for (key in this) if (this.hasOwnProperty(key)) {
			value = this[key];
			ret.push([key, value]);
		}
		return ret;
	}
});
Rubylike.alias(Rubylike.Enumerator, {
	detect:         'find',
	entries:        'to_a',
//	find_all:       'select',
	map:            'collect'
//	member:         'include',
//	reduce:         'inject'
});
// }}}

// {{{ Array
Rubylike.Array = function Array () {
	this.length = 0;
};
Rubylike.Array.def = function (functions) {
	return Rubylike.def(Rubylike.Array.prototype, functions);
};
Rubylike.Array['class'] = function () {
	return className(Array);
};
Rubylike.Array['new'] = function (size, val) {
	var new_rubylike_array = (Rubylike.is_defined) ? [] : new Rubylike.Array();
	if (arguments.length === 0) {
		return new_rubylike_array;
	}
	switch (className(size)) {
		case 'Number':
			if (val === undefined) val = null;
			for (var i = 0; i < size; i += 1) {
				JS.Array.push.call(new_rubylike_array, val);
			}
			break;
		case 'Array':
			if (typeof size.to_a === 'function') {
				JS.Array.push.apply(new_rubylike_array, size.to_a());
			} else {
				JS.Array.push.apply(new_rubylike_array, size);
			}
			break;
		case 'undefined':
			break;
		case 'nil':
			Rubylike.raise('TypeError', "`initialize': no implicit conversion from nil to integer");
			break;
		default:
			Rubylike.raise('TypeError', "`initialize': can't convert "+className(size)+" into Integer");
			break;
	}
	return new_rubylike_array;
};
Rubylike.Array.prototype = [];
Rubylike.extend(Rubylike.Array, Rubylike.Enumerator);
Rubylike.Array.def({
	methods: function () {
		return Object.keys(Rubylike.Array.prototype);
	},
	assoc: function (key) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			var target = this[i];
			if (Rubylike.Object.eql(target[0], key)) {
				return target;
			}
		}
		return null;
	},
	at: function (pos) {
		try {
			pos = Rubylike.Number.prototype.to_int.call(pos);
		} catch (ex) {
			Rubylike.raise('TypeError', "`at': can't convert "+className(pos)+" into Integer");
		}
		if (pos < 0) pos += this.length;
		var ret = this[pos];
		return (ret === undefined) ? null : ret;
	},
	clear: function () {
		JS.Array.splice.call(this, 0, this.length);
		return this;
	},
	// shallow copy
	clone: function () {
		if (Rubylike.is_defined) {
			return JS.Array.slice.call(this);
		} else {
			return Rubylike.Array['new'](this);
		}
	},
	'class': function () {
		return className(this);
	},
	combination: function (n, block) {
		/* from ruby-1.9.3-p194/array.c rb_ary_combination */
		if (arguments.length === 0 || 2 < arguments.length) {
			Rubylike.raise('TypeError', "`combination': wrong number of arguments ("+arguments.length+" for 1)");
		}
		if (typeof n !== 'number') {
			Rubylike.raise('TypeError', "`combination': can't convert "+className(n)+" into Integer");
		}

		// for break to return
		var array = (function(){
			var ret = Rubylike.Array['new']();
			var len = this.length;
			var i;
			var clone;

			if (n < 0 || len < n) {
				/* block nothing */
			} else if (n === 0) {
				ret.push(Rubylike.Array['new']());
			} else if (n === 1) {
				for (var i = 0; i < len; i += 1) {
					clone = (Rubylike.is_defined) ? [this[i]] : Rubylike.Array['new']([this[i]]);
					ret.push(clone);
				}
			} else {
				var lev = 0;
				var chosen = [];
				var stack = [];
				for (i = 0; i < n + 1; i += 1) {
					stack.push(0);
				}
				stack[0] = -1;
				for (;;) {
					chosen[lev] = this[stack[lev+1]];
					for (lev++; lev < n; lev++) {
						stack[lev+1] = stack[lev]+1;
						chosen[lev] = this[stack[lev+1]];
					}
					clone = (Rubylike.is_defined) ? JS.Array.slice.call(chosen) : Rubylike.Array['new'](chosen);
					ret.push(clone);
					do {
						if (lev === 0) return ret; // break arguments.callee
						stack[lev--]++;
					} while (stack[lev+1]+n === len+lev+1);
				}
			}
			return ret;
		}).call(this);

		if (typeof block === 'function') {
			for (var i = 0, len = array.length; i < len; i += 1) {
				block(array[i]);
			}
			return this;
		} else {
			return array;
		}
	},
	compact: function () {
		return this.reject(function(i){ return i === null });
	},
	concat: function (other) {
		if (className(other) !== 'Array') {
			Rubylike.raise('TypeError', "`concat': can't convert "+className(other)+" into Array");
		}
		// It can concat Array or Rubylike.Array
		// if too big size of array, Array.prototype.push.apply is throw "RangeError: Maximum call stack size exceeded"
		if (typeof other.to_a === 'function') {
			JS.Array.push.apply(this, other.to_a());
		} else {
			JS.Array.push.apply(this, other);
		}
		return this;
	},
	delete_if: function (block) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			if (block(this[i])) JS.Array.splice.call(this, i, 1);
		}
		return this;
	},
	reject: function (block) {
		return Rubylike.Array.prototype.delete_if.call(this.clone(), block);
	},
	'delete': function (val, block) {
		var i;
		var len = this.length;
		var stack = [];
		var stack_len;

		if (typeof block === 'function') {
			for (i = 0; i < len; i += 1) {
				if (this[i] === val) {
					stack.push(i);
				} else {
					block(this[i]);
				}
			}
		} else {
			for (i = 0; i < len; i += 1) {
				if (this[i] === val) {
					stack.push(i);
				}
			}
		}
		stack_len = stack.length;
		while (stack_len--) {
			JS.Array.splice.call(this, stack[stack_len], 1);
		}
		return (len !== this.length) ? val : null;
	},
	delete_at: function (pos) {
		if (pos < 0) {
			pos += this.length;
		}
		var at = this.at(pos);
		if (at !== null) {
			JS.Array.splice.call(this, pos, 1);
		}
		return at;
	},
	each: function (block) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			block(this[i]);
		}
		return this;
	},
	each_index: function (block) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			block(i);
		}
		return this;
	},
	eql: function (obj) {
		return Rubylike.Object.eql(this, obj);
	},
	fetch: function (nth, arg) {
		if (arguments.length === 0) {
			Rubylike.raise('TypeError', "`fetch': wrong number of arguments ("+arguments.length+" for 1..2)");
		}
		var at = this.at(nth);
		if (at === null) {
			if (arguments.length === 1) {
				throw new Error("`fetch': index "+nth+" outside of array bounds: -"+this.length+"..."+this.length);
			} else if (typeof arg === 'function') {
				return arg(nth);
			} else {
				return arg
			}
		}
		return at;
	},
	fill: function () {
		var i, start, len;
		if (arguments.length === 1) {
			if (typeof arguments[0] === 'function') {
				// fill {|index| ...} -> self
				for (i = 0, len = this.length; i < len; i += 1) {
					this[i] = arguments[0](i);
				}
			} else {
				// fill(val) -> self
				for (i = 0, len = this.length; i < len; i += 1) {
					this[i] = arguments[0];
				}
			}
		} else if (arguments.length === 2) {
			if (typeof arguments[1] === 'function') {
				// fill(start) {|index| ...} -> self
				start = arguments[0];
				for (i = start, len = this.length; i < len; i += 1) {
					this[i] = arguments[1](i);
				}
			} else {
				// fill(val, start) -> self
				start = arguments[1];
				for (i = start, len = this.length; i < len; i += 1) {
					this[i] = arguments[0];
				}
			}
		} else if (arguments.length === 3) {
			if (typeof arguments[2] === 'function') {
				// fill(start, length) {|index| ...} -> self
				start = arguments[0];
				for (i = 0, len = arguments[1]; i < len; i += 1) {
					this[i+start] = arguments[2](i+start);
				}
				if (this.length < start + len) this.length = start + len;
			} else {
				// fill(val, start, length) -> self
				start = arguments[1];
				for (i = 0, len = arguments[2]; i < len; i += 1) {
					this[i+start] = arguments[0];
				}
				if (this.length < start + len) this.length = start + len;
			}
		} else {
			Rubylike.raise('TypeError', "`fill': wrong number of arguments ("+arguments.length+" for 1..3)");
		}
		return this;
	},
	find_index: function (block) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			if (block(this[i])) return i;
		}
		return null;
	},
	first: function (n) {
		if (arguments.length === 0) {
			return this[0];
		} else if (typeof n !== 'number') {
			Rubylike.raise('TypeError', "`first': can't convert " + className(n) + " into Integer");
		} else if (n < 0) {
			Rubylike.raise('ArgumentError', "`first': negative array size");
		} else if (this.length <= n) {
			return this;
		} else {
			return Rubylike.Array['new'](JS.Array.slice.call(this, 0, n));
		}
	},
	flatten: function (lv) {
		var ret = Rubylike.Array['new']();
		if (0 < arguments.length && lv && typeof lv !== 'number') {
			Rubylike.raise('TypeError', "`flatten': can't convert " + className(lv) + " into Integer");
		}

		// recursion processing
		(function flatten (depth) {
			for (var i = 0, len = this.length; i < len; i += 1) {
				if (className(this[i]) === 'Array' && depth !== lv) {
					flatten.call(this[i], depth+1);
				} else {
					JS.Array.push.call(ret, this[i]);
				}
			}
		}).call(this, 0);
		return ret;
	},
	flat_map: function (block) {
		var map = this.map(block);
		var flat_map = Rubylike.Array['new']();
		for (var i = 0, len = map.length; i < len; i += 1) {
			if (className(map[i]) === 'Array') {
				JS.Array.push.apply(flat_map, map[i]);
			} else {
				JS.Array.push.call(flat_map, map[i]);
			}
		}
		return flat_map;
	},
	grep: function (pattern, block) {
		var grep = Rubylike.Array['new'](), i, len;
		if (typeof pattern.test === 'function') {
			for (i = 0, len = this.length; i < len; i += 1) {
				if (pattern.test(this[i])) JS.Array.push.call(grep, this[i]);
			}
		} else {
			for (i = 0, len = this.length; i < len; i += 1) {
				if (this[i] === pattern) JS.Array.push.call(grep, this[i]);
			}
		}

		if (typeof block === 'function') {
			for (i = 0, len = grep.length; i < len; i += 1) {
				grep[i] = block(grep[i]);
			}
		}
		return grep;
	},
	group_by: function (block) {
		var hash = Rubylike.Hash['new']();
		for (var i = 0, len = this.length; i < len; i += 1) {
			var key = block(this[i]);
			var array = Rubylike.Array['new']();
			if (hash[key] === undefined) {
				hash[key] = array.push(this[i]);
			} else {
				hash[key] = hash[key].push(this[i]);
			}
		}
		return hash;
	},
	include: function (val) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			if (Rubylike.Object.eql(this[i], val)) return true;
		}
		return false;
	},
	index: function (val) {
		var i, len = this.length;
		if (typeof val === 'function') {
			for (i = 0; i < len; i += 1) {
				if (val(this[i])) return i;
			}
		} else {
			for (i = 0; i < len; i += 1) {
				if (this[i] === val) return i;
			}
		}
		return null;
	},
	inject: function () {
		var sum, block;
		if (arguments.length === 0) {
			if (this.length === 0) {
				return null;
			} else if (this.length === 1) {
				return this[0];
			}
			sum = this.shift();
		} if (arguments.length === 1) {
			sum = this.shift();
		} else if (arguments.length === 2) {
			sum = arguments[0];
		}
		block = arguments[arguments.length - 1];
		if (typeof block !== 'function') {
			// make Rubylike look as much like Ruby as possible
			Rubylike.raise('LocalJumpError', "`each': no block given");
		}
		for (var i = 0, len = this.length; i < len; i += 1) {
			sum = block(sum, this[i]);
		}
		return sum;
	},
	insert: function () {
		var val, nth, tail, i, len;
		if (arguments.length < 1) {
			Rubylike.raise('TypeError', "`insert': wrong number of arguments ("+arguments.length+" for 1..2)");
		}
		val = JS.Array.slice.call(arguments);
		nth = val.shift();
		if (className(nth) !== 'Number') {
			Rubylike.raise('TypeError', "`insert': can't convert " + className(nth) + " into Integer");
		}
		if (nth < 0) {
			nth += this.length + 1;
		}
		if (this.length < nth) {
			for (i = 0, len = nth - this.length; i < len; i += 1) {
				this.push(null);
			}
		}
		val = val.concat(JS.Array.slice.call(this, nth, this.length));
		JS.Array.splice.call(this, nth, this.length - nth);
		return this.concat(val);
	},
	to_s: function () {
		return JSON.stringify(this.to_a());
	},
	keep_if: function (block) {
		var stack = [];
		var stack_len;
		for (var i = 0, len = this.length; i < len; i += 1) {
			if (!block(this[i])) stack.push(i);
		}
		stack_len = stack.length;
		while (stack_len--) {
			JS.Array.splice.call(this, stack[stack_len], 1);
		}
		return this;
	},
	last: function (n) {
		if (arguments.length === 0) {
			return (this.length === 0) ? null : this[this.length - 1];
		} else if (this.length < n) {
			n = this.length;
		} else if (n < 0) {
			Rubylike.raise('ArgumentError', 'negative array size');
		}
		return Rubylike.Array['new'](JS.Array.slice.call(this, this.length - n));
	},
	max: function (block) {
		var max = this[0];
		var first_class = className(this[0]);
		var ship = Rubylike.ship;
		var result;

		if (this.length === 0) return null;
		else if (this.length === 1) return this[0];

		if (typeof block === 'function') ship = block;

		for (var i = 1, len = this.length; i < len; i += 1) {
			result = ship(this[i], max);
			if (className(this[i]) !== first_class || className(result) !== 'Number') {
				Rubylike.raise('ArgumentError', "`max': comparison of "+className(this[i])+" with "+max+" failed");
			}
			if (0 < result) max = this[i];
		}
		return max;
	},
	max_by: function (block) {
		if (this.length === 0) return null;
		else if (this.length === 1) return this[0];

		return this.map(function(i){ return [block(i), i] }).max(function(a, b){
			return Rubylike.ship(a[0], b[0]);
		}).map(function(i){ return i[1] });
	},
	min: function (block) {
		var min = this[0];
		var first_class = className(this[0]);
		var ship = Rubylike.ship;
		var result;

		if (this.length === 0) return null;
		else if (this.length === 1) return this[0];

		if (typeof block === 'function') ship = block;

		for (var i = 1, len = this.length; i < len; i += 1) {
			result = ship(this[i], min);
			if (className(this[i]) !== first_class || className(result) !== 'Number') {
				Rubylike.raise('ArgumentError', "`min': comparison of "+className(this[i])+" with "+min+" failed");
			}
			if (result < 0) min = this[i];
		}
		return min;
	},
	min_by: function (block) {
		if (this.length === 0) return null;
		else if (this.length === 1) return this[0];

		return this.map(function(i){ return [block(i), i] }).min(function(a, b){
			return Rubylike.ship(a[0], b[0]);
		}).map(function(i){ return i[1] });
	},
	minmax: function (block) {
		return Rubylike.Array['new']([this.min(block), this.max(block)]);
	},
	minmax_by: function (block) {
		if (this.length === 0) return Rubylike.Array['new']([null, null])
		else if (this.length === 1) return Rubylike.Array['new']([this[0], this[0]])

		return this.map(function(i){ return [block(i), i] }).minmax(function(a, b){
			return Rubylike.ship(a[0], b[0]);
		}).map(function(i){ return i[1] });
	},
	none: function (block) {
		if (typeof block === 'function') {
			for (var i = 0, len = this.length; i < len; i += 1) {
				if (block(this[i])) return false;
			}
		} else {
			for (var i = 0, len = this.length; i < len; i += 1) {
				if (this[i]) return false;
			}
		}
		return true;
	},
	one: function (block) {
		var count = 0, i, len;
		if (typeof block === 'function') {
			for (i = 0, len = this.length; i < len; i += 1) {
				if (block(this[i])) {
					count += 1;
					if (1 < count) return false;
				}
			}
		} else {
			for (i = 0, len = this.length; i < len; i += 1) {
				if (this[i]) {
					count += 1;
					if (1 < count) return false;
				}
			}
		}
		return (count === 1);
	},
	partition: function (block) {
		var partition = Rubylike.Array['new']([Rubylike.Array['new'](), Rubylike.Array['new']()]);
		for (var i = 0, len = this.length; i < len; i += 1) {
			if (block(this[i])) {
				partition[0].push(this[i]);
			} else {
				partition[1].push(this[i]);
			}
		}
		return partition;
	},
	pop: function (n) {
		var ret = Rubylike.Array['new']();
		if (this.length === 0) {
			return (arguments.length === 0) ? null : ret;
		} else if (arguments.length === 0) {
			return JS.Array.pop.call(this);
		} else if (this.length < n) {
			n = this.length;
		} else if (n < 0) {
			throw new TypeError('negative array size');
		}
		return ret.concat(JS.Array.splice.call(this, this.length - n, n));
	},
	product: function () {
		var ret = Rubylike.Array['new']();
		var lists = JS.Array.slice.call(arguments);
		var block = (typeof lists[lists.length - 1] === 'function') ? lists.pop() : null;
		var i, len;

		lists.unshift(this.to_a());
		for (i = 0, len = this.length; i < len; i += 1) {
			(function product (depth, stack) {
				var i, len, chosen;
				if (lists.length === depth) {
					chosen = Rubylike.Array['new']();
					for (i = 0, len = lists.length; i < len; i += 1) {
						chosen.push(lists[i][stack[i]]);
					}
					ret.push(chosen);
				} else {
					if (className(lists[depth]) !== 'Array') {
						Rubylike.raise('TypeError', "`product': can't convert "+className(lists[depth])+" into Array");
					}
					for (i = 0, len = lists[depth].length; i < len; i += 1) {
						stack[depth] = i;
						product(depth+1, stack);
					}
				}
			})(1, [i]);
		}
		if (block) {
			for (i = 0, len = ret.length; i < len; i += 1) {
				block(ret[i]);
			}
			return this;
		} else {
			return ret;
		}
	},
	push: function () {
		// if too big size of array, Array.prototype.push.apply is throw "RangeError: Maximum call stack size exceeded"
		JS.Array.push.apply(this, arguments);
		return this;
	},
	rassoc: function (obj) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			var target = this[i];
			if (Rubylike.Object.eql(target[1], obj)) {
				return target;
			}
		}
		return null;
	},
	repeated_combination: function (n, block) {
		var ret = Rubylike.Array['new']();
		var length = this.length;
		var array = [];
		var i, len;

		if (typeof n !== 'number') {
			Rubylike.raise('TypeError', "`repeated_combination': can't convert "+className(n)+" into Array");
		} else if (n < 0) {
			return ret;
		} else if (n === 0) {
			return Rubylike.Array['new']([ret]);
		}

		for (i = 0; i < n; i += 1) array.push(this);

		(function repeated_combination (index, depth, stack) {
			for (var i = index; i < length; i += 1) {
				stack[depth] = i;
				if (depth+1 === n) {
					var tmp = Rubylike.Array['new']();
					for (var a = 0; a < n; a += 1) {
						tmp.push(array[a][stack[a]]);
					}
					ret.push(tmp);
				} else {
					repeated_combination(i, depth+1, stack);
				}
			}
		})(0, 0, []);

		if (typeof block === 'function') {
			for (i = 0, len = ret.length; i < len; i += 1) {
				block(ret[i]);
			}
			return this;
		} else {
			return ret;
		}
	},
	repeated_permutation: function (n, block) {
		var ret = Rubylike.Array['new']();
		var length = this.length;
		var element = [];
		var i, len;

		if (typeof n !== 'number') {
			Rubylike.raise('TypeError', "`repeated_ret': can't convert "+className(n)+" into Array");
		} else if (n < 0) {
			return ret;
		} else if (n === 0) {
			return Rubylike.Array['new']([ret]);
		}

		for (i = 0; i < n; i += 1) JS.Array.push.call(element, this);

		// recursion
		(function repeated_permutation (depth, stack) {
			for (var i = 0; i < length; i += 1) {
				stack[depth] = i;
				if (depth+1 === n) {
					var chosen = Rubylike.Array['new']();
					for (var a = 0; a < n; a += 1) {
						JS.Array.push.call(chosen, element[a][stack[a]]);
					}
					JS.Array.push.call(ret, chosen);
				} else {
					repeated_permutation(depth+1, stack);
				}
			}
		})(0, []);

		if (typeof block === 'function') {
			for (i = 0, len = ret.length; i < len; i += 1) {
				block(ret[i]);
			}
			return this;
		} else {
			return ret;
		}
	},
	replace: function (another) {
		if (className(another) !== 'Array') try {
			another = another.to_ary();
		} catch (ex) {
			Rubylike.raise('TypeError', "`replace': can't convert "+className(another)+" into Array")
		}
		this.clear();

		// if too big size of array, Array.prototype.push.apply is throw "RangeError: Maximum call stack size exceeded"
		JS.Array.push.apply(this, another);
		return this;
	},
	reverse: function () {
		return JS.Array.reverse.call(this.clone());
	},
	reverse_each: function (block) {
		var i = this.length;
		while (i--) {
			block(this[i]);
		}
		return this;
	},
	rindex: function (val) {
		var i = this.length;
		if (typeof val === 'function') {
			while (i--) {
				if (val(this[i])) return i;
			}
		} else {
			while (i--) {
				if (this[i] === val) return i;
			}
		}
		return null;
	},
	rotate: function (cnt) {
		if (arguments.length === 0) {
			cnt = 1;
		} else try {
			cnt = Rubylike.Number.prototype.to_int.call(cnt);
		} catch (ex) {
			Rubylike.raise('TypeError', "`rotate': can't convert "+className(cnt)+" into Integer");
		}
		var old_top = JS.Array.slice.call(this, 0, cnt);
		var new_top = JS.Array.slice.call(this, cnt, this.length);
		return Rubylike.Array['new']().concat(new_top).concat(old_top);
	},
	sample: function (n) {
		var len = this.length, sample, clone, rand;
		if (arguments.length === 0) {
			if (len === 0) return null;
			return this[Math.floor(Math.random() * len)];
		} else try {
			n = Rubylike.Number.prototype.to_int.call(n);
		} catch (ex) {
			Rubylike.raise('TypeError', "`sample': can't convert "+className(n)+" into Integer");
		}

		if (n < 0) Rubylike.raise('ArgumentError', "`sample': negative array size");

		sample = Rubylike.Array['new']();
		if (len === 0) return sample;
		clone = this.clone();
		while (0 < n--) {
			rand = Math.floor(Math.random() * clone.length);
			JS.Array.push.call(sample, JS.Array.splice.call(clone, rand, 1)[0]);
		}
		return sample;
	},
	select: function (block) {
		var stack = [];
		var stack_len;
		for (var i = 0, len = this.length; i < len; i += 1) {
			if (!block(this[i])) stack.push(i);
		}
		stack_len = stack.length;
		if (stack_len === 0) return null;
		while (stack_len--) {
			JS.Array.splice.call(this, stack[stack_len], 1);
		}
		return this;
	},
	shift: function (n) {
		var len = this.length, i;

		if (arguments.length === 0) {
			if (len === 0) return null;
			return JS.Array.splice.call(this, 0, 1)[0];
		} else try {
			n = Rubylike.Number.prototype.to_int.call(n);
		} catch (ex) {
			Rubylike.raise("`shift': can't convert "+className(n)+" into Integer");
		}

		if (n < 0) Rubylike.raise('ArgumentError', "`shift': negative array size");
		if (len <= n) n = len;
		return Rubylike.Array['new'](JS.Array.splice.call(this, 0, n));
	},
	shuffle: function () {
		var len = this.length, shuffle, clone, rand;
		shuffle = Rubylike.Array['new']();
		if (len === 0) return shuffle;
		clone = this.clone();
		while (0 < len--) {
			rand = Math.floor(Math.random() * clone.length);
			JS.Array.push.call(shuffle, JS.Array.splice.call(clone, rand, 1)[0]);
		}
		return shuffle;
	},
	slice: function () {
		if (arguments.length === 1) {
			return this.at(arguments[0]);
		} else if (arguments.length === 2) {
			try {
				var pos = Rubylike.Number.prototype.to_int.call(arguments[0]);
			} catch (ex) {
				Rubylike.raise('TypeError', "`slice': can't convert "+className(pos)+" into Integer");
			}
			try {
				var length = Rubylike.Number.prototype.to_int.call(arguments[1]);
			} catch (ex) {
				Rubylike.raise('TypeError', "`slice': can't convert "+className(length)+" into Integer");
			}
			if (pos < 0) pos += this.length;
			if (this.length <= pos || length < 0) return null;
			return Rubylike.Array['new'](JS.Array.slice.call(this, pos, pos+length));
		}
		Rubylike.raise('ArgumentError', "`slice': wrong number of arguments ("+arguments.legnth+" for 1..2)");
	},
	sort: function (block) {
		if (arguments.length === 0) block = Rubylike.ship;
		return JS.Array.sort.call(this.clone(), block);
	},
	sort_by: function (block) {
		return this.map(function(i){ return [block(i), i] }).sort(function(a, b){
			return Rubylike.ship(a[0], b[0]);
		}).map(function(i){ return i[1] });
	},
	take: function (n) {
		return Rubylike.Array['new']().concat(JS.Array.slice.call(this, 0, n));
	},
	take_while: function (block) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			if (!block(this[i])) break;
		}
		return this.take(i);
	},
	to_a: function () {
		if (Rubylike.is_defined) {
			return this;
		} else {
			return JS.Array.slice.call(this);
		}
	},
	to_ary: function () {
		return this;
	},
	transpose: function () {
		var transpose = Rubylike.Array['new']();
		if (this.length === 0) {
			return transpose;
		}
		if (className(this[0]) !== 'Array') {
			Rubylike.raise('TypeError', "`transpose': can't convert "+className(this[0])+" into Array");
		}
		var xlen = this[0].length;
		var ylen = this.length;
		for (var x = 0; x < xlen; x += 1) {
			var stack = Rubylike.Array['new']();
			for (var y = 0; y < ylen; y += 1) {
				if (x === 0) {
					if (className(this[y]) !== 'Array') {
						Rubylike.raise('TypeError', "`transpose': can't convert "+className(this[y])+" into Array");
					}
					if (this[y].length !== xlen) {
						Rubylike.raise('IndexError', "transpose': element size differs ("+this[y].length+" should be "+xlen+")");
					}
				}
				stack.push(this[y][x]);
			}
			transpose.push(stack);
		}
		return transpose;
	},
	uniq: function (block) {
		var uniq, results, result, i, len;

		uniq = Rubylike.Array['new']();
		if (typeof block === 'function') {
			results = Rubylike.Array['new']();
			for (i = 0, len = this.length; i < len; i += 1) {
				result = block(this[i]);
				if (!results.include(result)) {
					JS.Array.push.call(results, result);
					JS.Array.push.call(uniq, this[i]);
				}
			}
		} else {
			for (i = 0, len = this.length; i < len; i += 1) {
				if (!uniq.include(this[i])) {
					JS.Array.push.call(uniq, this[i]);
				}
			}
		}
		return uniq;
	},
	unshift: function () {
		JS.Array.unshift.apply(this, arguments);
		return this;
	},
	values_at: function () {
		var values_at, i, len, pos;

		values_at = Rubylike.Array['new']();
		for (i = 0, len = arguments.length; i < len; i += 1) {
			try {
				pos = Rubylike.Number.prototype.to_int.call(arguments[i]);
			} catch (ex) {
				Rubylike.raise('TypeError', "`values_at': can't convert "+className(pos)+" into Integer");
			}
			if (pos < 0) pos += this.length;
			JS.Array.push.call(values_at, (this[pos] === undefined) ? null : this[pos])
		}
		return values_at;
	},
	zip: function () {
		var zip, lists, block, chosen, t, tl, l, ll, at;
		zip = Rubylike.Array['new']();
		lists = JS.Array.slice.call(arguments);
		block = (typeof lists[lists.length - 1] === 'function') ? lists.pop(): null;
		for (t = 0, tl = this.length; t < tl; t += 1) {
			chosen = Rubylike.Array['new']();
			JS.Array.push.call(chosen, this[t]);
			for (l = 0, ll = lists.length; l < ll; l += 1) {
				at = lists[l][t];
				if (at === undefined) at = null;
				JS.Array.push.call(chosen, at);
			}
			JS.Array.push.call(zip, chosen);
		}
		if (typeof block === 'function') {
			for (t = 0; t < tl; t += 1) {
				block(zip[t]);
			}
			return null;
		}
		return zip;
	}
});
Rubylike.alias(Rubylike.Array, {
	collect_concat: 'flat_map',
	detect:         'find',
	dup:            'clone',
	entries:        'to_a',
	find_all:       'select',
	inspect:        'to_s',
	map:            'collect',
	member:         'include',
	permutation:    'combination',
	reduce:         'inject'
});

// }}}

// {{{ Hash
Rubylike.Hash = function Hash (obj) {
	if (typeof obj === 'object') {
		for (var key in obj) if (obj.hasOwnProperty(key)) {
			this[key] = ({}.toString.call(obj[key]) === '[object Object]')
				? Rubylike.Hash['new'](obj[key])
				: obj[key];
		}
	}
	return this;
};
Rubylike.Hash['new'] = function (obj) {
	return new Rubylike.Hash(obj);
};
Rubylike.Hash.def = function (functions) {
	return Rubylike.def(Rubylike.Hash.prototype, functions);
};
Rubylike.def(Rubylike.Hash.prototype, Rubylike.Enumerator.prototype);
Rubylike.Hash.def({
	assoc: function (key) {
		if (!this.hasOwnProperty(key)) return null;
		return Rubylike.Array['new']([key, this[key]])
	},
	'class': function () {
		return className(this);
	},
	clear: function () {
		for (var key in this) if (this.hasOwnProperty(key)) {
			delete this[key];
		}
		return this;
	},
	clone: function () {
		return Rubylike.Hash['new'](this); // shallow copy
	},
	'delete': function (key, block) {
		if (!this.hasOwnProperty(key)) {
			if (typeof block === 'function') {
				return block(key);
			}
			return null;
		}
		var delete_value = this[key];
		delete this[key];
		return delete_value;
	},
	delete_if: function (block) {
		for (var key in this) if (this.hasOwnProperty(key)) {
			if (block(key, this[key])) delete this[key];
		}
		return this;
	},
	each: function (block) {
		if (block.length === 1) {
			for (var key in this) if (this.hasOwnProperty(key)) {
				block(Rubylike.Array['new']([key, this[key]]));
			}
		} else {
			for (var key in this) if (this.hasOwnProperty(key)) {
				block(key, this[key]);
			}
		}
		return this;
	},
	each_key: function (block) {
		for (var key in this) if (this.hasOwnProperty(key)) {
			block(key);
		}
		return this;
	},
	each_value: function (block) {
		var value;
		for (var key in this) if (this.hasOwnProperty(key)) {
			value = this[key];
			block(value);
		}
		return this;
	},
	empty: function () {
		for (var key in this) if (this.hasOwnProperty(key)) {
			return false;
		}
		return true;
	},
	eql: function (other) {
		return Rubylike.Object.eql(this, other);
	},
	equal: function (obj) {
		return this === obj;
	},
	fetch: function (key, default_value, block) {
		if (this.hasOwnProperty(key)) {
			return this[key];
		} else {
			if (arguments.length === 1) {
				return null;
			} else if (arguments.length === 2) {
				if (typeof default_value === 'function') {
					block = default_value;
				}
			}
			if (typeof block === 'function') {
				return block(key);
			} else {
				return default_value;
			}
		}
	},
	flatten: function (level) {
		if (arguments.length === 0) {
			level = 1;
		}
		var ret = Rubylike.Array['new'](), key, value;
		if (Rubylike.is_defined) {
			for (key in this) if (this.hasOwnProperty(key)) {
				value = this[key];
				ret.push([key, value]);
			}
		} else {
			for (key in this) if (this.hasOwnProperty(key)) {
				value = this[key];
				ret.push(Rubylike.Array['new']([key, value]));
			}
		}
		return ret.flatten(level);
	},
	first: function () {
		for (var key in this) if (this.hasOwnProperty(key)) {
			return Rubylike.Array['new']([key, this[key]]);
		}
		return null;
	},
	has_key: function (key) {
		return this.hasOwnProperty(key);
	},
	has_value: function (value) {
		return this.key(value) !== null;
	},
	invert: function () {
		var hash = Rubylike.Hash['new']();
		for (var key in this) if (this.hasOwnProperty(key)) {
			var value = this[key];
			hash[value] = key;
		}
		return hash;
	},
	inject: function () {
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
	keep_if: function (block) {
		for (var key in this) if (this.hasOwnProperty(key)) {
			var value = this[key];
			if (!block(key, value)) delete this[key];
		}
		return this;
	},
	keys: function () {
		return Object.keys(this);
	},
	key: function (value) {
		for (var key in this) if (this.hasOwnProperty(key)) {
			if (Rubylike.Object.eql(this[key], value)) return key;
		}
		return null;
	},
	length: function () {
		var count = 0;
		for (var key in this) if (this.hasOwnProperty(key)) {
			count += 1;
		}
		return count;
	},
	map: function (block) {
		var clone = Rubylike.Hash['new']();
		for (var key in this) if (this.hasOwnProperty(key)) {
			clone[key] = block(this[key]);
		}
		return clone;
	},
	merge: function (other, block) {
		return this.update.apply(this.clone(), arguments);
	},
	rassoc: function (value) {
		for (var key in this) if (this.hasOwnProperty(key)) {
			if (Rubylike.Object.eql(value, this[key])) {
				return Rubylike.Array['new']([key, this[key]]);
			}
		}
		return null;
	},
	reject: function (block) {
		return Rubylike.Hash.prototype.delete_if.call(this.clone(), block);
	},
	replace: function (other) {
		var cname = className(other);
		try {
			if (!/Object|Hash/.test(cname)) other = other.to_hash();
		} catch (ex) {
			Rubylike.raise('TypeError', "'replace`: can't convert " + className(other) + " into Hash");
		}
		this.clear();
		for (var key in other) if (other.hasOwnProperty(key)) {
			this[key] = other[key];
		}
		return this;
	},
	select: function (block) {
		var hash = Rubylike.Hash['new']();
		for (var key in this) if (this.hasOwnProperty(key)) {
			var value = this[key];
			if (block(key, value)) hash[key] = value;
		}
		return hash;
	},
	shift: function () {
		var first = this.first();
		delete this[first[0]];
		return first;
	},
	sort: function (block) {
		var key, value, array;
		array = Rubylike.Array['new']();
		for (key in this) if (this.hasOwnProperty(key)) {
			value = this[key];
			array.push([key, value]);
		}
		if (Rubylike.is_defined) {
			return array.sort.apply(array, arguments);
		} else {
			return array.sort.apply(array, arguments).map(function(i){
				return Rubylike.Array['new'](i);
			});
		}
	},
	store: function (key, value) {
		this[key] = value;
		return value;
	},
	to_a: function () {
		var key, value, ret;
		ret = []; // return original Array
		for (key in this) if (this.hasOwnProperty(key)) {
			value = this[key];
			ret.push([key, value]);
		}
		return ret;
	},
	to_hash: function () {
		return this;
	},
	to_s: function () {
		return JSON.stringify(this);
	},
	update: function (other, block) {
		var cname = className(other);
		try {
			if (!/Object|Hash/.test(cname)) other = other.to_hash();
		} catch (ex) {
			Rubylike.raise('TypeError', "'merge`: can't convert " + className(other) + " into Hash");
		}
		if (arguments.length === 1) {
			for (var key in other) if (other.hasOwnProperty(key)) {
				this[key] = other[key];
			}
		} else {
			for (var key in other) if (other.hasOwnProperty(key)) {
				if (this.hasOwnProperty(key)) {
					this[key] = block(key, this[key], other[key]);
				} else {
					this[key] = other[key];
				}
			}
		}
		return this;
	},
	/* order is same that javascript object order */
	values: function () {
		var values = Rubylike.Array['new']();
		for (var key in this) if (this.hasOwnProperty(key)) {
			JS.Array.push.call(values, this[key]);
		}
		return values;
	},
	values_at: function () {
		var values_at = Rubylike.Array['new']();
		for (var i = 0, len = arguments.length; i < len; i += 1) {
			JS.Array.push.call(values_at, this.fetch(arguments[i]));
		}
		return values_at;
	}
});
Rubylike.alias(Rubylike.Hash, {
	each_pair: 'each',
	dup:       'clone',
	size:      'length',
	include:   'has_key',
	member:    'has_key',
	value:     'has_value',
	index:     'key', // <obsolete>
	inspect:   'to_s'
});

// }}}

// {{{ String
Rubylike.String = function String () {
};
Rubylike.String['new'] = function (string) {
	if (arguments.length === 0) {
		string = '';
	}
	if (typeof string === 'string') {
		return string;
	}
	Rubylike.raise('TypeError', "can't convert " + className(string) + " into String");
};
Rubylike.String.prototype.sub = function (pattern, replace) {
	return ({}.toString.call(replace) === '[object Object]')
		? this.replace(pattern, function (match) {
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
		Rubylike.raise('TypeError', "`chomp': can't convert "+className(rs)+" into String");
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
Rubylike.String.prototype.to_s = function () {
	return this;
};
// }}}

// {{{ Number
Rubylike.Number = function Number () {
};
Rubylike.Number.prototype.to_s = function () {
	return this + '';
};
Rubylike.Number.prototype.to_int = function () {
	if (typeof this.valueOf() !== 'number') {
		Rubylike.raise('TypeError', "`to_int': can't convert " + className(this.valueOf()) + " into Integer");
	}
	return Math.floor(this);
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

this.Rubylike = Rubylike;

}).call(this);
