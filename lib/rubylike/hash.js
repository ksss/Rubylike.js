(function(){

function Rubylike () {
	throw new Error("can't use Rubylike() method without require rubylike.js");
};

Rubylike.Hash = function Hash (obj) {
	if (typeof obj === 'object') {
		for (var key in obj) if (obj.hasOwnProperty(key)) {
			this[key] = obj[key];
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
Rubylike.Hash.prototype.first = function () {
	return this.to_a()[0];
};
Rubylike.Hash.prototype.shift = function () {
	var first = this.first();
	delete this[first[0]];
	return first;
};
Rubylike.Hash.prototype.each = function (block) {
	var array;
	array = this.to_a();
	array.forEach(block);
	return this;
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
Rubylike.Hash.prototype.keys = function () {
	return Object.keys(this);
};

this.Rubylike = Rubylike;

}).call(this);
