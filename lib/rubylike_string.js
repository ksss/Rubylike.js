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
Rubylike.String.prototype.gsub = function (pattern, replace) {
	var str = pattern.toString().replace(/\/(.*)\/.*$/, '$1');
	pattern = new RegExp(str, 'g');
	return this.replace(pattern, replace);
};

this.Rubylike = Rubylike;

function p () {
	console.log(Array.prototype.slice.call(arguments));
}

}).call(this);
