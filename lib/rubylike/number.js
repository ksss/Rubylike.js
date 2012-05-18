(function(){

var Rubylike = function () {
	throw new Error("can't use Rubylike() method without require rubylike.js");
};

Rubylike.Number = function Number () {
};

Rubylike.Number.prototype.to_s = function () {
	return this + '';
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
		} else {
			for (i = 0; i < self; i += 1) {
				enumerator.push(i);
			}
			return enumerator;
		}
	}
	return self;
};
Rubylike.Number.prototype.upto = function (to, block) {
	var enumerator, self, i;
	enumerator = [];
	self = this.valueOf();

	if (self <= to) {
		if (typeof block === 'function') {
			for (i = self; i <= to; i += 1) {
				block(i);
			}
		} else {
			for (i = self; i <= to; i += 1) {
				enumerator.push(i);
			}
			return enumerator;
		}
	}
	return self;
};
Rubylike.Number.prototype.downto = function (to, block) {
	var enumerator, self, i;
	enumerator = [];
	self = this.valueOf();

	if (to <= self) {
		if (typeof block === 'function') {
			for (i = self; to <= i; i -= 1) {
				block(i);
			}
		} else {
			for (i = self; to <= i; i -= 1) {
				enumerator.push(i);
			}
			return enumerator;
		}
	}
	return self;
};

this.Rubylike = Rubylike;

}).call(this);
