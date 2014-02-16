# Kist Loaders

Loader utilities for client-side JavaScript. Based on jQuery.

## Usage

```javascript
$.cachedGetScript('file.js').done(function ( data ) {
	console.info( 'Loaded!' );
});

$.loadImage('unicorn.jpg').done(function () {
	console.info( 'Loaded!' );
});

$.gmapsLoader({
	apiKey: 'API KEY',
	plugins: [ 'gmaps-plugin1.js', 'gmaps-plugin2.js' ],
	language: 'en',
	libraries: 'geometry'
})
.done(function () {
	console.info( 'Loaded!' );
});

$.multiGetScript( [ 'dep1.js', 'dep2.js' ] ).done(function ( data ) {
	console.info( 'Loaded!' );
});

$.multiCachedGetScript( [ 'dep1.js', 'dep2.js' ] ).done(function ( data ) {
	console.info( 'Loaded!' );
});
```

## Description

#### `$.cachedGetScript`

Similar to `$.getScript`, but caches request so it won’t fire again for
current session.

#### `$.loadImage`

Generic image (pre)loading using `$.Deferred()`.

#### `$.gmapsLoader`

Loads Google Maps API with predefined options and returns `$.Deferred()` after
everything is done.

#### `$.multiGetScript`

Extends `$.getScript` with ability to provide array of assets to load.

#### `$.multiCachedGetScript`

Similar to `$.multiGetScript`, but caches requests so it won’t fire again for
current session.

## Acknowledgments

* [jQuery documentation on Deferreds](http://learn.jquery.com/code-organization/deferreds/examples/#generic-asynchronous-cache)
* [Google Maps loader starting code](https://gist.github.com/GFoley83/5953448)
