var load = require('./src/load-type/generic');
var aliasResolve = require('./src/load-type/by-alias');
var defaults = require('./src/defaults');

module.exports = {
	load: load,
	loadScript: aliasResolve('js'),
	loadStyle: aliasResolve('css'),
	loadImage: aliasResolve('img'),
	loadText: aliasResolve('txt'),
	loadAsync: aliasResolve('async'),
	defaults: defaults
};
