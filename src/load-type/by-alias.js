var $ = require('jquery');
var constructOptions = require('../util/construct-options');
var setAssetType = require('../asset').setType;
var load = require('./generic');

/**
 * @param  {String} type
 *
 * @return {Function}
 */
function aliasResolve ( type ) {

	/**
	 * @return {Promise}
	 */
	return function () {

		var options = [].slice.call(arguments);

		options[0] = constructOptions(options[0]);

		$.each(options[0].url, function ( index, url ) {
			options[0].url[index] = setAssetType(type, url);
		});

		return load.apply(null, options);

	};

}

module.exports = aliasResolve;
