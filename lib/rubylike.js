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
(function(){

// original javascript methods
var JS = {
	Array: {
		slice:   Array.prototype.slice,
		sort:    Array.prototype.sort,
		splice:  Array.prototype.splice,
		unshift: Array.prototype.unshift,
		pop:     Array.prototype.pop,
		push:    Array.prototype.push,
		concat:  Array.prototype.concat,
		reverse: Array.prototype.reverse,
	},
};

var Rubylike = function (block) {
	if (typeof block !== 'function') {
		throw new TypeError("arguments must be a function");
	}
	Rubylike.define();
	var ret = block(Rubylike);
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
	if (this === null) return 'nil';
	if (this === undefined) return 'undefined';
	var tc = this.constructor;
	return typeof(tc) === 'function'
		? ('' + tc).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1')
		: tc;
};
Rubylike.Object.prototype.eql = function (obj) {
	var ka, kb, key, keysa, keysb;
	if (this === obj) {
		return true;
	} else if (this.prototype !== obj.prototype) {
		return false;
	} else if (this.valueOf() === obj.valueOf()) {
		return true;
	} else if (this instanceof Date && obj instanceof Date) {
		return this.getTime() === obj.getTime();
	} else if (typeof this != 'object' && typeof obj != 'object') {
		return this === obj;
	}

	try {
		keysa = Object.keys(this);
		keysb = Object.keys(obj);
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
		if (!arguments.callee.call(this[key], obj[key])) return false;
	}
	return true;
};
Rubylike.Object.prototype.methods = function () {
	return Rubylike[this.class()]._methods;
};
// }}}

// {{{ Array
Rubylike.Array = function RubylikeArray () {
	this.length = 0;
};
Rubylike.Array.new = function (size, val) {
	var ret = (Rubylike.is_defined) ? [] : new Rubylike.Array();
	if (arguments.length === 0) {
		return ret;
	}
	switch (className(size)) {
		case 'Number':
			if (val === undefined) val = null;
			for (var i = 0; i < size; i += 1) {
				JS.Array.push.call(ret, val);
			}
			break;
		case 'Array':
			ret.concat(size);
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
	return ret;
};
Rubylike.Array.prototype = [];
Rubylike.Array.prototype.methods = function () {
	return Object.keys(Rubylike.Array.prototype);
};
Rubylike.Array.prototype.assoc = function (key) {
	for (var i = 0, len = this.length; i < len; i += 1) {
		var target = this[i];
		if (Rubylike.Object.prototype.eql.call(target[0], key)) {
			return target;
		}
	}
	return null;
};
Rubylike.Array.prototype.at = function (pos) {
	if (pos < 0) {
		pos += this.length;
	}
	var ret = this[pos];
	return (/undefined|function/.test(typeof ret)) ? null : ret;
};
Rubylike.Array.prototype.clear = function () {
	this.splice(0, this.length);
	return this;
};
Rubylike.Array.prototype.clone = function () {
	return this.map(function(i){return i});
};
Rubylike.Array.prototype.dup = Rubylike.Array.prototype.clone;
Rubylike.Array.prototype.collect = function (block) {
	var ret = Rubylike.Array.new();
	for (var i = 0, len = this.length; i < len; i += 1) {
		JS.Array.push.call(ret, block(this[i]));
	}
	return ret;
};
Rubylike.Array.prototype.map = Rubylike.Array.prototype.collect;
Rubylike.Array.prototype.combination = function (n, block) {
	/* from ruby-1.9.3-p194/array.c rb_ary_combination */
	if (arguments.length === 0 || 2 < arguments.length) {
		Rubylike.raise('TypeError', "`combination': wrong number of arguments ("+arguments.length+" for 1)");
	}
	if (typeof n !== 'number') {
		Rubylike.raise('TypeError', "`combination': can't convert "+className(n)+" into Integer");
	}
	var array = (function(){
		var ret = Rubylike.Array.new();
		var len = this.length;
		if (n < 0 || len < n) {
			/* yield nothing */
		} else if (n === 0) {
			ret.push([]);
		} else if (n === 1) {
			for (var i = 0; i < len; i += 1) {
				ret.push([this[i]]);
			}
		} else {
			var lev = 0;
			var chosen = [];
			var stack = [];
			for (var i = 0; i < n + 1; i += 1) {
				stack.push(0);
			}
			stack[0] = -1;
			for (;;) {
				chosen[lev] = this[stack[lev+1]];
				for (lev++; lev < n; lev++) {
					stack[lev+1] = stack[lev]+1;
					chosen[lev] = this[stack[lev+1]];
				}
				ret.push(Rubylike.Array.prototype.clone.call(chosen));
				do {
					if (lev === 0) return ret;
					stack[lev--]++;
				} while (stack[lev+1]+n === len+lev+1);
			}
		}
		return ret;
	}).call(this);
	if (typeof block === 'function') {
		array.each(block);
		return this;
	} else {
		return array;
	}
};
Rubylike.Array.prototype.compact = function () {
	return this.reject(function(i){return i === null});
};
Rubylike.Array.prototype.concat = function (other) {
	if (className(other) !== 'Array') {
		Rubylike.raise('TypeError', "`concat': can't convert "+className(other)+" into Array");
	}
	try {
		if (typeof other.to_a === 'function') {
			JS.Array.push.apply(this, other.to_a());
		} else {
			JS.Array.push.apply(this, other);
		}
	} catch (ex) { // if too big size of array, push is throw "RangeError: Maximum call stack size exceeded"
		for (var i = 0, len = other.length; i < len; i += 1) {
			JS.Array.push.call(this, other[i]);
		}
	}
	return this;
};
Rubylike.Array.prototype.reject = function (block) {
	var ret = Rubylike.Array.new();
	for (var i = 0, len = this.length; i < len; i += 1) {
		if (!block(this[i])) JS.Array.push.call(ret, this[i]);
	};
	return (ret.length === this.length) ? null : ret;
};
Rubylike.Array.prototype.delete_if = function (block) {
	for (var i = 0, len = this.length; i < len; i += 1) {
		if (block(this[i])) this.splice(i, 1);
	}
	return this;
};
Rubylike.Array.prototype.cycle = function (n, block) {
	if (arguments.length !== 2) {
		Rubylike.raise('TypeError', "`cycle': wrong number of arguments ("+arguments.length+" for 2)");
	} else {
		for (var i = 0, len = this.length; i < n; i += 1) {
			block(this[i % len])
		}
	}
	return null;
};
Rubylike.Array.prototype.delete = function (val, block) {
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
		this.splice(stack[stack_len], 1);
	}
	return (len !== this.length) ? val : null;
};
Rubylike.Array.prototype.delete_at = function (pos) {
	if (pos < 0) {
		pos += this.length;
	}
	var at = this.at(pos);
	if (at !== null) {
		this.splice(pos, 1);
	}
	return at;
}
Rubylike.Array.prototype.each = function (block) {
	for (var i = 0, len = this.length; i < len; i += 1) {
		block(this[i]);
	}
	return this;
};
Rubylike.Array.prototype.each_index = function (block) {
	for (var i = 0, len = this.length; i < len; i += 1) {
		block(i);
	}
	return this;
};
Rubylike.Array.prototype.each_with_index = function (block) {
	for (var i = 0, len = this.length; i < len; i += 1) {
		block(this[i], i);
	}
	return this;
};
Rubylike.Array.prototype.eql = function (obj) {
	return Rubylike.Object.prototype.eql.call(this, obj);
};
Rubylike.Array.prototype.fetch = function (nth, arg) {
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
};
Rubylike.Array.prototype.fill = function () {
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
};
Rubylike.Array.prototype.first = function (n) {
	if (arguments.length === 0) {
		return this[0];
	} else if (typeof n !== 'number') {
		Rubylike.raise('TypeError', "`first': can't convert " + className(n) + " into Integer");
	} else if (n < 0) {
		Rubylike.raise('ArgumentError', "`first': negative array size");
	} else if (this.length <= n) {
		return this;
	} else {
		return Rubylike.Array.new(JS.Array.slice.call(this, 0, n));
	}
};
Rubylike.Array.prototype.flatten = function (lv) {
	var ret = Rubylike.Array.new();
	if (0 < arguments.length && lv && typeof lv !== 'number') {
		Rubylike.raise('TypeError', "`flatten': can't convert " + className(lv) + " into Integer");
	}
	(function (depth) {
		for (var i = 0, len = this.length; i < len; i += 1) {
			if (Rubylike.Object.prototype.class.call(this[i]) === 'Array' && depth !== lv) {
				arguments.callee.call(this[i], depth+1);
			} else {
				JS.Array.push.call(ret, this[i]);
			}
		}
	}).call(this, 0);
	return ret;
};
Rubylike.Array.prototype.include = function (val) {
	for (var i = 0, len = this.length; i < len; i += 1) {
		if (Rubylike.Object.prototype.eql.call(this[i], val)) return true;
	}
	return false;
};
Rubylike.Array.prototype.index = function (val) {
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
Rubylike.Array.prototype.insert = function () {
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
	this.splice(nth, this.length - nth);
	return this.concat(val);
};
Rubylike.Array.prototype.to_s = function () {
	return '['+this.map(function(i){
		switch (className(i)) {
		case 'RegExp': return i.toString();
		case 'Array': return Rubylike.Array.prototype.to_s.call(i);
		}
		return JSON.stringify(i);
	}).join(', ')+']';
};
Rubylike.Array.prototype.inspect = Rubylike.Array.prototype.to_s;
Rubylike.Array.prototype.keep_if = function (block) {
	var stack = [];
	var stack_len;
	for (var i = 0, len = this.length; i < len; i += 1) {
		if (!block(this[i])) stack.push(i);
	}
	stack_len = stack.length;
	while (stack_len--) {
		this.splice(stack[stack_len], 1);
	}
	return this;
};
Rubylike.Array.prototype.last = function (n) {
	if (arguments.length === 0) {
		return (this.length === 0) ? null : this[this.length - 1];
	} else if (this.length < n) {
		n = this.length;
	} else if (n < 0) {
		Rubylike.raise('ArgumentError', 'negative array size');
	}
	return Rubylike.Array.new(JS.Array.slice.call(this, this.length - n));
};
Rubylike.Array.prototype.permutation = Rubylike.Array.prototype.combination;
Rubylike.Array.prototype.pop = function (n) {
	var ret = Rubylike.Array.new();
	if (this.length === 0) {
		return (arguments.length === 0) ? null : ret;
	} else if (arguments.length === 0) {
		if (typeof this._pop === 'function') {
			return this._pop();
		} else {
			return this.splice(this.length - 1, 1)[0];
		}
	} else if (this.length < n) {
		n = this.length;
	} else if (n < 0) {
		throw new TypeError('negative array size');
	}
	for (var i = 0; i < n; i += 1) {
		if (typeof this._pop === 'function') {
			ret.push(this._pop());
		} else {
			ret.push(this.splice(this.length - 1, 1)[0]);
		}
	}
	return ret.reverse();
};
Rubylike.Array.prototype.product = function () {
	var ret = Rubylike.Array.new();
	var lists = JS.Array.slice.call(arguments);
	var fn = (typeof lists[lists.length - 1] === 'function') ? lists.pop() : null;
	var i, len;

	lists.unshift(this.to_a());
	for (i = 0, len = this.length; i < len; i += 1) {
		(function (depth, stack) {
			var i, len, tmp;
			if (lists.length === depth) {
				tmp = Rubylike.Array.new();
				for (i = 0, len = lists.length; i < len; i += 1) {
					tmp.push(lists[i][stack[i]]);
				}
				ret.push(tmp);
			} else {
				if (className(lists[depth]) !== 'Array') {
					Rubylike.raise('TypeError', "`product': can't convert "+className(lists[depth])+" into Array");
				}
				for (i = 0, len = lists[depth].length; i < len; i += 1) {
					stack[depth] = i;
					arguments.callee(depth+1, stack);
				}
			}
		})(1, [i]);
	}
	if (fn) {
		for (i = 0, len = ret.length; i < len; i += 1) {
			fn(ret[i]);
		}
		return this;
	} else {
		return ret;
	}
};
Rubylike.Array.prototype.push = function () {
	JS.Array.push.apply(this, arguments);
	return this;
};
Rubylike.Array.prototype.rassoc = function (obj) {
	for (var i = 0, len = this.length; i < len; i += 1) {
		var target = this[i];
		if (Rubylike.Object.prototype.eql.call(target[1], obj)) {
			return target;
		}
	}
	return null;
};
Rubylike.Array.prototype.repeated_combination = function (n, block) {
	var ret = Rubylike.Array.new();
	var length = this.length;
	var array = [];
	var i, len;

	if (typeof n !== 'number') {
		Rubylike.raise('TypeError', "`repeated_combination': can't convert "+className(n)+" into Array");
	} else if (n < 0) {
		return ret;
	} else if (n === 0) {
		return Rubylike.Array.new([ret]);
	}

	for (i = 0; i < n; i += 1) array.push(this);

	(function (index, depth, stack) {
		for (var i = index; i < length; i += 1) {
			stack[depth] = i;
			if (depth+1 === n) {
				var tmp = Rubylike.Array.new();
				for (var a = 0; a < n; a += 1) {
					tmp.push(array[a][stack[a]]);
				}
				ret.push(tmp);
			} else {
				arguments.callee(i, depth+1, stack);
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
};
Rubylike.Array.prototype.repeated_permutation = function (n, block) {
	var ret = Rubylike.Array.new();
	var length = this.length;
	var array = [];
	var i, len;

	if (typeof n !== 'number') {
		Rubylike.raise('TypeError', "`repeated_permutation': can't convert "+className(n)+" into Array");
	} else if (n < 0) {
		return ret;
	} else if (n === 0) {
		return Rubylike.Array.new([ret]);
	}

	for (i = 0; i < n; i += 1) array.push(this);

	(function (depth, stack) {
		for (var i = 0; i < length; i += 1) {
			stack[depth] = i;
			if (depth+1 === n) {
				var tmp = Rubylike.Array.new();
				for (var a = 0; a < n; a += 1) {
					tmp.push(array[a][stack[a]]);
				}
				ret.push(tmp);
			} else {
				arguments.callee(depth+1, stack);
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
};
Rubylike.Array.prototype.replace = function (another) {
	if (className(another) !== 'Array') try {
		another = another.to_ary();
	} catch (ex) {
		Rubylike.raise('TypeError', "`replace': can't convert "+className(another)+" into Array")
	}
	this.clear();
	JS.Array.push.apply(this, another);
	return this;
}
Rubylike.Array.prototype.reverse = function () {
	var ret = Rubylike.Array.new();
	var len = this.length;
	while (len--) {
		ret.push(this[len]);
	}
	return ret;
};
Rubylike.Array.prototype.reverse_each = function (block) {
	var i = this.length;
	while (i--) {
		block(this[i]);
	}
	return this;
};
Rubylike.Array.prototype.rindex = function (val) {
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
};
Rubylike.Array.prototype.rotate = function (cnt) {
	var ret = Rubylike.Array.new();
	if (arguments.length === 0) {
		cnt = 1;
	} else try {
		cnt = Rubylike.Number.prototype.to_int.call(cnt);
	} catch (ex) {
		Rubylike.raise('TypeError', "`rotate': can't convert "+className(cnt)+" into Integer");
	}
	return Rubylike.Array.new(JS.Array.slice.call(this, cnt, this.length).concat(JS.Array.slice.call(this, 0, cnt)));
};
Rubylike.Array.prototype.sample = function (n) {
	var len = this.length, ret, clone, rand;
	if (arguments.length === 0) {
		if (len === 0) return null;
		return this[Math.floor(Math.random() * len)];
	} else try {
		n = Rubylike.Number.prototype.to_int.call(n);
	} catch (ex) {
		Rubylike.raise('TypeError', "`sample': can't convert "+className(n)+" into Integer");
	}

	if (n < 0) Rubylike.raise('ArgumentError', "`sample': negative array size");

	ret = Rubylike.Array.new();
	if (len === 0) return ret;
	clone = this.clone();
	while (0 < n--) {
		rand = Math.floor(Math.random() * clone.length);
		JS.Array.push.call(ret, clone.splice(rand, 1)[0]);
	}
	return ret;
};
Rubylike.Array.prototype.select = function (block) {
	var stack = [];
	var stack_len;
	for (var i = 0, len = this.length; i < len; i += 1) {
		if (!block(this[i])) stack.push(i);
	}
	stack_len = stack.length;
	if (stack_len === 0) return null;
	while (stack_len--) {
		this.splice(stack[stack_len], 1);
	}
	return this;
};
Rubylike.Array.prototype.shift = function (n) {
	var len = this.length, i;

	if (arguments.length === 0) {
		if (len === 0) return null;
		return this.splice(0, 1)[0];
	} else try {
		n = Rubylike.Number.prototype.to_int.call(n);
	} catch (ex) {
		Rubylike.raise("`shift': can't convert "+className(n)+" into Integer");
	}

	if (n < 0) Rubylike.raise('ArgumentError', "`shift': negative array size");
	if (len <= n) n = len;
	return Rubylike.Array.new(this.splice(0, n));
};
Rubylike.Array.prototype.shuffle = function () {
	var len = this.length, ret, clone, rand;
	ret = Rubylike.Array.new();
	if (len === 0) return ret;
	clone = this.clone();
	while (0 < len--) {
		rand = Math.floor(Math.random() * clone.length);
		JS.Array.push.call(ret, clone.splice(rand, 1)[0]);
	}
	return ret;
};
Rubylike.Array.prototype.slice = function () {
	if (arguments.length === 1) {
		return this.at(arguments[0]);
	} else if (arguments.length === 2) {
		var pos = Rubylike.Number.prototype.to_int.call(arguments[0]);
		var length = Rubylike.Number.prototype.to_int.call(arguments[1]);
		if (pos < 0) pos += this.length;
		if (this.length <= pos || length < 0) return null;
		return Rubylike.Array.new(JS.Array.slice.call(this, pos, length));
	}
	Rubylike.raise('ArgumentError', "`slice': wrong number of arguments ("+arguments.legnth+" for 1..2)");
};
Rubylike.Array.prototype.sort_by = function (yield) {
	return this.map(function(i){return [yield(i), i]}).sort(function(a, b){
		if (a[0] < b[0]) {
			return -1;
		} else if (a[0] > b[0]) {
			return 1;
		}
		return 0;
	}).map(function(i){ return i[1] });
};
Rubylike.Array.prototype.to_a = function () {
	if (Rubylike.is_defined) {
		return this;
	} else {
		return JS.Array.slice.call(this);
	}
};
Rubylike.Array.prototype.to_ary = function () {
	return this;
};
Rubylike.Array.prototype.transpose= function () {
	var ret = Rubylike.Array.new();
	if (this.length === 0) {
		return ret;
	}
	if (className(this[0]) !== 'Array') {
		Rubylike.raise('TypeError', "`transpose': can't convert "+className(this[0])+" into Array");
	}
	var xlen = this[0].length;
	var ylen = this.length;
	for (var x = 0; x < xlen; x += 1) {
		var stack = Rubylike.Array.new();
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
		ret.push(stack);
	}
	return ret;
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
			this.to_a().each(block);
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
		Rubylike.raise('TypeError', "'merge`: can't convert " + className(other) + " into Hash");
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
	Rubylike.raise('TypeError', "can't convert " + className(string) + " into String");
};
Rubylike.String.prototype.sub = function (pattern, replace) {
	return (Object.prototype.toString.call(replace) === '[object Object]')
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

// className(Array) => 'Array'
var className = function (obj) {
	if (obj === null) return 'nil';
	if (obj === undefined) return 'undefined';
	switch (Object.prototype.toString.call(obj)) {
		case '[object Number]': return 'Number';
	}
	var reg = /^\s*function\s*([^\(]*)[\S\s]+$/im;
	return typeof(obj) === 'function'
		? (obj+'').replace(reg, '$1')
		: (obj.constructor+'').replace(reg, '$1');
};

var define = function (obj, ruby) {
	if (Rubylike[className(obj)]._methods === undefined) {
		Rubylike[className(obj)]._methods = [];
	}
	obj.new = ruby.new;
	for (var method in ruby.prototype) if (ruby.prototype.hasOwnProperty(method)) {
		Rubylike[className(obj)]._methods.push(method);
		if (typeof obj.prototype[method] === 'function' && className(obj) !== 'Hash') {
			obj.prototype['_' + method] = obj.prototype[method];
			Rubylike[className(obj)]._methods.push('_' + method);
		}
		obj.prototype[method] = ruby.prototype[method];
	}
};

var remove = function (obj) {
	var methods = JS.Array.sort.call(Rubylike[className(obj)]._methods).reverse();
	Rubylike[className(obj)]._methods = [];
	delete obj.new;
	for (var i = 0, len = methods.length; i < len; i += 1) {
		var method = methods[i];
		if (/^_/.test(method) && method !== '_methods') {
			obj.prototype[method.substr(1, method.length - 1)] = obj.prototype[method];
		}
		delete obj.prototype[method];
	}
};

Rubylike.version = '0.0.0';

Rubylike.is_defined = false;

Rubylike.define = function () {
	nil = null; // global variable
	Hash = Rubylike.Hash;
	define(Object, Rubylike.Object);
	define(Array, Rubylike.Array);
	define(Hash, Rubylike.Hash);
	define(String, Rubylike.String);
	define(Number, Rubylike.Number);
	Rubylike.is_defined = true;
};

Rubylike.remove = function () {
	remove(Object);
	remove(Array);
	remove(String);
	remove(Number);
	delete Hash;
	delete nil;
	Rubylike.is_defined = false;
};

Rubylike.raise = function (name, message) {
	var error = new Error();
	error.name = name;
	error.message = message;
	throw error;
}

this.Rubylike = Rubylike;

}).call(this);
