![Deprecated project](https://img.shields.io/badge/status-deprecated-red.svg)

**This project is deprecated.**

Use separate packages for specific purpose:

* [load-script-p](https://github.com/niksy/load-script-p)
* [load-style-p](https://github.com/niksy/load-style-p)
* [image-promise](https://github.com/bfred-it/image-promise)

---

# kist-loader

Simple asset loader.

## Installation

```sh
npm install kist-loader --save

bower install niksy/kist-loader --save
```

## API

### `.load(options, [success])`

Returns: `Promise`

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

#### `.loadText(options, [success])`

Loads text assets.

#### `.loadAsync(options, [success])`

Loads assets "async way" (e.g. 3rd party SDKs such as Facebook or Google+ SDK).

## Examples

### JS assets

```js
var loader = require('kist-loader');

loader
	.load('x.js')
	.done(function ( js ) {
		console.log( 'Asset x.js loaded.' );
	})
	.fail(function ( js ) {
		console.log( 'Asset x.js loading failed.' );
	});

loader
	.load(['x.js','y.js'])
	.done(function ( js1, js2 ) {
		console.log( 'Assets x.js and y.js loaded.' );
	})
	.fail(function ( js1, js2 ) {
		console.log( 'Assets x.js and y.js loading failed.' );
	});

loader
	.load('x.js', function ( js ) {
		console.log( 'Asset x.js loaded.' );
	});

loader
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
var loader = require('kist-loader');

loader
	.load('x.css')
	.done(function ( css ) {
		console.log( 'Asset x.css loaded.' );
	})
	.fail(function ( css ) {
		console.log( 'Asset x.css loading failed.' );
	});

loader
	.load(['x.css','y.css'])
	.done(function ( css1, css2 ) {
		console.log( 'Assets x.css and y.css loaded.' );
	})
	.fail(function ( css1, css2 ) {
		console.log( 'Assets x.css and y.css loading failed.' );
	});

loader
	.load('x.css', function ( css ) {
		console.log( 'Asset x.css loaded.' );
	});

loader
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
var loader = require('kist-loader');

loader
	.load('x.png')
	.done(function ( img ) {
		console.log( 'Asset x.png loaded.' );
	})
	.fail(function ( img ) {
		console.log( 'Asset x.png loading failed.' );
	});

loader
	.load(['x.png','y.png'])
	.done(function ( img1, img2 ) {
		console.log( 'Assets x.png and y.png loaded.' );
	})
	.fail(function ( img1, img2 ) {
		console.log( 'Assets x.png and y.png loading failed.' );
	});

loader
	.load('x.png', function ( img ) {
		console.log( 'Asset x.png loaded.' );
	});

loader
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

### Text assets

```js
var loader = require('kist-loader');

loader
	.load('x.txt')
	.done(function ( txt ) {
		console.log( 'Asset x.txt loaded.' );
	})
	.fail(function ( txt ) {
		console.log( 'Asset x.txt loading failed.' );
	});

loader
	.load(['x.txt','y.txt'])
	.done(function ( txt1, txt2 ) {
		console.log( 'Assets x.txt and y.txt loaded.' );
	})
	.fail(function ( txt1, txt2 ) {
		console.log( 'Assets x.txt and y.txt loading failed.' );
	});

loader
	.load('x.txt', function ( txt ) {
		console.log( 'Asset x.txt loaded.' );
	});

loader
	.load({
		url: 'x.txt',
		success: function ( txt ) {
			console.log( 'Asset x.txt loaded.' );
		},
		error: function ( txt ) {
			console.log( 'Asset x.txt loading failed.' );
		}
	});
```

### Async (CORS) assets

```js
var loader = require('kist-loader');

loader
	.load('async!//connect.facebook.net/en_US/all.js#xfbml=1');
```

### Mixed assets

```js
var loader = require('kist-loader');

loader
	.load(['x.js','y.css'], function ( js, css ) {
		console.log( 'Assets x.js and y.css loaded.' );
	});
```

### Aliases

```js
var loader = require('kist-loader');

loader
	.loadScript(['z.js'], function ( js ) {
		console.log( 'Asset z.js loaded.' );
	});

loader
	.loadStyle(['z.css'], function ( css ) {
		console.log( 'Asset z.css loaded.' );
	});

loader
	.loadImage(['z.jpg'], function ( img ) {
		console.log( 'Asset z.jpg loaded.' );
	});

loader
	.loadText(['z.txt'], function ( txt ) {
		console.log( 'Asset z.txt loaded.' );
	});

loader
	.loadAsync(['//connect.facebook.net/en_US/all.js#xfbml=1']);
```

### AMD and global

```js
define(['kist-loader'], cb);

window.$.kist.loader;
```

## Plugins

Certain method are not provided by default and they should be included as plugins.

* [Google Maps loader](https://github.com/niksy/kist-loader-maps)

## Browser support

Tested in IE8+ and all modern browsers.

## Acknowledgments
  
* [jQuery documentation on Deferreds](http://learn.jquery.com/code-organization/deferreds/examples/#generic-asynchronous-cache)
* [Async load](https://gist.github.com/necolas/1025811)
* [Applying CSS in IE](http://stackoverflow.com/questions/805384/how-to-apply-inline-and-or-external-css-loaded-dynamically-with-jquery)

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
