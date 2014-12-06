var $ = require('jquery');

/**
 * Normalize single asset result to array element to keep it consistent
 * with passed arguments from multiple asset results
 *
 * @param  {Array} args
 *
 * @return {Array}
 */
function argsNormalize ( args ) {

	var arr = [];
	args = [].slice.call(args);

	/**
	 * If first result is not array, we push every result from
	 * passed arguments as new array element.
	 */
	if ( $.type(args[0]) !== 'array' ) {

		// If first result is undefined, we transform it to empty string
		if ( $.type(args[0]) === 'undefined' ) {
			args[0] = '';
		} else {
			arr.push(args);
		}

	} else {
		arr = args;
	}

	return arr;

}

module.exports = argsNormalize;
