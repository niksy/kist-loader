// JS assets
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

// CSS assets
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

// Image assets
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

// Text assets
$.kist.loader
    .load('x.txt')
    .done(function ( txt ) {
        console.log( 'Asset x.txt loaded.' );
    })
    .fail(function ( txt ) {
        console.log( 'Asset x.txt loading failed.' );
    });

$.kist.loader
    .load(['x.txt','y.txt'])
    .done(function ( txt1, txt2 ) {
        console.log( 'Assets x.txt and y.txt loaded.' );
    })
    .fail(function ( txt1, txt2 ) {
        console.log( 'Assets x.txt and y.txt loading failed.' );
    });

$.kist.loader
    .load('x.txt', function ( txt ) {
        console.log( 'Asset x.txt loaded.' );
    });

$.kist.loader
    .load({
        url: 'x.txt',
        success: function ( txt ) {
            console.log( 'Asset x.txt loaded.' );
        },
        error: function ( txt ) {
            console.log( 'Asset x.txt loading failed.' );
        }
    });

// Async (CORS) assets
$.kist.loader
    .load('async!//connect.facebook.net/en_US/all.js#xfbml=1');

// Mixed assets
$.kist.loader
    .load(['x.js','y.css'], function ( js, css ) {
        console.log( 'Assets x.js and y.css loaded.' );
    });

// Aliases
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
    .loadText(['z.txt'], function ( txt ) {
        console.log( 'Asset z.txt loaded.' );
    });

$.kist.loader
    .loadAsync(['//connect.facebook.net/en_US/all.js#xfbml=1']);
