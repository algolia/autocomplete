'use strict';

/* eslint-env mocha, jasmine */

var fixtures = require('../fixtures.js');
var $autocomplete = require('../../src/standalone/index.js');

describe('Typeahead', function() {

  describe('when instantiated from jquery', function() {
    beforeEach(function() {
      setFixtures(fixtures.html.textInput);

      this.autocomplete = $autocomplete('input', {}, {
        name: 'test',
        source: function(q, cb) {
          cb([{name: 'test'}]);
        },
        templates: {
          suggestion: function(sugg) {
            return sugg.name;
          }
        }
      });
    });

    it('should initialize', function() {
      var $fixture = $('#jasmine-fixtures');
      expect($fixture.find('.aa-dropdown-menu').length).toEqual(1);
    });
  });
});
