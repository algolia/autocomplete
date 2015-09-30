'use strict';

/* eslint-env mocha, jasmine */

describe('popularIn', function() {
  require('../../src/common/dom.js').element = require('jquery');
  require('../../src/jquery/plugin.js');

  var popularIn = require('../../src/sources/popularIn.js');

  beforeEach(function() {
  });

  it('should query 2 indices and build the combinatory', function() {
    var queries = {
      search: function(q, params, cb) {
        cb(false, {
          hits: [
            { value: 'q1' },
            { value: 'q2' },
            { value: 'q3' }
          ]
        });
      }
    };
    var products = {
      search: function(q, params, cb) {
        cb(false, {
          facets: {
            category: {
              c1: 42,
              c2: 21,
              c3: 2
            }
          }
        })
      }
    };
    var f = popularIn(queries, { hitsPerPage: 3 }, {
      source: 'value',
      index: products,
      facets: 'category',
      maxValuesPerFacet: 3
    });

    var suggestions = [];
    function cb(hits) {
      suggestions = suggestions.concat(hits);
    }
    f('q', cb);
    expect(suggestions.length).toEqual(5);
    expect(suggestions[0].value).toEqual('q1');
    expect(suggestions[0].facet.value).toEqual('c1');
    expect(suggestions[1].value).toEqual('q1');
    expect(suggestions[1].facet.value).toEqual('c2');
    expect(suggestions[2].value).toEqual('q1');
    expect(suggestions[2].facet.value).toEqual('c3');
    expect(suggestions[3].value).toEqual('q2');
    expect(suggestions[3].facet).toBe(undefined);
    expect(suggestions[4].value).toEqual('q3');
    expect(suggestions[4].facet).toBe(undefined);
  });
});
