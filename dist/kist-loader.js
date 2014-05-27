/*! kist-loader 0.3.0 - Simple asset loader. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( $, window, document, undefined ) {

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

		// If first result is not array, we push every result from
		// passed arguments as new array element
		if ( $.type(args[0]) !== 'array' ) {
			arr.push( args );
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

		var obj = {};

		switch ( $.type(options) ) {
			case 'array':
				obj.url = options;
				break;
			case 'string':
				obj.url = options;
				break;
			case 'object':
				$.extend(obj, options);
				break;
		}

		obj.url = constructArray(obj.url);

		return $.extend({}, this.defaults, obj);

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
	 * Clean asset URL from prefixes which force asse type
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

		var type = getAssetType( url );
		url = cleanAssetUrl( url );

		switch ( type ) {
			case 'js':
				return loadAjaxAsset( url, $.extend({}, { dataType: 'script' }, options) );
			case 'css':
				return loadStyleAsset( url, options );
			case 'img':
				return loadImageAsset( url, options );
			case 'async':
				return loadAsyncAsset( url );
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
			dfds.push( loadAsset( url, options ) );
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
		var type    = options.shift();

		options[0] = constructOptions.call(this, options[0]);

		$.each( options[0].url, function ( index, url ) {
			options[0].url[index] = setAssetType(type, url);
		});

		return this.load.apply(this, options);

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

		if ( assetsCache[ url ] && options.cache ) {
			return assetsCache[ url ].dfd.promise();
		}

		assetsCache[ url ] = {};
		assetsCache[ url ].dfd =
			$.ajax(
				$.extend({
					url: url,
					cache: true
				}, options)
			);

		return assetsCache[ url ].dfd.promise();

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

		if ( assetsCache[ url ] && options.cache ) {
			return assetsCache[ url ].dfd.promise();
		}

		var cleanUrl = url;
		var linkData = {};
		var style;
		var styles               = $('link, style');
		var existingStyles       = styles.filter(function () { return $(this).data('url') === cleanUrl; });
		var existingCachedStyles = styles.filter(function () { return $(this).data('cachedUrl'); });

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

	/**
	 * Load image asset
	 *
	 * @param  {String} url
	 * @param  {Object} options
	 *
	 * @return {Promise}
	 */
	function loadImageAsset ( url, options ) {

		if ( assetsCache[ url ] && options.cache ) {
			return assetsCache[ url ].dfd.promise();
		}

		assetsCache[ url ] = {};
		assetsCache[ url ].dfd = $.Deferred();

		var img = new Image();

		assetsCache[ url ].dfd.always(function () {
			img.onload = img.onerror = img.onabort = null;
		});

		img.onload  = $.proxy( assetsCache[ url ].dfd.resolve, window, img, 'success' );
		img.onerror = img.onabort = $.proxy( assetsCache[ url ].dfd.reject, window, img, 'error' );

		img.src = ( !options.cache ? url + '?_=' + $.now() : url );

		return assetsCache[ url ].dfd.promise();

	}

	/**
	 * Load async (CORS) asset
	 *
	 * @param  {String} url
	 *
	 * @return {Promise}
	 */
	function loadAsyncAsset ( url ) {

		if ( assetsCache[ url ] ) {
			return assetsCache[ url ].dfd.promise();
		}

		assetsCache[ url ] = {};
		assetsCache[ url ].dfd = $.Deferred();

		var id;
		var js;

		if ( /connect\.facebook/.test(url) ) {
			id = 'facebook-jssdk';
		} else if ( /platform\.twitter/.test(url) ) {
			id = 'twitter-wjs';
		} else if ( /apis\.google/.test(url) ) {
			id = 'gplus-sdk';
		}

		if ( $('#' + id).length === 0 ) {

			js = $('<script />', {
				src: url,
				id: id
			});
			js.appendTo(dom.head);

		}

		assetsCache[ url ].dfd.resolve(js[0], 'success');

		return assetsCache[ url ].dfd.promise();

	}

	function Loader () {}

	$.extend(Loader.prototype, {

		load: function ( options, cb ) {

			var dfd = $.Deferred();

			options = constructOptions.call(this, options);

			$.when
				.apply( window, bundledDfds( options.url, { cache: options.cache } ) )
				.done(function () {
					var args = argsNormalize(arguments);
					dfd.resolve.apply( window, args );
					if ( cb ) {
						cb.apply( window, args );
					}
					if ( options.success ) {
						options.success.apply( window, args );
					}
				})
				.fail(function () {
					dfd.reject.apply( window, arguments );
					if ( options.error ) {
						options.error.apply( window, arguments );
					}
				});

			return dfd.promise();

		},

		loadScript: $.proxy( aliasResolve, null, 'js' ),
		loadStyle : $.proxy( aliasResolve, null, 'css' ),
		loadImage : $.proxy( aliasResolve, null, 'img' ),
		loadAsync : $.proxy( aliasResolve, null, 'async' ),

		defaults: {
			cache: true
		}

	});

	$.kist = $.kist || {};
	$.kist.loader = new Loader();

})( jQuery, window, document );
