/**
 * Generic asynchronous cache
 * Ref. http://learn.jquery.com/code-organization/deferreds/examples/#generic-asynchronous-cache
 *
 * @param  {Promise} defer
 * @param  {String} url
 *
 * @return {Deferr}
 */
$.cachedGetScript = $.createCache(function ( defer, url ) {
	$.getScript( url ).then( defer.resolve, defer.reject );
});
