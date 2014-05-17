# kist-loader

Simple asset loader.

## Installation

```sh
bower install niksy/kist-loader
```

## API

### `load(<string|array>, [success], [error])`

Type: `String`, `Array`
Returns: `Deferred`

Loads single or multiple assets, depending on provided argument. It will try to guess filetype by its extension.

You can prepend any asset URL with strings like `js`, `css`, `img` or `async` to force specific resource type loading.

### `loadJS(<string|array>, [success], [error])`

Type: `String`, `Array`
Returns: `Deferred`

Loads single or multiple JS assets.

### `loadCSS(<string|array>, [success], [error])`

Type: `String`, `Array`
Returns: `Deferred`

Loads single or multiple CSS assets.

### `loadImage(<string|array>, [success], [error])`

Type: `String`, `Array`
Returns: `Deferred`

Loads single or multiple image assets.

### `loadAsync(<string|array>, [success], [error])`

Type: `String`, `Array`
Returns: `Deferred`

Loads single or multiple assets "async way", e.g. for including 3rd party SDKs such as Facebook or Google+ SDK.

### `loadGmaps(<object>, [success], [error])`

Type: `Object`
Returns: `Deferred`

Loads Google Maps SDK. Available options are:

* `apiKey` - Your project’s API key
* `plugins` - Google Maps plugins
* `language` - Language for Google Maps UI
* `libraries` - Google Maps libraries

Support for Google Maps loading is not included by default. You must include provided plugin for this.

##### Examples

Detailed examples can be found in `test` directory.

```js
// JS assets
$.kist.loader
	.load('x.js')
	.done(function ( js ) {
		console.log( 'Asset x.js loaded.' );
	});

$.kist.loader
	.load(['x.js','y.js'])
	.done(function ( js1, js2 ) {
		console.log( 'Assets x.js and y.js loaded.' );
	});

$.kist.loader
	.load('x.js', function ( js ) {
		console.log( 'Asset x.js loaded.' );
	});

// CSS assets
$.kist.loader
	.load('x.css')
	.done(function ( css ) {
		console.log( 'Asset x.css loaded.' );
	});

$.kist.loader
	.load(['x.css','y.css'])
	.done(function ( css1, css2 ) {
		console.log( 'Assets x.css and y.css loaded.' );
	});

$.kist.loader
	.load('x.css', function ( css ) {
		console.log( 'Asset x.css loaded.' );
	});

// Image assets
$.kist.loader
	.load('x.jpg')
	.done(function ( img ) {
		console.log( 'Asset x.jpg loaded.' );
	});

$.kist.loader
	.load(['x.jpg','y.jpg'])
	.done(function ( img1, img2 ) {
		console.log( 'Assets x.jpg and y.jpg loaded.' );
	});

$.kist.loader
	.load('x.jpg', function ( img ) {
		console.log( 'Asset x.jpg loaded.' );
	});

// Mixed assets
$.kist.loader
	.load(['x.js','y.css'], function ( js, css ) {
		console.log( 'Assets x.js and y.css loaded.' );
	});

// Aliases
$.kist.loader
	.loadJS(['z.js'], function ( js ) {
		console.log( 'Asset z.js' );
	});

$.kist.loader
	.loadCSS(['z.css'], function ( css ) {
		console.log( 'Asset z.css' );
	});

$.kist.loader
	.loadImage(['z.jpg'], function ( img ) {
		console.log( 'Asset z.jpg' );
	});
```

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
