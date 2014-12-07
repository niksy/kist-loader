/*! kist-loader 0.4.7 - Simple asset loader. | Author: Ivan Nikolić, 2014 | License: MIT */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self);var o=f;o=o.jQuery||(o.jQuery={}),o=o.kist||(o.kist={}),o.loader=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var load = require(13);
var aliasResolve = require(11);
var defaults = require(7);

module.exports = {
	load: load,
	loadScript: aliasResolve('js'),
	loadStyle: aliasResolve('css'),
	loadImage: aliasResolve('img'),
	loadText: aliasResolve('txt'),
	loadAsync: aliasResolve('async'),
	defaults: defaults
};

},{}],2:[function(require,module,exports){
'use strict';

exports.hashCode = function(str) {
  var hash = 0;
  for (var i = 0, len = str.length; i < len; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
};

},{}],3:[function(require,module,exports){
module.exports = function(item) {
  if(item === undefined)  return [];
  return Object.prototype.toString.call(item) === "[object Array]" ? item : [item];
}
},{}],4:[function(require,module,exports){
var regex = {
	extension: /\.(\w+)(?:\?.+)?$/i,
	explicitType: /^(\w+?)!/i,
	images: /jpe?g|png|gif|webp/i
};

/**
 * Clean asset URL from prefixes which force asset type
 *
 * @param  {String} url
 *
 * @return {String}
 */
function cleanUrl ( url ) {
	return url.replace(regex.explicitType, '');
}

/**
 * Get asset type by URL
 *
 * @param  {String} url
 *
 * @return {String}
 */
function getType ( url ) {

	var type = 'js';

	if ( url.match(regex.explicitType) ) {
		type = url.match(regex.explicitType)[1];
	} else if ( url.match(regex.extension) ) {
		type = url.match(regex.extension)[1];
		if ( regex.images.test(type) ) {
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
function setType ( type, url ) {
	return type + '!' + cleanUrl(url);
}

module.exports = {
	setType: setType,
	getType: getType,
	cleanUrl: cleanUrl
};

},{}],5:[function(require,module,exports){
module.exports = {};

},{}],6:[function(require,module,exports){
module.exports = [];

},{}],7:[function(require,module,exports){
module.exports = {
	cache: true
};

},{}],8:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

module.exports = {
	head: $('head')
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var dfdResolve = require(17);
var assetsCache = require(5);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var hashCode = require(2).hashCode;
var defaults = require(7);
var dom = require(8);
var dfdResolve = require(17);
var assetsCache = require(5);
var asyncCache = require(6);
var meta = require(16);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var constructOptions = require(18);
var setAssetType = require(4).setType;
var load = require(13);

/**
 * @param  {String} type
 *
 * @return {Function}
 */
function aliasResolve ( type ) {

	/**
	 * @return {Promise}
	 */
	return function () {

		var options = [].slice.call(arguments);

		options[0] = constructOptions(options[0]);

		$.each(options[0].url, function ( index, url ) {
			options[0].url[index] = setAssetType(type, url);
		});

		return load.apply(null, options);

	};

}

module.exports = aliasResolve;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var getAssetType = require(4).getType;
var cleanAssetUrl = require(4).cleanUrl;
var loadAjaxAsset = require(9);
var loadStyleAsset = require(15);
var loadImageAsset = require(14);
var loadAsyncAsset = require(10);

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

module.exports = loadAsset;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var toarray = require(3);
var normalizeArgs = require(19);
var constructOptions = require(18);
var loadAsset = require(12);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var dfdResolve = require(17);
var assetsCache = require(5);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var getAssetType = require(4).getType;
var dom = require(8);
var dfdResolve = require(17);
var loadAjaxAsset = require(9);
var meta = require(16);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
module.exports = {
	name: 'loader',
	ns: {
		htmlClass: 'kist-Loader',
		htmlId: 'kist-Loader'
	}
};

},{}],17:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var assetsCache = require(5);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],18:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var toarray = require(3);
var defaults = require(7);

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
			obj.url = toarray(options);
			break;
		case 'object':
			$.extend(obj, options);
			obj.url = toarray(obj.url);
			break;
	}

	// Remove empty items from array if they are not the only ones inside array
	$.each(obj.url, function ( index, item ) {
		if ( item === '' && obj.url.length !== 1 ) {
			obj.url.splice(index, 1);
		}
	});

	return $.extend({}, defaults, obj);

}

module.exports = constructOptions;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

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
	args = [].slice.call(args);

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

module.exports = argsNormalize;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});