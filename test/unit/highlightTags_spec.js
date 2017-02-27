'use strict';

/* eslint-env mocha, jasmine */

var highlightTags = require('../../src/common/highlightTags.js');

describe('highlightTags', function() {
  it('should return valid pre and post values', function() {
    expect(highlightTags.pre).toMatch(/^\$\$--H-[0-9a-f]+--\$\$$/);
    expect(highlightTags.post).toMatch(/^\$\$\/--H-[0-9a-f]+--\$\$$/);
  });

  it('should return valid regexps', function() {
    var test = highlightTags.pre + 'VALUE1' + highlightTags.post + 'OTHER CONTENT' +
      highlightTags.pre + 'VALUE2' + highlightTags.post + 'OTHER CONTENT$';

    var actual = test
      .replace(highlightTags.regexps.pre, '<em>')
      .replace(highlightTags.regexps.post, '</em>');

    expect(actual).toEqual('<em>VALUE1</em>OTHER CONTENT<em>VALUE2</em>OTHER CONTENT$');
  });
});
