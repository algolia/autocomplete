'use strict';

/* eslint-env mocha, jasmine */


describe('autocomplete directive', function() {
  global.jQuery = require('jquery');
  var fixtures = require('../fixtures.js');

  var angular = require('angular');
  require('algoliasearch/plugins/angular.js');
  require('../../src/angular/directive.js');
  require('angular-mocks');

  var scope;

  beforeEach(angular.mock.module('algolia.autocomplete'));

  describe('with scope', function() {
    beforeEach(angular.mock.inject(function($rootScope, $compile) {
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

  afterAll(function() {
    global.jQuery = undefined;
  });
});
