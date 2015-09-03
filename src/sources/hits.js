'use strict';

var _ = require('../common/utils.js');
var cloneDeep = require('lodash-compat/lang/cloneDeep');

module.exports = function search(index, params) {
  return sourceFn;

  function sourceFn(query, cb) {
    index.search(query, params, function(error, content) {
      if (error) {
        _.error(error.message);
        return;
      }
      cb(content.hits);
    });
  }
};
