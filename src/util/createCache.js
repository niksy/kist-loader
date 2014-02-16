/**
 * Cache factory that will abstract out the actual task to be performed when
 * a key isn't in the cache yet.
 *
 * Ref. http://learn.jquery.com/code-organization/deferreds/examples/#generic-asynchronous-cache
 *
 * @param  {Function} requestFunction
 *
 * @return {Promise}
 */
$.createCache = function ( requestFunction ) {
	var cache = {};
	return function ( key, callback ) {
		if ( !cache[ key ] ) {
			cache[ key ] = $.Deferred(function ( defer ) {
				requestFunction( defer, key );
			}).promise();
		}
		return cache[ key ].done( callback );
	};
};
