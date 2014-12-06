var $ = require('jquery');
var getAssetType = require('../asset').getType;
var dom = require('../dom');
var dfdResolve = require('../resolve-deferred');
var loadAjaxAsset = require('./ajax');
var meta = require('../meta');

/**
 * Load style asset
 *
 * @param  {String} url
 * @param  {Object} options
 *
 * @return {Promise}
 */
function loadStyleAsset ( url, options ) {

	return dfdResolve({
		url: url,
		cache: options.cache,
		dfd: false,
		promise: false,
		cb: function () {

			var cleanUrl = url;
			var linkData = {};
			var styles   = $('link, style');
			var style    = $();

			var existingStyles = styles.filter(function () {
				return $(this).data('url') === cleanUrl;
			});
			var existingCachedStyles = styles.filter(function () {
				return $(this).data('cachedUrl');
			});

			url = (!options.cache ? url + '?_=' + $.now() : cleanUrl);

			return loadAjaxAsset(url, $.extend({}, { dataType: 'text' })).done(function ( data, textStatus, xhr ) {

				linkData.url = cleanUrl;
				if ( !options.cache ) {
					linkData.cachedUrl = url;
				}

				if (
					existingStyles.length !== 0 &&
					!options.cache
				) {
					existingStyles.remove();
				}

				if (
					existingCachedStyles.length !== 0 &&
					options.cache
				) {
					existingCachedStyles.remove();
				}

				if ( getAssetType(url) === 'css' ) {
					style =
						$('<link rel="stylesheet" href="' + url + '" class="' + meta.ns.htmlClass + '-linkEl" />')
							.data(linkData);
				}

				if ( xhr.getResponseHeader('Content-Type') === 'text/plain' || getAssetType(url) !== 'css' ) {
					style =
						style
							.add(
								$('<style class="' + meta.ns.htmlClass + '-styleEl">' + data + '</style>')
									.data(linkData)
							);
				}

				style.appendTo(dom.head);

			});

		}
	});

}

module.exports = loadStyleAsset;
