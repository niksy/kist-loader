;(function ( $, window, document, undefined ) {

	var resolver = function ( getScriptCall, arrComponents ) {

		var promise;
		var deferreds = [];
		var deferred = $.Deferred();

		$.each( arrComponents, function(index, value){
			deferreds.push( $[ getScriptCall ](value) );
		});

		$.when
			.apply(window, deferreds)
			.done(function(){
				deferred.resolve( arguments );
			})
			.fail(function(){
				deferred.reject( 'Assets could not be loaded.' );
			});

		promise = deferred.promise();
		return promise;

	};

	$.multiGetScript       = $.proxy( resolver, $, 'getScript' );
	$.multiCachedGetScript = $.proxy( resolver, $, 'cachedGetScript' );

})( jQuery, window, document );
