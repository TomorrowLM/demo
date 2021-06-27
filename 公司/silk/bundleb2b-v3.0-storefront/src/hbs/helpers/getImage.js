'use strict';

const utils = require('handlebars-utils');
const SafeString = require('handlebars').SafeString;
const common = require('../lib/common.js');

export default function(image, presetName, defaultImageUrl) {
  var size = 'original';
  var width;
  var height;

  if (!utils.isObject(image) || !utils.isString(image.data)
      || !common.isValidURL(image.data) || image.data.indexOf('{:size}') === -1) {
      // return empty string if not a valid image object
      defaultImageUrl = defaultImageUrl ? defaultImageUrl : '';
      return utils.isString(image) ? image : defaultImageUrl;
  }

  if (Number.isInteger(image.width) && Number.isInteger(image.height)
      && Number.isInteger(width) && Number.isInteger(height)) {
      size = `${Math.min(image.width, width)}x${Math.min(image.height, height)}`
  }

  return new SafeString(image.data.replace('{:size}', size));
}
