'use strict';

/* eslint-env mocha, jasmine */

var _ = require('../../src/common/utils.js');

describe('escapeHTML', function() {
  it('should escape HTML but preserve the default tags', function() {
    var test = '<em><img src=VALUE1 onerror=alert(1) /></em>' +
    'OTHER CONTENT<em>VALUE2</em>OTHER CONTENT$';
    var actual = _.escapeHighlightedString(test);
    expect(actual).toEqual('<em>&lt;img src=VALUE1 onerror=alert(1) /&gt;</em>OTHER CONTENT<em>VALUE2</em>OTHER CONTENT$');
  });

  it('should escape HTML but preserve the default tags when using custom tags', function() {
    var test = '<span class="highlighted"><img src=VALUE1 onerror=alert(1) /></span>' +
    'OTHER CONTENT<span class="highlighted">VALUE2</span>OTHER CONTENT$';
    var actual = _.escapeHighlightedString(test, '<span class="highlighted">', '</span>');
    expect(actual).toEqual('<span class="highlighted">&lt;img src=VALUE1 onerror=alert(1) /&gt;</span>OTHER CONTENT<span class="highlighted">VALUE2</span>OTHER CONTENT$');
  });
});
