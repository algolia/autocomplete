'use strict';

/* eslint-env mocha, jasmine */

var _ = require('../../src/common/utils.js');
var highlightTags = require('../../src/common/highlightTags.js');

describe('escapeHTML', function() {
  it('should escape HTML but preserve the default tags', function() {
    var test = highlightTags.pre + '<img src=VALUE1 onerror=alert(1) />' + highlightTags.post +
    'OTHER CONTENT' + highlightTags.pre + 'VALUE2' + highlightTags.post + 'OTHER CONTENT$';

    var actual = _.escapeHTML(test, {pre: '<strong>', post: '</strong>'});

    expect(actual).toEqual('<strong>&lt;img src=VALUE1 onerror=alert(1) /&gt;</strong>OTHER CONTENT<strong>VALUE2</strong>OTHER CONTENT$');
  });
});
