/**
 * Image loading
 *
 * Ref. http://learn.jquery.com/code-organization/deferreds/examples/#image-loading
 *
 * @param  {Deferr} defer
 * @param  {String} url
 *
 * @return {Deferr}
 */
$.loadImage = $.createCache(function( defer, url ) {
	var image = new Image();
	function cleanUp() {
		image.onload = image.onerror = null;
	}
	defer.then( cleanUp, cleanUp );
	image.onload = function() {
		defer.resolve( url );
	};
	image.onerror = defer.reject;
	image.src = url;
});
