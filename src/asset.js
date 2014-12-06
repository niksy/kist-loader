var regex = {
	extension: /\.(\w+)(?:\?.+)?$/i,
	explicitType: /^(\w+?)!/i,
	images: /jpe?g|png|gif|webp/i
};

/**
 * Clean asset URL from prefixes which force asset type
 *
 * @param  {String} url
 *
 * @return {String}
 */
function cleanUrl ( url ) {
	return url.replace(regex.explicitType, '');
}

/**
 * Get asset type by URL
 *
 * @param  {String} url
 *
 * @return {String}
 */
function getType ( url ) {

	var type = 'js';

	if ( url.match(regex.explicitType) ) {
		type = url.match(regex.explicitType)[1];
	} else if ( url.match(regex.extension) ) {
		type = url.match(regex.extension)[1];
		if ( regex.images.test(type) ) {
			type = 'img';
		}
	} else if ( url === '' ) {
		type = '';
	}

	return type;

}

/**
 * Force asset type for URL
 *
 * @param {String} type
 * @param {String} url
 *
 * @return {String}
 */
function setType ( type, url ) {
	return type + '!' + cleanUrl(url);
}

module.exports = {
	setType: setType,
	getType: getType,
	cleanUrl: cleanUrl
};
