;(function ( $, loader, undefined ) {

	$.cachedGetScript = $.multiCachedGetScript = $.proxy( loader.loadScript, loader );
	$.loadImage       = $.proxy( loader.loadImage, loader );
	$.asyncLoad       = $.proxy( loader.loadAsync, loader );
	$.gmapsLoader     = $.proxy( loader.loadGmaps, loader );
	$.multiGetScript  = function ( url ) {
		return loader.loadScript({
			url: url,
			cache: false
		});
	};

})( jQuery, $.kist.loader );
