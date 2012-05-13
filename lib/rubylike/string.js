(function(){

var Rubylike = function () {
	throw new Error("can't use Rubylike() method without require rubylike.js");
};

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
	if (Object.prototype.toString.call(replace) === '[object Object]') {
		return this.replace(pattern, function (match, index, self) {
			return replace[match] || '';
		});
	} else {
		return this.replace(pattern, replace);
	}
};
Rubylike.String.prototype.gsub = function (pattern, replace) {
	pattern = pattern.toString().replace(/\/(.*)\/.*$/, '$1');
	pattern = new RegExp(pattern, 'g');
	return Rubylike.String.prototype.sub.call(this, pattern, replace);
};

this.Rubylike = Rubylike;

}).call(this);
