# kist-loader

Simple asset loader.

## Installation

```sh
bower install niksy/kist-loader
```

## API

### `load(options, [success])`

Returns: `Deferred`

#### options

Type: `String`, `Array`, `Object`  
*Required*

Single or multiple assets to load.

* `String` - Single asset
* `Array` - Single or multiple assets
* `Object` - Assets are provided in `url` property

It will try to guess filetype by its extension. You can prepend any asset URL with strings `js!`, `css!`, `img!` or `async!` to force specific resource type loading.

#### success

Type: `Function`

Callback after everything has been successfully loaded. For error callback use `fail` method on returned `Deferred` object.

##### options as object

###### url

Type: `String`, `Array`  
*Required*

Single or multiple assets to load.

###### cache

Type: `Boolean`  
Default: `true`

Wether to cache assets or request new version every time by appending query string with timestamp.

### Aliases

For convenience, aliases for supported asset types are provided. They will always force loading with preferred method (regardless of setting).

#### `loadScript(options, [success])`

Loads single or multiple JS assets.

#### `loadStyle(options, [success])`

Loads single or multiple CSS assets.

#### `loadImage(options, [success])`

Loads single or multiple image assets.

#### `loadAsync(options, [success])`

Loads single or multiple assets "async way", e.g. for including 3rd party SDKs such as Facebook or Google+ SDK.

### Plugins

Certain method are not provided by default and they should be included as plugins.

#### `loadGmaps(options, [success])`

##### options

Type: `Object`  
*Required*

* `apiKey` - Your project’s API key
* `plugins` - Google Maps plugins
* `language` - Language for Google Maps UI
* `libraries` - Google Maps libraries

#### Examples

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
	.loadScript(['z.js'], function ( js ) {
		console.log( 'Asset z.js' );
	});

$.kist.loader
	.loadStyle(['z.css'], function ( css ) {
		console.log( 'Asset z.css' );
	});

$.kist.loader
	.loadImage(['z.jpg'], function ( img ) {
		console.log( 'Asset z.jpg' );
	});
```

## Browser support

Tested in IE8+ and all modern browsers.

## Acknowledgments
  
* [jQuery documentation on Deferreds](http://learn.jquery.com/code-organization/deferreds/examples/#generic-asynchronous-cache)
* [Google Maps loader starting code](https://gist.github.com/GFoley83/5953448)
* [Async load](https://gist.github.com/necolas/1025811)
* [Applying CSS in IE](http://stackoverflow.com/questions/805384/how-to-apply-inline-and-or-external-css-loaded-dynamically-with-jquery)

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
