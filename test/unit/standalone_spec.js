'use strict';

/* eslint-env mocha, jasmine */

describe('Typeahead', function() {

  var fixtures = require('../fixtures.js');
  var autocomplete = require('../../src/standalone/index.js');

  beforeEach(function() {
    setFixtures(fixtures.html.textInput);

    this.autocomplete = autocomplete('input', {}, {
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

  describe('when instantiated from standalone', function() {

    it('should initialize', function() {
      var $fixture = $('#jasmine-fixtures');
      expect($fixture.find('.aa-dropdown-menu').length).toEqual(1);
    });

  });

  describe('when accessing autocomplete function', function() {

    it('should have a typeahead property', function() {
      expect(this.autocomplete.typeahead).toBeDefined();
    });

    it('should have an open, close, getVal, setVal and destroy methods', function() {
      var methodsToAssert = ['open', 'close', 'getVal', 'setVal', 'destroy'];

      for (var i = 0; i < methodsToAssert.length; i++) {
        expect(this.autocomplete[methodsToAssert[i]]).toBeDefined();
        expect(typeof this.autocomplete[methodsToAssert[i]]).toEqual('function');
      }
    });
  });

});
