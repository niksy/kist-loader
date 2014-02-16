/* asyncLoad */
/* jshint maxparams:5, expr:true */
;(function ( $, window, document, undefined ) {

	var js;
	var script = 'script';
	var fjs    = document.getElementsByTagName(script)[0];

	$.asyncLoad = function ( url, id ) {
		if ( typeof(id) === 'undefined' ) {
			if ( /connect\.facebook/.test(url) ) {
				id = 'facebook-jssdk';
			} else if ( /platform\.twitter/.test(url) ) {
				id = 'twitter-wjs';
			} else if ( /apis\.google/.test(url) ) {
				id = 'gplus-sdk';
			}
		}
		if (document.getElementById(id)) {
			return;
		}
		js = document.createElement(script);
		js.src = url;
		id && (js.id = id);
		fjs.parentNode.insertBefore(js, fjs);
	};

})( jQuery, window, document );
