$.cachedGetScript = $.multiGetScript = $.multiCachedGetScript = $.proxy( $.kist.loader.loadJS, $.kist.loader );
$.loadImage       = $.proxy( $.kist.loader.loadImage, $.kist.loader );
$.asyncLoad       = $.proxy( $.kist.loader.loadAsync, $.kist.loader );
$.gmapsLoader     = $.proxy( $.kist.loader.loadGmaps, $.kist.loader );
