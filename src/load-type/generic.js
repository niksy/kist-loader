var $ = require('jquery');
var toarray = require('toarray');
var normalizeArgs = require('../util/normalize-arguments');
var constructOptions = require('../util/construct-options');
var loadAsset = require('./by-url');

/**
 * Bundle all deferreds to array
 *
 * @param  {Array} assets
 * @param  {Object} options
 *
 * @return {Array}
 */
function bundledDfds ( assets, options ) {

	var dfds = [];
	assets = toarray(assets);

	$.each(assets, function ( index, url ) {
		dfds.push(loadAsset(url, options));
	});

	return dfds;

}


/**
 * @param  {String|Array|Object} options
 * @param  {Function} cb
 *
 * @return {Promise}
 */
function load ( options, cb ) {

	var dfd = $.Deferred();

	options = constructOptions(options);

	$.when
		.apply(window, bundledDfds(options.url, { cache: options.cache } ))
		.done(function () {
			var args = normalizeArgs(arguments);
			dfd.resolve.apply(window, args);
			if ( cb ) {
				cb.apply(window, args);
			}
			if ( options.success ) {
				options.success.apply(window, args);
			}
		})
		.fail(function () {
			dfd.reject.apply(window, arguments);
			if ( options.error ) {
				options.error.apply(window, arguments);
			}
		});

	return dfd.promise();

}

module.exports = load;
