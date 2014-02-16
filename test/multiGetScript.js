var deps = [ "http://documentcloud.github.com/backbone/backbone-min.js",
             "http://documentcloud.github.com/underscore/underscore-min.js" ];


$.multiGetScript( deps, function( jqXhr ) {
	console.log( jqXhr );
	console.log( [ _, Backbone ] );
});
