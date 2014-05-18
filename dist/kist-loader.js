/* kist-loader 0.3.0 - Simple asset loader. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( $, window, document, undefined ) {

	var assetsCache = {};
	var regex = {
		extension: /\.(\w+)(?:\?.+)?$/i,
		explicitType: /^(\w+?)!/i
	};
	var async = {
		js: null,
		fjs: document.getElementsByTagName('script')[0]
	};
	var dom = {
		head: $('head')
	};

	function argsResolve ( args ) {

		var arr = [];

		if ( $.type(args[0]) !== 'array' ) {
			arr.push( Array.prototype.slice.call(args) );
		} else {
			arr = args;
		}

		return arr;

	}

	function constructArray ( url ) {
		if ( typeof(url) === 'string' ) {
			return url.split();
		}
		return url;
	}

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

	function assetType ( url ) {

		var type;

		if ( url.match(regex.explicitType) ) {
			type = url.match(regex.explicitType)[1];
		} else if ( url.match(regex.extension) ) {
			type = url.match(regex.extension)[1];
			if ( /jpe?g|png|gif|webp/i.test(type) ) {
				type = 'img';
			}
		} else {
			type = 'js';
		}

		return type;

	}

	function cleanAssetUrl ( url ) {
		return url.replace(regex.explicitType,'');
	}

	function resolveAsset ( url, options ) {

		var type = assetType( url );
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

	function forceAssetType ( type, assets ) {

		var arr = [];
		assets = constructArray(assets);

		$.each( assets, function ( index, url ) {
			url = cleanAssetUrl(url);
			arr.push( type + '!' + url );
		});

		return arr;

	}

	function bundleDfds ( assets, options ) {

		var dfds = [];
		assets = constructArray(assets);

		$.each( assets, function ( index, url ) {
			dfds.push( resolveAsset( url, options ) );
		});

		return dfds;

	}

	function aliasResolve () {

		var options = Array.prototype.slice.call(arguments);
		var type    = options.shift();

		options[0]     = constructOptions.call(this, options[0]);
		options[0].url = forceAssetType(type, options[0].url);

		return this.load.apply(this, options);

	}

	function loadAjaxAsset ( url, options, cb ) {

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
			)
			.done(cb);

		return assetsCache[ url ].dfd.promise();

	}

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

		return loadAjaxAsset(url, $.extend({}, { dataType: 'text' }), function ( data, textStatus, xhr ) {

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

			style
				.appendTo(dom.head);

		});

	}

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

	function loadAsyncAsset ( url ) {

		if ( assetsCache[ url ] ) {
			return assetsCache[ url ].dfd.promise();
		}

		assetsCache[ url ] = {};
		assetsCache[ url ].dfd = $.Deferred();

		if ( /connect\.facebook/.test(url) ) {
			id = 'facebook-jssdk';
		} else if ( /platform\.twitter/.test(url) ) {
			id = 'twitter-wjs';
		} else if ( /apis\.google/.test(url) ) {
			id = 'gplus-sdk';
		}

		if ( !async.fjs || !async.fjs.parentNode ) {
			async.fjs = document.getElementsByTagName('script')[0];
		}
		if ( document.getElementById(id) ) {
			return;
		}
		async.js = document.createElement('script');
		async.js.src = url;
		if ( id ) {
			async.js.id = id;
		}
		async.fjs.parentNode.insertBefore(async.js, async.fjs);

		assetsCache[ url ].dfd.resolve();

		return assetsCache[ url ].dfd.promise();

	}

	function Loader () {}

	$.extend(Loader.prototype, {

		load: function ( options, cb ) {

			var dfd = $.Deferred();

			options = constructOptions.call(this, options);

			$.when
				.apply( window, bundleDfds( options.url, { cache: options.cache } ) )
				.done(function () {
					dfd.resolve.apply( window, argsResolve(arguments) );
					if ( cb ) {
						cb.apply( window, argsResolve(arguments) );
					}
					if ( options.success ) {
						options.success.apply( window, argsResolve(arguments) );
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
