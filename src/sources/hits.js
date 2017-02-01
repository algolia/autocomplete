'use strict';

var _ = require('../common/utils.js');
var version = require('../../version.js');

module.exports = function search(index, params) {
  params.additionalUA = 'autocomplete.js ' + version;
  return sourceFn;

  function sourceFn(query, cb) {
    index.search(query, params, function(error, content) {
      if (error) {
        _.error(error.message);
        return;
      }
      cb(content.hits, content);
    });
  }
};
