'use strict';

/* eslint-env mocha, jasmine */

describe('Typeahead', function() {

  var fixtures = require('../fixtures.js');
  var autocomplete = require('../../src/standalone/index.js');

  beforeEach(function() {
    this.$fixture = setFixtures(fixtures.html.textInput);

    this.ac = autocomplete('input', {}, {
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

  describe('when instantiated from standalone', function() {

    it('should initialize', function() {
      expect(this.$fixture.find('.aa-dropdown-menu').length).toEqual(1);
    });

  });

  describe('when accessing autocomplete function', function() {

    it('should have an open, close, getVal, setVal and destroy methods', function() {
      var methodsToAssert = ['open', 'close', 'getVal', 'setVal', 'destroy'];

      for (var i = 0; i < methodsToAssert.length; i++) {
        expect(this.ac[methodsToAssert[i]]).toBeDefined();
        expect(typeof this.ac[methodsToAssert[i]]).toEqual('function');
      }
    });

    describe('when executing the methods', function() {
      beforeEach(function() {

        this.typeaheadSpy = {
          input: {
            $input: {}
          },
          open: sinon.spy(),
          close: sinon.spy(),
          getVal: sinon.spy(),
          setVal: sinon.spy(),
          destroy: sinon.spy()
        };

        this.ac = autocomplete('input', {}, {
          name: 'test',
          source: function(q, cb) {
            cb([{name: 'test'}]);
          },
          templates: {
            suggestion: function(sugg) {
              return sugg.name;
            }
          }
        }, this.typeaheadSpy).data('aaAutocomplete');
      });

      it('should proxy the method call on typeahead object', function() {
        this.ac.open();
        expect(this.typeaheadSpy.open.calledOnce).toBe(true);
        this.ac.close();
        expect(this.typeaheadSpy.close.calledOnce).toBe(true);
        this.ac.getVal();
        expect(this.typeaheadSpy.getVal.calledOnce).toBe(true);
        this.ac.setVal('Hey');
        expect(this.typeaheadSpy.setVal.withArgs('Hey').calledOnce).toBe(true);
        this.ac.destroy();
        expect(this.typeaheadSpy.destroy.calledOnce).toBe(true);
      });

    });
  });

});
