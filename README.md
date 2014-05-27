# kist-loader

Simple asset loader.

## Installation

```sh
bower install niksy/kist-loader
```

## API

### `.load(options, [success])`

Returns: `Deferred`

Load assets.

Method will try to guess asset type by its extension. You can prefix any asset URL with `js!`, `css!`, `img!` or `async!` to force specific resource type loading.

#### options

Type: `String|Array|Object`  
*Required*

##### Options defined as `Object`

###### url

Type: `String|Array`  
*Required*

Single or multiple assets to load.

###### cache

Type: `Boolean`  
Default: `true`

Cache assets or request new version every time by appending query string with timestamp.

###### success

Type: `Function`

Callback after everything has been successfully loaded.

###### error

Type: `Function`

Callback if (some) resources haven’t successfully loaded.

#### success

Type: `Function`

Callback after everything has been successfully loaded.

### Aliases

For convenience, aliases for supported asset types are provided. They will always force loading with preferred method (regardless of setting).

#### `.loadScript(options, [success])`

Loads script (JS) assets.

#### `.loadStyle(options, [success])`

Loads style (CSS) assets.

#### `.loadImage(options, [success])`

Loads image assets.

#### `.loadAsync(options, [success])`

Loads assets "async way" (e.g. 3rd party SDKs such as Facebook or Google+ SDK).

## Examples

### JS assets

```js
$.kist.loader
	.load('x.js')
	.done(function ( js ) {
		console.log( 'Asset x.js loaded.' );
	})
	.fail(function ( js ) {
		console.log( 'Asset x.js loading failed.' );
	});

$.kist.loader
	.load(['x.js','y.js'])
	.done(function ( js1, js2 ) {
		console.log( 'Assets x.js and y.js loaded.' );
	})
	.fail(function ( js1, js2 ) {
		console.log( 'Assets x.js and y.js loading failed.' );
	});

$.kist.loader
	.load('x.js', function ( js ) {
		console.log( 'Asset x.js loaded.' );
	});

$.kist.loader
	.load({
		url: 'x.js',
		success: function ( js ) {
			console.log( 'Asset x.js loaded.' );
		},
		error: function ( js ) {
			console.log( 'Asset x.js loading failed.' );
		}
	});
```

### CSS assets

```js
$.kist.loader
	.load('x.css')
	.done(function ( css ) {
		console.log( 'Asset x.css loaded.' );
	})
	.fail(function ( css ) {
		console.log( 'Asset x.css loading failed.' );
	});

$.kist.loader
	.load(['x.css','y.css'])
	.done(function ( css1, css2 ) {
		console.log( 'Assets x.css and y.css loaded.' );
	})
	.fail(function ( css1, css2 ) {
		console.log( 'Assets x.css and y.css loading failed.' );
	});

$.kist.loader
	.load('x.css', function ( css ) {
		console.log( 'Asset x.css loaded.' );
	});

$.kist.loader
	.load({
		url: 'x.css',
		success: function ( css ) {
			console.log( 'Asset x.css loaded.' );
		},
		error: function ( css ) {
			console.log( 'Asset x.css loading failed.' );
		}
	});
```

### Image assets

```js
$.kist.loader
	.load('x.png')
	.done(function ( img ) {
		console.log( 'Asset x.png loaded.' );
	})
	.fail(function ( img ) {
		console.log( 'Asset x.png loading failed.' );
	});

$.kist.loader
	.load(['x.png','y.png'])
	.done(function ( img1, img2 ) {
		console.log( 'Assets x.png and y.png loaded.' );
	})
	.fail(function ( img1, img2 ) {
		console.log( 'Assets x.png and y.png loading failed.' );
	});

$.kist.loader
	.load('x.png', function ( img ) {
		console.log( 'Asset x.png loaded.' );
	});

$.kist.loader
	.load({
		url: 'x.png',
		success: function ( img ) {
			console.log( 'Asset x.png loaded.' );
		},
		error: function ( img ) {
			console.log( 'Asset x.png loading failed.' );
		}
	});
```

### Async (CORS) assets

```js
$.kist.loader
	.load('async!//connect.facebook.net/en_US/all.js#xfbml=1');
```

### Mixed assets

```js
$.kist.loader
	.load(['x.js','y.css'], function ( js, css ) {
		console.log( 'Assets x.js and y.css loaded.' );
	});
```

### Aliases

```js
$.kist.loader
	.loadScript(['z.js'], function ( js ) {
		console.log( 'Asset z.js loaded.' );
	});

$.kist.loader
	.loadStyle(['z.css'], function ( css ) {
		console.log( 'Asset z.css loaded.' );
	});

$.kist.loader
	.loadImage(['z.jpg'], function ( img ) {
		console.log( 'Asset z.jpg loaded.' );
	});

$.kist.loader
	.loadAsync(['//connect.facebook.net/en_US/all.js#xfbml=1']);
```

## Addons

Certain method are not provided by default and they should be included as addons.

* [Google Maps loader](docs/addons.md#google-maps-loader)
* [Aliases](docs/addons.md#aliases)

## Browser support

Tested in IE8+ and all modern browsers.

## Acknowledgments
  
* [jQuery documentation on Deferreds](http://learn.jquery.com/code-organization/deferreds/examples/#generic-asynchronous-cache)
* [Async load](https://gist.github.com/necolas/1025811)
* [Applying CSS in IE](http://stackoverflow.com/questions/805384/how-to-apply-inline-and-or-external-css-loaded-dynamically-with-jquery)

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
