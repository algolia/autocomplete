'use strict';

/* eslint-env mocha, jasmine */

describe('hits', function () {
  var hitsSource = require('../../src/sources/hits.js');
  var version = require('../../version.js');

  var client = {
    _ua: 'javascript wrong agent',
    search: function search(requests) {
      return window.Promise.resolve({
        results: requests.map(function (request) {
          return {
            index: request.indexName,
            hits: [
              {value: 'Q1-' + request.indexName},
              {value: 'Q2-' + request.indexName},
              {value: 'Q3-' + request.indexName}
            ]
          };
        })
      });
    }
  };

  it('returns results from one index', function () {
    var suggestions = [];

    var f = hitsSource(
      {
        as: client,
        indexName: 'products'
      },
      {hitsPerPage: 3}
    );

    // wait only on one promise, this asserts that our "promise.resolve" trick works
    f('q', function cb1(hits) {
      suggestions = suggestions.concat(hits);
    });

    // force the rest of our test to be more than a microtask behind
    return new Promise(function (res) {
      setTimeout(res, 0);
    }).then(function () {
      expect(suggestions.length).toEqual(3);
      expect(suggestions[0].value).toEqual('Q1-products');
      expect(suggestions[1].value).toEqual('Q2-products');
      expect(suggestions[2].value).toEqual('Q3-products');
    });
  });

  it('returns results from multiple indices', function () {
    var suggestions1 = [];
    var suggestions2 = [];

    var f1 = hitsSource(
      {
        as: client,
        indexName: 'products'
      },
      {hitsPerPage: 3}
    );
    var f2 = hitsSource(
      {
        as: client,
        indexName: 'other'
      },
      {hitsPerPage: 3}
    );

    f1('q', function cb1(hits) {
      suggestions1 = suggestions1.concat(hits);
    });
    f2('q', function cb2(hits) {
      suggestions2 = suggestions2.concat(hits);
    });

    // force the rest of our test to be more than a microtask behind
    return new Promise(function (res) {
      setTimeout(res, 0);
    }).then(function () {
      expect(suggestions1.length).toEqual(3);
      expect(suggestions1[0].value).toEqual('Q1-products');
      expect(suggestions1[1].value).toEqual('Q2-products');
      expect(suggestions1[2].value).toEqual('Q3-products');

      expect(suggestions2.length).toEqual(3);
      expect(suggestions2[0].value).toEqual('Q1-other');
      expect(suggestions2[1].value).toEqual('Q2-other');
      expect(suggestions2[2].value).toEqual('Q3-other');
    });
  });

  it('calls client.search only once', function () {
    var suggestions1 = [];
    var suggestions2 = [];

    var searchSpy = spyOn(client, 'search').and.callThrough();

    var f1 = hitsSource(
      {
        as: client,
        indexName: 'products'
      },
      {hitsPerPage: 3}
    );
    var f2 = hitsSource(
      {
        as: client,
        indexName: 'other'
      },
      {hitsPerPage: 3}
    );

    // wait only on one promise, this asserts that our "promise.resolve" trick works
    f1('q', function cb1(hits) {
      suggestions1 = suggestions1.concat(hits);
    });
    f2('q', function cb2(hits) {
      suggestions2 = suggestions2.concat(hits);
    });

    // force the rest of our test to be more than a microtask behind
    return new Promise(function (res) {
      setTimeout(res, 0);
    }).then(function () {
      expect(searchSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('does not augment the _ua if not JS client v3', function () {
    expect(client._ua).toEqual('javascript wrong agent');

    hitsSource(
      {
        as: client,
        indexName: 'products'
      },
      {hitsPerPage: 3}
    );

    expect(client._ua).toEqual('javascript wrong agent');
  });

  it('augments the _ua once', function () {
    client._ua = 'Algolia for JavaScript (3.35.0)';

    expect(client._ua).toEqual('Algolia for JavaScript (3.35.0)');

    hitsSource(
      {
        as: client,
        indexName: 'products'
      },
      {hitsPerPage: 3}
    );

    expect(client._ua).toEqual(
      'Algolia for JavaScript (3.35.0); autocomplete.js ' + version
    );

    hitsSource(
      {
        as: client,
        indexName: 'something'
      },
      {hitsPerPage: 70}
    );

    expect(client._ua).toEqual(
      'Algolia for JavaScript (3.35.0); autocomplete.js ' + version
    );
  });
});
