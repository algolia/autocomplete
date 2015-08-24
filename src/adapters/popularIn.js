'use strict';

var _ = require('../common/utils.js');
var cloneDeep = require('lodash-compat/lang/cloneDeep');

module.exports = function popularIn(index, params, details) {
  if (!details.source) {
    _.error("Missing 'source' key");
    return;
  }
  var source = _.isFunction(details.source) ? details.source : function(hit) { return hit[details.source]; };
  delete details.source;

  if (!details.index) {
    _.error("Missing 'index' key");
    return;
  }
  var detailsIndex = details.index;
  delete details.index;

  return function(query, cb) {
    index.search(query, params, function(error, content) {
      if (error) {
        _.error(error.message);
        cb([]);
        return;
      }

      if (content.hits.length > 0) {
        var first = content.hits[0];

        detailsIndex.search(source(first), _.mixin({ hitsPerPage: 0 }, details), function(error, content2) {
          if (error) {
            _.error(error.message);
            cb([]);
            return;
          }

          var suggestions = [];

          // enrich the first hit iterating over the facets
          for (var facet in content2.facets) {
            for (var value in content2.facets[facet]) {
              suggestions.push(_.mixin({ facet: { facet: facet, value: value, count: content2.facets[facet].count } }, cloneDeep(first)));
            }
          }

          // append all other hits
          for (var i = 1; i < content.hits.length; ++i) {
            suggestions.push(content.hits[i]);
          }

          cb(suggestions);
        });

        return;
      }

      cb([]);
    });
  };
};
