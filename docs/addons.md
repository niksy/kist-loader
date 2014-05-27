## Google Maps loader

Convenient Google Maps loader, with some [starting code](https://gist.github.com/GFoley83/5953448) applied.

### API

#### `.loadGmaps(options, [success])`

##### options

Type: `Object`  
*Required*

###### `apiKey`

Type: `String`

Your project’s API key

###### `plugins`

Type: `String|Array`

Google Maps plugins such as Infobox.

###### `language`

Type: `String`

Language for Google Maps UI.

###### `libraries`

Type: `String`

Google Maps libraries such as Geometry

###### success

Type: `Function`

Callback after everything has been successfully loaded.

###### error

Type: `Function`

Callback if (some) resources haven’t successfully loaded.

##### success

Type: `Function`

Callback after everything has been successfully loaded.

### Examples

```js
$.kist.loader
	.loadGmaps({
		apiKey: 'YOUR_API_KEY',
		plugins: [ 'infobox.js', 'maplabel.js' ],
		language: 'en',
		libraries: 'geometry'
	})
	.done(function () {
		console.log( 'Google Maps loaded!' );
	});
```

## Aliases

Convenient aliases.

#### `$.cachedGetScript(options)`

Type: `String|Array`

Loads script (JS) assets, caching them in the process.

#### `$.multiGetScript(options)`

Type: `String|Array`

Loads script (JS) assets.

#### `$.multiCachedGetScript(options)`

Type: `String|Array`

Loads script (JS) assets, caching them in the process.

#### `$.loadImage(options)`

Type: `String|Array`

Loads image assets, caching them in the process.

#### `$.asyncLoad(options)`

Type: `String|Array`

Loads image assets.

## Examples

```js
$.cachedGetScript('x.js')
	.done(function ( js ) {
		console.log( 'Asset x.js loaded.' );
	});

$.multiGetScript(['x.js','y.js'])
	.done(function ( js ) {
		console.log( 'Assets x.js and y.js loaded.' );
	});

$.multiCachedGetScript(['x.js','y.js'])
	.done(function ( js ) {
		console.log( 'Assets x.js and y.js loaded.' );
	});

$.multiCachedGetScript('x.jpg')
	.done(function ( js ) {
		console.log( 'Asset x.jpg loaded.' );
	});

$.asyncLoad('//connect.facebook.net/en_US/all.js#xfbml=1');
```
