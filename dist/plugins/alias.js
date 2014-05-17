/* kist-loader 0.2.0 - Simple asset loader. | Author: Ivan Nikolić, 2014 | License: MIT */
$.cachedGetScript = $.multiGetScript = $.multiCachedGetScript = $.proxy( $.kist.loader.loadJS, $.kist.loader );
$.loadImage       = $.proxy( $.kist.loader.loadImage, $.kist.loader );
$.asyncLoad       = $.proxy( $.kist.loader.loadAsync, $.kist.loader );
$.gmapsLoader     = $.proxy( $.kist.loader.loadGmaps, $.kist.loader );
