'use strict';

/* eslint-env mocha, jasmine */

describe('parseAlgoliaClientVersion', function() {
  var parseAlgoliaClientVersion = require('../../src/common/parseAlgoliaClientVersion.js');

  it('should return undefined for unknown user agents', function() {
    expect(parseAlgoliaClientVersion('random user agent 1.2.3')).toEqual(
      undefined
    );
  });

  it('should parse user agents with algoliasearch < 3.33.0 format', function() {
    expect(
      parseAlgoliaClientVersion('Algolia for vanilla JavaScript 3.1.0')
    ).toEqual(['3.', '1.', '0']);
  });

  it('should parse user agents with algoliasearch >= 3.33.0 format', function() {
    expect(parseAlgoliaClientVersion('Algolia for JavaScript (3.5.0)')).toEqual([
      '3.',
      '5.',
      '0'
    ]);
  });
});
