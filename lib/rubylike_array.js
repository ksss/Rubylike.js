(function(){

var Rubylike = function () {
	throw new Error("can't use Rubylike() method without require rubylike.js");
};

Rubylike.Array = function Array () {
};

Rubylike.Array.new = function (size, val) {
	var ret = new Array();
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
Rubylike.Array.prototype.first = function () {
	return this[0];
};
Rubylike.Array.prototype.to_a = function () {
	return this;
};
Rubylike.Array.prototype.each = function (block) {
	if (typeof this.forEach === 'function') {
		this.forEach(block);
		return this;
	}
	for (var i = 0, len = this.length; i < len; i += 1) (function (it) {
		block(it);
	})(this[i]);
	return this;
};
Rubylike.Array.prototype.inject = function () {
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

this.Rubylike = Rubylike;

}).call(this);
