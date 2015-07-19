'use strict';

/* eslint-env mocha, jasmine */

global.$ = require('jquery');

var Typeahead = require('../../src/autocomplete/typeahead.js');
var fixtures = require('../fixtures.js');
var $autocomplete = require('../../src/jquery/plugin.js');

describe('autocomplete directive', function() {

    var scope;

    beforeEach(angular.mock.module('algolia.autocomplete'));

    describe('with scope', function() {
      beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.q = '';
        scope.getDatasets = function() {
          return [];
        };
      }));

      describe('when initialized', function() {
        var form;

        beforeEach(function() {
          inject(function($compile) {
            form = $compile(fixtures.html.angularTextInput)(scope);
          });
          scope.$digest();
        });

        it('should have a parent', function() {
          expect(form.parent().length).toEqual(1);
        });
      });
    });

});