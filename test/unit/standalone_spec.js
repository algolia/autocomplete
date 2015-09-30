'use strict';

/* eslint-env mocha, jasmine */

describe('Typeahead', function() {
  var $ = require('jquery');
  require('jasmine-jquery');

  require('../../src/common/dom.js').element = require('jquery');
  require('../../src/jquery/plugin.js');

  var fixtures = require('../fixtures.js');
  var $autocomplete = require('../../src/standalone/index.js');

  describe('when instantiated from jquery', function() {
    beforeEach(function() {
      setFixtures(fixtures.html.textInput);

      this.autocomplete = $autocomplete('input', {}, [{
        name: 'test',
        source: function(q, cb) {
          cb([{name: 'test'}]);
        },
        templates: {
          suggestion: function(sugg) {
            return sugg.name;
          }
        }
      }]);
    });

    it('should initialize', function() {
      var $fixture = $('#jasmine-fixtures');
      expect($fixture.find('.aa-dropdown-menu').length).toEqual(1);
    });
  });
});
