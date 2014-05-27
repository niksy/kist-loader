;(function ( $, window, loader, undefined ) {

	var now = $.now();
	var firstDfd;
	var secondDfd;

	/**
	 * Google Maps loader
	 *
	 * Ref. https://gist.github.com/GFoley83/5953448
	 *
	 * @param  {Number} version
	 * @param  {String} apiKey
	 * @param  {String} language
	 * @param  {Array} libraries
	 * @param  {String} sensor
	 *
	 * @return {Promise}
	 */
	/* jshint maxparams:false */
	function loadGoogleMaps ( version, apiKey, language, libraries, sensor ) {

		if (firstDfd) {
			return firstDfd.promise();
		}

		// Create a Deferred Object
		firstDfd = $.Deferred();

		// Global callback name
		var callbackName = 'loadGoogleMaps_' + (now++);

		// Default Parameters
		var params = {
			'sensor': sensor || 'false',
			'key': apiKey,
			'language': language,
			'libraries': libraries
		};

		// Declare a resolve function, pass google.maps for the done functions
		function resolve () {
			firstDfd.resolve(window.google && window.google.maps ? window.google.maps : false);
		}

		// If google.maps exists, then Google Maps API was probably loaded with the <script> tag
		if (window.google && window.google.maps) {
			resolve();

		// If the google.load method exists, lets load the Google Maps API in Async.
		} else if (window.google && window.google.load) {
			window.google.load('maps', version || 3, {
				'other_params': $.param(params),
				'callback': resolve
			});

		// Last, try pure jQuery AJAX technique to load the Google Maps API in Async.
		} else {

			// AJAX URL params
			params = $.extend(params, {
				'callback': callbackName
			});

			// Declare the global callback
			window[callbackName] = function () {
				resolve();

				// Delete callback
				setTimeout(function () {
					try {
						delete window[callbackName];
					} catch (e) {}
				}, 20);
			};

			// Can't use the jXHR promise because 'script' doesn't support 'callback=?'
			$.ajax({
				dataType: 'script',
				data: params,
				url: '//maps.googleapis.com/maps/api/js'
			});

		}

		return firstDfd.promise();

	}

	$.extend(loader, {

		loadGmaps: function ( options, cb ) {

			if (secondDfd) {
				return secondDfd.promise();
			}

			secondDfd = $.Deferred();
			options = options || {};

			function successCb () {
				secondDfd.resolve.apply( window, arguments );
				if ( cb ) {
					cb.apply(window, arguments);
				}
				if ( options.success ) {
					options.success.apply( window, arguments );
				}
			}

			function errorCb () {
				secondDfd.reject.apply( window, arguments );
				if ( options.error ) {
					options.error.apply( window, arguments );
				}
			}

			loadGoogleMaps( options.mapsVersion, options.apiKey, options.language, options.libraries, options.sensor )
				.done(function () {
					var args = Array.prototype.slice.call(arguments);
					if ( options.plugins ) {
						loader
							.load(options.plugins)
							.done(function () {
								args.push(Array.prototype.slice.call(arguments));
								successCb.apply(window, args);
							})
							.fail(errorCb);
					} else {
						successCb.apply(window, args);
					}
				})
				.fail(errorCb);

			return secondDfd.promise();

		}

	});

})( jQuery, window, $.kist.loader );
