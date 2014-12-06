var $ = require('jquery');
var getAssetType = require('../asset').getType;
var cleanAssetUrl = require('../asset').cleanUrl;
var loadAjaxAsset = require('./ajax');
var loadStyleAsset = require('./style');
var loadImageAsset = require('./image');
var loadAsyncAsset = require('./async');

/**
 * Load asset based on URL
 *
 * @param  {String} url
 * @param  {Object} options
 *
 * @return {Promise}
 */
function loadAsset ( url, options ) {

	var type = getAssetType(url);
	url = cleanAssetUrl(url);

	switch ( type ) {
		case 'js':
			return loadAjaxAsset(url, $.extend({}, { dataType: 'script' }, options));
		case 'css':
			return loadStyleAsset(url, options);
		case 'img':
			return loadImageAsset(url, options);
		case 'txt':
		case 'text':
		case 'template':
			return loadAjaxAsset(url, $.extend({}, { dataType: 'text' }, options));
		case 'async':
			return loadAsyncAsset(url);
	}

}

module.exports = loadAsset;
