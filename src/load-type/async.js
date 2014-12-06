var $ = require('jquery');
var hashCode = require('hash-code').hashCode;
var defaults = require('../defaults');
var dom = require('../dom');
var dfdResolve = require('../resolve-deferred');
var assetsCache = require('../assets-cache');
var asyncCache = require('../async-cache');
var meta = require('../meta');

/**
 * Load async (CORS) asset
 *
 * Caching of assets depends on browser options since we use standard DOM
 * insertion and don’t rely on jQuery to handle it.
 *
 * @param  {String} url
 *
 * @return {Promise}
 */
function loadAsyncAsset ( url ) {

	return dfdResolve({
		url: url,
		cache: defaults.cache,
		dfd: true,
		promise: true,
		cb: function () {

			var id;
			var js;

			if ( /connect\.facebook/.test(url) ) {
				id = 'facebook-jssdk';
			} else if ( /platform\.twitter/.test(url) ) {
				id = 'twitter-wjs';
			} else if ( /apis\.google/.test(url) ) {
				id = 'gplus-sdk';
			} else {
				id = meta.ns.htmlId + '-async_' + hashCode(url);
			}

			if ( $('#' + id).length === 0 && $.inArray(url, asyncCache) === -1 ) {

				dom.asyncRef = dom.asyncRef || document.getElementsByTagName('script')[0];
				js = document.createElement('script');
				js.src = url;
				js.id = id;
				dom.asyncRef.parentNode.insertBefore(js, dom.asyncRef);

				asyncCache.push(url);

			}

			assetsCache[url].dfd.resolve(js, 'success', window);

		}
	});

}

module.exports = loadAsyncAsset;
