var $ = require('jquery');
var dfdResolve = require('../resolve-deferred');
var assetsCache = require('../assets-cache');

/**
 * Generic AJAX asset load
 *
 * @param  {String}   url
 * @param  {Object}   options
 *
 * @return {Promise}
 */
function loadAjaxAsset ( url, options ) {

	return dfdResolve({
		url: url,
		cache: options.cache,
		dfd: false,
		promise: true,
		cb: function () {

			assetsCache[url] = {};
			assetsCache[url].dfd =
				$.ajax(
					$.extend({
						url: url,
						cache: true
					}, options)
				);

		}
	});

}

module.exports = loadAjaxAsset;
