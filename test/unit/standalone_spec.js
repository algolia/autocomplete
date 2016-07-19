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
      expect(this.$fixture.find('.aa-dropdown-menu').length).toEqual(1);
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
          open: sinon.stub().returns('hello'),
          close: sinon.stub().returns('hello'),
          getVal: sinon.stub().returns('hello'),
          setVal: sinon.stub().returns('hello'),
          destroy: sinon.stub().returns('hello')
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
        expect(this.ac.autocomplete.open()).toEqual('hello');
        expect(this.typeaheadSpy.open.calledOnce).toBe(true);
        expect(this.ac.autocomplete.close()).toEqual('hello');
        expect(this.typeaheadSpy.close.calledOnce).toBe(true);
        expect(this.ac.autocomplete.getVal()).toEqual('hello');
        expect(this.typeaheadSpy.getVal.calledOnce).toBe(true);
        expect(this.ac.autocomplete.setVal('Hey')).toEqual('hello');
        expect(this.typeaheadSpy.setVal.withArgs('Hey').calledOnce).toBe(true);
        expect(this.ac.autocomplete.destroy()).toEqual('hello');
        expect(this.typeaheadSpy.destroy.calledOnce).toBe(true);
      });

    });
  });

});
