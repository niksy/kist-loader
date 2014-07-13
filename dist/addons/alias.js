;(function ( $, loader, undefined ) {

	$.cachedGetScript = $.multiCachedGetScript = loader.loadScript;
	$.loadImage       = loader.loadImage;
	$.asyncLoad       = loader.loadAsync;
	$.gmapsLoader     = loader.loadGmaps;
	$.multiGetScript  = function ( url ) {
		return loader.loadScript({
			url: url,
			cache: false
		});
	};

})( jQuery, $.kist.loader );
