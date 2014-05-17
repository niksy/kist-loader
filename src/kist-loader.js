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

	function resolveAsset ( url ) {

		var type = assetType( url );
		url = cleanAssetUrl( url );

		switch ( type ) {
			case 'js':
				return loadAjaxAsset( url, { dataType: 'script' } );
			case 'css':
				return loadStyleAsset( url );
			case 'img':
				return loadImageAsset( url );
			case 'async':
				return loadAsyncAsset( url );
		}

	}

	function forceAssetType ( deps, type ) {

		var arr = [];

		if ( typeof(deps) === 'string' ) {
			deps = cleanAssetUrl(deps);
			arr.push( type + '!' + deps );
		} else {
			$.each( deps, function ( index, url ) {
				url = cleanAssetUrl(url);
				arr.push( type + '!' + url );
			});
		}

		return arr;

	}

	function dfdBundle ( deps ) {

		var dfds = [];

		if ( typeof(deps) === 'string' ) {
			dfds.push( resolveAsset( deps ) );
		} else {
			$.each( deps, function ( index, url ) {
				dfds.push( resolveAsset( url ) );
			});
		}

		return dfds;

	}

	function aliasResolve () {

		var args = Array.prototype.slice.call(arguments);
		type = args.shift();

		args[0] = forceAssetType(args[0], type);

		return this.load.apply(null, args);

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

	function loadAjaxAsset ( url, params, cb ) {

		if ( assetsCache[ url ] ) {
			return assetsCache[ url ].dfd.promise();
		}

		assetsCache[ url ] = {};
		assetsCache[ url ].dfd =
			$.ajax(
				$.extend({
					url: url,
					cache: true
				}, params)
			)
			.done(cb);

		return assetsCache[ url ].dfd.promise();

	}

	function loadStyleAsset ( url ) {

		if ( assetsCache[ url ] ) {
			return assetsCache[ url ].dfd.promise();
		}

		return loadAjaxAsset(url, { dataType: 'text' }, function () {

			var link = $('<link />')
				.appendTo(dom.head)
				.attr({
					type: 'text/css',
					rel: 'stylesheet',
					href: url
				});

		});

	}

	function loadImageAsset ( url ) {

		function cleanUp () {
			img.onload = img.onerror = null;
		}

		if ( assetsCache[ url ] ) {
			return assetsCache[ url ].dfd.promise();
		}

		assetsCache[ url ] = {};
		assetsCache[ url ].dfd = $.Deferred();

		var img = new Image();

		assetsCache[ url ].dfd.then( cleanUp, cleanUp );

		img.onload = $.proxy( assetsCache[ url ].dfd.resolve, window, img, 'success' );
		img.onerror = $.proxy( assetsCache[ url ].dfd.reject, window, img, 'error' );

		img.src = url;

		return assetsCache[ url ].dfd.promise();

	}

	function Loader () {}

	$.extend(Loader.prototype, {

		load: function ( deps, doneCb, failCb ) {

			var dfd = $.Deferred();

			$.when
				.apply( window, dfdBundle( deps ) )
				.done(function () {
					dfd.resolve.apply( window, argsResolve(arguments) );
					if ( doneCb ) {
						doneCb.apply( window, argsResolve(arguments) );
					}
				})
				.fail(function () {
					dfd.reject.apply( window, arguments );
					if ( failCb ) {
						failCb.apply( window, arguments );
					}
				});

			return dfd.promise();

		},

		loadJS   : $.proxy( aliasResolve, null, 'js' ),
		loadCSS  : $.proxy( aliasResolve, null, 'css' ),
		loadImage: $.proxy( aliasResolve, null, 'img' ),
		loadAsync: $.proxy( aliasResolve, null, 'async' )

	});

	$.kist = $.kist || {};
	$.kist.loader = new Loader();

})( jQuery, window, document );
