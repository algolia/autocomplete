'use strict';

var _ = require('../common/utils.js');

module.exports = function popularIn(index, params, details, options) {
  if (!details.source) {
    return _.error("Missing 'source' key");
  }
  var source = _.isFunction(details.source) ? details.source : function (attribute) { return function(hit) { return hit[attribute]; } }(details.source);
    
  delete details.source;

  if (!details.index) {
    return _.error("Missing 'index' key");
  }
  var detailsIndex = details.index;
  delete details.index;

  options = options || {};

  return sourceFn;

  function sourceFn(query, cb) {
    index.search(query, params, function(error, content) {
      if (error) {
        _.error(error.message);
        return;
      }

      if (content.hits.length > 0) {
        var first = content.hits[0];

        detailsIndex.search(source(first), _.mixin({hitsPerPage: 0}, details), function(error2, content2) {
          if (error2) {
            _.error(error2.message);
            return;
          }

          var suggestions = [];

          // add the 'all department' entry before others
          if (options.includeAll) {
            var label = options.allTitle || 'All departments';
            suggestions.push(_.mixin({
              facet: {value: label, count: content2.nbHits}
            }, _.cloneDeep(first)));
          }

          // enrich the first hit iterating over the facets
          _.each(content2.facets, function(values, facet) {
            _.each(values, function(count, value) {
              suggestions.push(_.mixin({
                facet: {facet: facet, value: value, count: count}
              }, _.cloneDeep(first)));
            });
          });

          // append all other hits
          for (var i = 1; i < content.hits.length; ++i) {
            suggestions.push(content.hits[i]);
          }

          cb(suggestions, content);
        });

        return;
      }

      cb([]);
    });
  }
};
