;(function ( $, window, document, undefined ) {

	var getScript = $.getScript;

	$.multiGetScript = function ( resources, callback ) {

		var length = resources.length;
		var handler = function() { counter++; };
		var deferreds = [];
		var counter = 0;
		var idx = 0;

		for ( ; idx < length; idx++ ) {
			deferreds.push(
				getScript( resources[ idx ], handler )
			);
		}

		$.when.apply( null, deferreds ).then(function() {
			if ( callback ) {
				callback();
			}
		});
	};

})( jQuery, window, document );
