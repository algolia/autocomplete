'use strict';

var _ = require('../common/utils.js');
var version = require('../../version.js');
var parseAlgoliaClientVersion = require('../common/parseAlgoliaClientVersion.js');

var highlightTags = require('../common/highlightTags.js');

module.exports = function search(index, params) {
  var enableXSSProtection = false;
  var originalHighlightTags = {
    pre: params.highlightPreTag || '<em>',
    post: params.highlightPostTag || '</em>'
  };

  if (params.enableXSSProtection === true) {
    enableXSSProtection = true;

    if (!_.isObject(params)) {
      params = {};
    }

    delete params.enableXSSProtection;

    params.highlightPreTag = highlightTags.pre;
    params.highlightPostTag = highlightTags.post;
  }
  
  var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
  if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
    params.additionalUA = 'autocomplete.js ' + version;
  }

  function sourceFn(query, cb) {
    index.search(query, params, function(error, content) {
      if (error) {
        _.error(error.message);
        return;
      }
      cb(content.hits, content);
    });
  }

  sourceFn.enableXSSProtection = enableXSSProtection;
  sourceFn.originalHighlightTags = originalHighlightTags;

  return sourceFn;
};
