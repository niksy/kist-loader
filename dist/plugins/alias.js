/* kist-loader 0.3.0 - Simple asset loader. | Author: Ivan Nikolić, 2014 | License: MIT */
$.cachedGetScript = $.multiCachedGetScript = $.proxy( $.kist.loader.loadScript, $.kist.loader );
$.loadImage       = $.proxy( $.kist.loader.loadImage, $.kist.loader );
$.asyncLoad       = $.proxy( $.kist.loader.loadAsync, $.kist.loader );
$.gmapsLoader     = $.proxy( $.kist.loader.loadGmaps, $.kist.loader );
$.multiGetScript  = function ( url ) {
	return $.kist.loader.loadScript({
		url: url,
		cache: false
	});
};
