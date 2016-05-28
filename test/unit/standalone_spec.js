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
    });
  });

  describe('when instantiated from standalone', function() {

    it('should initialize', function() {
      expect(this.$fixture.find('.aa-input').length).toEqual(1);
    });

    it('has an .autocomplete property', function() {
      expect(this.ac.autocomplete).toBeDefined();
    });

  });

  describe('when accessing autocomplete function', function() {

    it('should have an open, close, getVal, setVal and destroy methods', function() {
      var methodsToAssert = ['open', 'close', 'getVal', 'setVal', 'destroy'];

      for (var i = 0; i < methodsToAssert.length; i++) {
        expect(this.ac.autocomplete[methodsToAssert[i]]).toBeDefined();
        expect(typeof this.ac.autocomplete[methodsToAssert[i]]).toEqual('function');
      }
    });

    describe('when executing the methods', function() {
      beforeEach(function() {
        this.$fixture = setFixtures(fixtures.html.textInput);

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
        }, this.typeaheadSpy);
      });

      it('should proxy the method call on typeahead object', function() {
        this.ac.autocomplete.open();
        expect(this.typeaheadSpy.open.calledOnce).toBe(true);
        this.ac.autocomplete.close();
        expect(this.typeaheadSpy.close.calledOnce).toBe(true);
        this.ac.autocomplete.getVal();
        expect(this.typeaheadSpy.getVal.calledOnce).toBe(true);
        this.ac.autocomplete.setVal('Hey');
        expect(this.typeaheadSpy.setVal.withArgs('Hey').calledOnce).toBe(true);
        this.ac.autocomplete.destroy();
        expect(this.typeaheadSpy.destroy.calledOnce).toBe(true);
      });

    });
  });

});
