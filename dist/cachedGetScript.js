/* cachedGetScript */
$.cachedGetScript = $.createCache(function ( defer, url ) {
	$.getScript( url ).then( defer.resolve, defer.reject );
});
