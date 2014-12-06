var $ = require('jquery');
var toarray = require('toarray');
var defaults = require('../defaults');

/**
 * Construct options object
 *
 * @param  {String|Array|Object} options
 *
 * @return {Object}
 */
function constructOptions ( options ) {

	var obj = {
		url: ['']
	};

	switch ( $.type(options) ) {
		case 'array':
			obj.url = obj.url.concat(options);
			break;
		case 'string':
			obj.url = toarray(options);
			break;
		case 'object':
			$.extend(obj, options);
			obj.url = toarray(obj.url);
			break;
	}

	// Remove empty items from array if they are not the only ones inside array
	$.each(obj.url, function ( index, item ) {
		if ( item === '' && obj.url.length !== 1 ) {
			obj.url.splice(index, 1);
		}
	});

	return $.extend({}, defaults, obj);

}

module.exports = constructOptions;
