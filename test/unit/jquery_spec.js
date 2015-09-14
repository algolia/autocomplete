'use strict';

/* eslint-env mocha, jasmine */

global.$ = require('../../src/common/dom.js').element = require('jquery');

var Typeahead = require('../../src/autocomplete/typeahead.js');
var fixtures = require('../fixtures.js');
var $autocomplete = require('../../src/jquery/plugin.js');

describe('Typeahead', function() {

  describe('when instantiated from jquery', function() {
    beforeEach(function() {
      setFixtures(fixtures.html.textInput);

      this.view = $autocomplete.call($('input'), {}, {
        name: 'test',
        source: function(q, cb) {
          cb([{name: 'test'}]);
        },
        templates: {
          suggestion: function(sugg) {
            return sugg.name;
          }
        }
      }).data('aaAutocomplete');
    });

    it('should initialize', function() {
      var $fixture = $('#jasmine-fixtures');
      expect($fixture.find('.aa-dropdown-menu').length).toEqual(1);
    });

    it('should open the dropdown', function() {
      var $fixture = $('#jasmine-fixtures');
      this.view.input.getInputValue.and.returnValue('test');
      $autocomplete.call($('input'), 'val', 'test');
      $autocomplete.call($('input'), 'open');
      $autocomplete.call($('input'), 'close');
    });
  });
});
