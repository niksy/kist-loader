var $ = require('jquery');
var dfdResolve = require('../resolve-deferred');
var assetsCache = require('../assets-cache');

/**
 * Load image asset
 *
 * @param  {String} url
 * @param  {Object} options
 *
 * @return {Promise}
 */
function loadImageAsset ( url, options ) {

	return dfdResolve({
		url: url,
		cache: options.cache,
		dfd: true,
		promise: true,
		cb: function () {

			var img = new Image();

			assetsCache[url].dfd.always(function () {
				img.onload = img.onerror = img.onabort = null;
			});

			img.onload  = $.proxy(assetsCache[url].dfd.resolve, global, img, 'success');
			img.onerror = img.onabort = $.proxy(assetsCache[url].dfd.reject, global, img, 'error');

			img.src = (!options.cache ? url + '?_=' + $.now() : url);

		}
	});

}

module.exports = loadImageAsset;
