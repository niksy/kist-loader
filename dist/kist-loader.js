/*! kist-loader 0.4.3 - Simple asset loader. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( $, window, document, undefined ) {

	var asyncCache = [];
	var assetsCache = {};
	var regex = {
		extension: /\.(\w+)(?:\?.+)?$/i,
		explicitType: /^(\w+?)!/i
	};
	var dom = {
		head: $('head')
	};

	/**
	 * Normalize single asset result to array element to keep it consistent
	 * with passed arguments from multiple asset results
	 *
	 * @param  {Array} args
	 *
	 * @return {Array}
	 */
	function argsNormalize ( args ) {

		var arr = [];
		args = Array.prototype.slice.call(args);

		/**
		 * If first result is not array, we push every result from
		 * passed arguments as new array element.
		 */
		if ( $.type(args[0]) !== 'array' ) {

			// If first result is undefined, we transform it to empty string
			if ( $.type(args[0]) === 'undefined' ) {
				args[0] = '';
			} else {
				arr.push(args);
			}

		} else {
			arr = args;
		}

		return arr;

	}

	/**
	 * Construct array of results for elements like string
	 *
	 * @param  {String|Array} url
	 *
	 * @return {Array}
	 */
	function constructArray ( url ) {
		if ( typeof(url) === 'string' ) {
			return url.split();
		}
		return url;
	}

	/**
	 * Construct options object
	 *
	 * @param  {String|Array|Object} options
	 *
	 * @return {Object}
	 */
	function constructOptions ( options ) {

		var obj = {
			url: ['']
		};

		switch ( $.type(options) ) {
			case 'array':
				obj.url = obj.url.concat(options);
				break;
			case 'string':
				obj.url = constructArray(options);
				break;
			case 'object':
				$.extend(obj, options);
				obj.url = constructArray(obj.url);
				break;
		}

		// Remove empty items from array if they are not the only ones inside array
		$.each(obj.url, function ( index, item ) {
			if ( item === '' && obj.url.length !== 1 ) {
				obj.url.splice(index, 1);
			}
		});

		return $.extend({}, loader.defaults, obj);

	}

	/**
	 * Get asset type by URL
	 *
	 * @param  {String} url
	 *
	 * @return {String}
	 */
	function getAssetType ( url ) {

		var type = 'js';

		if ( url.match(regex.explicitType) ) {
			type = url.match(regex.explicitType)[1];
		} else if ( url.match(regex.extension) ) {
			type = url.match(regex.extension)[1];
			if ( /jpe?g|png|gif|webp/i.test(type) ) {
				type = 'img';
			}
		} else if ( url === '' ) {
			type = '';
		}

		return type;

	}

	/**
	 * Force asset type for URL
	 *
	 * @param {String} type
	 * @param {String} url
	 *
	 * @return {String}
	 */
	function setAssetType ( type, url ) {

		url = cleanAssetUrl(url);
		url = type + '!' + url;

		return url;

	}

	/**
	 * Clean asset URL from prefixes which force asset type
	 *
	 * @param  {String} url
	 *
	 * @return {String}
	 */
	function cleanAssetUrl ( url ) {
		return url.replace(regex.explicitType,'');
	}

	/**
	 * Load asset based on URL
	 *
	 * @param  {String} url
	 * @param  {Object} options
	 *
	 * @return {Promise}
	 */
	function loadAsset ( url, options ) {

		var type = getAssetType(url);
		url = cleanAssetUrl(url);

		switch ( type ) {
			case 'js':
				return loadAjaxAsset(url, $.extend({}, { dataType: 'script' }, options));
			case 'css':
				return loadStyleAsset(url, options);
			case 'img':
				return loadImageAsset(url, options);
			case 'txt':
			case 'text':
			case 'template':
				return loadAjaxAsset(url, $.extend({}, { dataType: 'text' }, options));
			case 'async':
				return loadAsyncAsset(url);
		}

	}

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
		assets = constructArray(assets);

		$.each( assets, function ( index, url ) {
			dfds.push(loadAsset(url, options));
		});

		return dfds;

	}

	/**
	 * Resolve alias
	 *
	 * @return {Promise}
	 */
	function aliasResolve () {

		var options = Array.prototype.slice.call(arguments);

		// Remove first argument (asset type) from options array
		var type = options.shift();

		options[0] = constructOptions(options[0]);

		$.each( options[0].url, function ( index, url ) {
			options[0].url[index] = setAssetType(type, url);
		});

		return loader.load.apply(null, options);

	}

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
				var style;

				var existingStyles = styles.filter(function () {
					return $(this).data('url') === cleanUrl;
				});
				var existingCachedStyles = styles.filter(function () {
					return $(this).data('cachedUrl');
				});

				url = ( !options.cache ? url + '?_=' + $.now() : cleanUrl );

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

					style =
						$('<link rel="stylesheet" type="text/css" href="' + url + '" />')
							.data(linkData);

					if ( xhr.getResponseHeader('Content-Type') === 'text/plain' ) {
						style =
							style
								.add(
									$('<style type="text/css">' + data + '</style>')
										.data(linkData)
								);
					}

					style.appendTo(dom.head);

				});

			}
		});

	}

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

				img.onload  = $.proxy( assetsCache[url].dfd.resolve, window, img, 'success' );
				img.onerror = img.onabort = $.proxy( assetsCache[url].dfd.reject, window, img, 'error' );

				img.src = ( !options.cache ? url + '?_=' + $.now() : url );

			}
		});

	}

	/**
	 * Load async (CORS) asset
	 *
	 * @param  {String} url
	 *
	 * @return {Promise}
	 */
	function loadAsyncAsset ( url ) {

		return dfdResolve({
			url: url,
			cache: loader.defaults.cache,
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
				}

				if ( $('#' + id).length === 0 && $.inArray(url, asyncCache) === -1 ) {

					js = $('<script />', {
						src: url,
						id: id
					});
					js.appendTo(dom.head);

					asyncCache.push(url);

				}

				assetsCache[url].dfd.resolve(js[0], 'success', window);

			}
		});

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
				var args = argsNormalize(arguments);
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

	var loader = {

		load      : load,
		loadScript: $.proxy(aliasResolve, null, 'js'),
		loadStyle : $.proxy(aliasResolve, null, 'css'),
		loadImage : $.proxy(aliasResolve, null, 'img'),
		loadText  : $.proxy(aliasResolve, null, 'txt'),
		loadAsync : $.proxy(aliasResolve, null, 'async'),

		defaults: {
			cache: true
		}

	};

	$.kist = $.kist || {};
	$.kist.loader = loader;

})( jQuery, window, document );
