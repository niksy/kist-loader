var $ = require('jquery');
var assetsCache = require('./assets-cache');

/**
 * Helper function for deferreds resolving
 *
 * @param  {Object}   params
 *
 * @return {Promise}
 */
function dfdResolve ( params ) {

	if ( assetsCache[params.url] && params.cache ) {
		return assetsCache[params.url].dfd.promise();
	}

	if ( params.dfd ) {
		assetsCache[params.url] = {};
		assetsCache[params.url].dfd = $.Deferred();
	}

	if ( params.promise ) {
		params.cb();
		return assetsCache[params.url].dfd.promise();
	}

	return params.cb();

}

module.exports = dfdResolve;
