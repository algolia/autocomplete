'use strict';

/* eslint-env mocha, jasmine */

describe('Typeahead', function() {
  require('../../src/common/dom.js').element = require('jquery');
  require('../../src/jquery/plugin.js');

  var $ = require('jquery');
  require('jasmine-jquery');
  var Typeahead = require('../../src/autocomplete/typeahead.js');
  var fixtures = require('../fixtures.js');

  var mocks = require('../helpers/mocks.js');
  var waitsForAndRuns = require('../helpers/waits_for.js');

  Typeahead.Dropdown = mocks(Typeahead.Dropdown);
  Typeahead.Input = mocks(Typeahead.Input);

  var testDatum;

  beforeEach(function() {
    var $fixture;
    var $input;

    setFixtures(fixtures.html.textInput);

    $fixture = $('#jasmine-fixtures');
    this.$input = $fixture.find('input');

    testDatum = fixtures.data.simple[0];

    this.view = new Typeahead({
      input: this.$input,
      hint: true,
      datasets: {}
    });

    this.input = this.view.input;
    this.dropdown = this.view.dropdown;
  });

  describe('when dropdown triggers suggestionClicked', function() {
    beforeEach(function() {
      this.dropdown.getDatumForSuggestion.and.returnValue(testDatum);
    });

    it('should select the datum', function(done) {
      var spy;

      this.$input.on('autocomplete:selected', spy = jasmine.createSpy());
      this.dropdown.trigger('suggestionClicked');

      expect(spy).toHaveBeenCalled();
      expect(this.input.setQuery).toHaveBeenCalledWith(testDatum.value);
      expect(this.input.setInputValue)
        .toHaveBeenCalledWith(testDatum.value, true);

      var that = this;
      waitsForAndRuns(function() { return that.dropdown.close.calls.count(); }, done, 100);
    });

  });

  describe('when dropdown triggers suggestionClicked with undefined displayKey', function() {
    beforeEach(function() {
      this.dropdown.getDatumForSuggestion.and.returnValue({});
    });

    it('should not set input to undefined', function(done) {
      var spy;

      this.$input.on('autocomplete:selected', spy = jasmine.createSpy());
      this.dropdown.trigger('suggestionClicked');

      expect(spy).toHaveBeenCalled();
      expect(this.input.setQuery).not.toHaveBeenCalled();
      expect(this.input.setInputValue).toHaveBeenCalledWith(undefined, true);

      var that = this;
      waitsForAndRuns(function() { return that.dropdown.close.calls.count(); }, done, 100);
    });
  });

  describe('when dropdown triggers cursorMoved', function() {
    beforeEach(function() {
      this.dropdown.getDatumForCursor.and.returnValue(testDatum);
    });

    it('should update the input value', function() {
      this.dropdown.trigger('cursorMoved', true);

      expect(this.input.setInputValue)
        .toHaveBeenCalledWith(testDatum.value, true);
    });

    it('should not update the input', function() {
      this.dropdown.trigger('cursorMoved', false);

      expect(this.input.setInputValue)
        .not.toHaveBeenCalled();
    });

    it('should trigger cursorchanged', function() {
      var spy;

      this.$input.on('autocomplete:cursorchanged', spy = jasmine.createSpy());

      this.dropdown.trigger('cursorMoved');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when dropdown triggers cursorRemoved', function() {
    it('should reset the input value', function() {
      this.dropdown.trigger('cursorRemoved');

      expect(this.input.resetInputValue).toHaveBeenCalled();
    });

    it('should update the hint', function() {
      this.dropdown.getDatumForTopSuggestion.and.returnValue(testDatum);
      this.dropdown.isVisible.and.returnValue(true);
      this.input.hasOverflow.and.returnValue(false);
      this.input.getInputValue.and.returnValue(testDatum.value.slice(0, 2));

      this.dropdown.trigger('cursorRemoved');

      expect(this.input.setHint).toHaveBeenCalledWith(testDatum.value);
    });
  });

  describe('when dropdown triggers datasetRendered', function() {
    it('should update the hint asynchronously', function(done) {
      this.dropdown.getDatumForTopSuggestion.and.returnValue(testDatum);
      this.dropdown.isVisible.and.returnValue(true);
      this.input.hasOverflow.and.returnValue(false);
      this.input.getInputValue.and.returnValue(testDatum.value.slice(0, 2));

      this.dropdown.trigger('datasetRendered');

      // ensure it wasn't called synchronously
      expect(this.input.setHint).not.toHaveBeenCalled();

      var that = this;
      waitsForAndRuns(function() { return !!that.input.setHint.calls.count(); }, function() {
        expect(that.input.setHint).toHaveBeenCalledWith(testDatum.value);
        done();
      }, 100);
    });

    it('should trigger autocomplete:updated', function(done) {
      var spy;
      this.$input.on('autocomplete:updated', spy = jasmine.createSpy());

      this.dropdown.trigger('datasetRendered');

      var that = this;
      waitsForAndRuns(function() { return !!that.input.setHint.calls.count(); }, function() {
        expect(spy).toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('when dropdown triggers opened', function() {
    it('should update the hint', function() {
      this.dropdown.getDatumForTopSuggestion.and.returnValue(testDatum);
      this.dropdown.isVisible.and.returnValue(true);
      this.input.hasOverflow.and.returnValue(false);
      this.input.getInputValue.and.returnValue(testDatum.value.slice(0, 2));

      this.dropdown.trigger('opened');

      expect(this.input.setHint).toHaveBeenCalledWith(testDatum.value);
    });

    it('should trigger autocomplete:opened', function() {
      var spy;

      this.$input.on('autocomplete:opened', spy = jasmine.createSpy());

      this.dropdown.trigger('opened');

      expect(spy).toHaveBeenCalled();
    });

    it('should trigger autocomplete:shown', function() {
      var spy;

      this.$input.on('autocomplete:shown', spy = jasmine.createSpy());

      this.dropdown.trigger('shown');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when dropdown triggers closed', function() {
    it('should clear the hint', function() {
      this.dropdown.trigger('closed');

      expect(this.input.clearHint).toHaveBeenCalled();
    });

    it('should trigger autocomplete:closed', function() {
      var spy;

      this.$input.on('autocomplete:closed', spy = jasmine.createSpy());

      this.dropdown.trigger('closed');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when input triggers focused', function() {
    it('should activate the typeahead', function() {
      this.input.trigger('focused');

      expect(this.view.isActivated).toBe(true);
    });

    it('should not open the dropdown', function() {
      this.input.trigger('focused');

      expect(this.dropdown.open).not.toHaveBeenCalled();
    });
  });

  describe('when input triggers blurred', function() {
    it('should deactivate the typeahead', function() {
      this.input.trigger('blurred');

      expect(this.view.isActivated).toBe(false);
    });

    it('should empty the dropdown', function() {
      this.input.trigger('blurred');

      expect(this.dropdown.empty).toHaveBeenCalled();
    });

    it('should close the dropdown', function() {
      this.input.trigger('blurred');

      expect(this.dropdown.close).toHaveBeenCalled();
    });
  });

  describe('when debug flag is set', function() {

    beforeEach(function() {
      this.view = new Typeahead({
        input: this.$input,
        debug: true,
        hint: true,
        datasets: {}
      });

      this.input = this.view.input;
    });

    describe('when input triggers blurred', function() {
      it('should not empty the dropdown', function() {
        this.input.trigger('blurred');

        expect(this.dropdown.empty).not.toHaveBeenCalled();
      });

      it('should not close the dropdown', function() {
        this.input.trigger('blurred');

        expect(this.dropdown.close).not.toHaveBeenCalled();
      });
    });
  });

  describe('when input triggers enterKeyed', function() {
    beforeEach(function() {
      this.dropdown.getDatumForCursor.and.returnValue(testDatum);
    });

    it('should select the datum', function(done) {
      var $e;
      var spy;

      $e = jasmine.createSpyObj('event', ['preventDefault']);
      this.$input.on('autocomplete:selected', spy = jasmine.createSpy());
      this.input.trigger('enterKeyed', $e);

      expect(spy).toHaveBeenCalled();
      expect(this.input.setQuery).toHaveBeenCalledWith(testDatum.value);
      expect(this.input.setInputValue)
        .toHaveBeenCalledWith(testDatum.value, true);

      var that = this;
      waitsForAndRuns(function() { return that.dropdown.close.calls.count(); }, done, 100);
    });

    it('should prevent the default behavior of the event', function() {
      var $e;

      $e = jasmine.createSpyObj('event', ['preventDefault']);
      this.input.trigger('enterKeyed', $e);

      expect($e.preventDefault).toHaveBeenCalled();
    });
  });

  describe('when input triggers tabKeyed', function() {
    describe('when cursor is in use', function() {
      beforeEach(function() {
        this.dropdown.getDatumForCursor.and.returnValue(testDatum);
      });

      it('should select the datum', function(done) {
        var $e;
        var spy;

        $e = jasmine.createSpyObj('event', ['preventDefault']);
        this.$input.on('autocomplete:selected', spy = jasmine.createSpy());
        this.input.trigger('tabKeyed', $e);

        expect(spy).toHaveBeenCalled();
        expect(this.input.setQuery).toHaveBeenCalledWith(testDatum.value);
        expect(this.input.setInputValue)
          .toHaveBeenCalledWith(testDatum.value, true);

        var that = this;
        waitsForAndRuns(function() { return that.dropdown.close.calls.count(); }, done, 100);
      });

      it('should prevent the default behavior of the event', function() {
        var $e;

        $e = jasmine.createSpyObj('event', ['preventDefault']);
        this.input.trigger('tabKeyed', $e);

        expect($e.preventDefault).toHaveBeenCalled();
      });
    });

    describe('when cursor is not in use', function() {
      it('should autocomplete', function() {
        var spy;

        this.input.getQuery.and.returnValue('bi');
        this.input.getHint.and.returnValue(testDatum.value);
        this.input.isCursorAtEnd.and.returnValue(true);
        this.dropdown.getDatumForTopSuggestion.and.returnValue(testDatum);
        this.$input.on('autocomplete:autocompleted', spy = jasmine.createSpy());

        this.input.trigger('tabKeyed');

        expect(this.input.setInputValue).toHaveBeenCalledWith(testDatum.value);
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('when input triggers escKeyed', function() {
    it('should close the dropdown', function() {
      this.input.trigger('escKeyed');

      expect(this.dropdown.close).toHaveBeenCalled();
    });

    it('should reset the input value', function() {
      this.input.trigger('escKeyed');

      expect(this.input.resetInputValue).toHaveBeenCalled();
    });
  });

  describe('when input triggers upKeyed', function() {
    beforeEach(function() {
      this.input.getQuery.and.returnValue('ghost');
    });

    describe('when dropdown is empty and minLength is satisfied', function() {
      beforeEach(function() {
        this.dropdown.isEmpty = true;
        this.view.minLength = 2;

        this.input.trigger('upKeyed');
      });

      it('should update dropdown', function() {
        expect(this.dropdown.update).toHaveBeenCalledWith('ghost');
      });

      it('should not move cursor up', function() {
        expect(this.dropdown.moveCursorUp).not.toHaveBeenCalled();
      });
    });

    describe('when dropdown is not empty', function() {
      beforeEach(function() {
        this.dropdown.isEmpty = false;
        this.view.minLength = 2;

        this.input.trigger('upKeyed');
      });

      it('should not update dropdown', function() {
        expect(this.dropdown.update).not.toHaveBeenCalled();
      });

      it('should move cursor up', function() {
        expect(this.dropdown.moveCursorUp).toHaveBeenCalled();
      });
    });

    describe('when minLength is not satisfied', function() {
      beforeEach(function() {
        this.dropdown.isEmpty = true;
        this.view.minLength = 10;

        this.input.trigger('upKeyed');
      });

      it('should not update dropdown', function() {
        expect(this.dropdown.update).not.toHaveBeenCalled();
      });

      it('should move cursor up', function() {
        expect(this.dropdown.moveCursorUp).toHaveBeenCalled();
      });
    });

    it('should open the dropdown', function() {
      this.input.trigger('upKeyed');

      expect(this.dropdown.open).toHaveBeenCalled();
    });
  });

  describe('when input triggers downKeyed', function() {
    beforeEach(function() {
      this.input.getQuery.and.returnValue('ghost');
    });

    describe('when dropdown is empty and minLength is satisfied', function() {
      beforeEach(function() {
        this.dropdown.isEmpty = true;
        this.view.minLength = 2;

        this.input.trigger('downKeyed');
      });

      it('should update dropdown', function() {
        expect(this.dropdown.update).toHaveBeenCalledWith('ghost');
      });

      it('should not move cursor down', function() {
        expect(this.dropdown.moveCursorDown).not.toHaveBeenCalled();
      });
    });

    describe('when dropdown is not empty', function() {
      beforeEach(function() {
        this.dropdown.isEmpty = false;
        this.view.minLength = 2;

        this.input.trigger('downKeyed');
      });

      it('should not update dropdown', function() {
        expect(this.dropdown.update).not.toHaveBeenCalled();
      });

      it('should move cursor down', function() {
        expect(this.dropdown.moveCursorDown).toHaveBeenCalled();
      });
    });

    describe('when minLength is not satisfied', function() {
      beforeEach(function() {
        this.dropdown.isEmpty = true;
        this.view.minLength = 10;

        this.input.trigger('downKeyed');
      });

      it('should not update dropdown', function() {
        expect(this.dropdown.update).not.toHaveBeenCalled();
      });

      it('should move cursor down', function() {
        expect(this.dropdown.moveCursorDown).toHaveBeenCalled();
      });
    });

    it('should open the dropdown', function() {
      this.input.trigger('downKeyed');

      expect(this.dropdown.open).toHaveBeenCalled();
    });
  });

  describe('when input triggers leftKeyed', function() {
    it('should autocomplete if language is rtl', function() {
      var spy;

      this.view.dir = 'rtl';
      this.input.getQuery.and.returnValue('bi');
      this.input.getHint.and.returnValue(testDatum.value);
      this.input.isCursorAtEnd.and.returnValue(true);
      this.dropdown.getDatumForTopSuggestion.and.returnValue(testDatum);
      this.$input.on('autocomplete:autocompleted', spy = jasmine.createSpy());

      this.input.trigger('leftKeyed');

      expect(this.input.setInputValue).toHaveBeenCalledWith(testDatum.value);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when input triggers rightKeyed', function() {
    it('should autocomplete if language is ltr', function() {
      var spy;

      this.view.dir = 'ltr';
      this.input.getQuery.and.returnValue('bi');
      this.input.getHint.and.returnValue(testDatum.value);
      this.input.isCursorAtEnd.and.returnValue(true);
      this.dropdown.getDatumForTopSuggestion.and.returnValue(testDatum);
      this.$input.on('autocomplete:autocompleted', spy = jasmine.createSpy());

      this.input.trigger('rightKeyed');

      expect(this.input.setInputValue).toHaveBeenCalledWith(testDatum.value);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when input triggers queryChanged', function() {
    it('should clear the hint if it has become invalid', function() {
      this.input.trigger('queryChanged', testDatum.value);

      expect(this.input.clearHintIfInvalid).toHaveBeenCalled();
    });

    it('should empty dropdown if the query is empty', function() {
      this.input.trigger('queryChanged', '');

      expect(this.dropdown.empty).toHaveBeenCalled();
    });

    it('should not empty dropdown if the query is non-empty', function() {
      this.input.trigger('queryChanged', testDatum.value);

      expect(this.dropdown.empty).not.toHaveBeenCalled();
    });

    it('should update dropdown', function() {
      this.input.trigger('queryChanged', testDatum.value);

      expect(this.dropdown.update).toHaveBeenCalledWith(testDatum.value);
    });

    it('should open the dropdown', function() {
      this.input.trigger('queryChanged', testDatum.value);

      expect(this.dropdown.open).toHaveBeenCalled();
    });

    it('should set the language direction', function() {
      this.input.getLanguageDirection.and.returnValue('rtl');

      this.input.trigger('queryChanged', testDatum.value);

      expect(this.view.dir).toBe('rtl');
      expect(this.view.$node).toHaveCss({direction: 'rtl'});
    });
  });

  describe('when input triggers whitespaceChanged', function() {
    it('should update the hint', function() {
      this.dropdown.getDatumForTopSuggestion.and.returnValue(testDatum);
      this.dropdown.isVisible.and.returnValue(true);
      this.input.hasOverflow.and.returnValue(false);
      this.input.getInputValue.and.returnValue(testDatum.value.slice(0, 2));

      this.input.trigger('whitespaceChanged');

      expect(this.input.setHint).toHaveBeenCalledWith(testDatum.value);
    });

    it('should open the dropdown', function() {
      this.input.trigger('whitespaceChanged');

      expect(this.dropdown.open).toHaveBeenCalled();
    });
  });

  describe('#open', function() {
    it('should open the dropdown', function() {
      this.input.getInputValue.and.returnValue('');
      this.view.open();

      expect(this.dropdown.open).toHaveBeenCalled();
    });

    it('should update & open the dropdown if there is a query', function() {
      this.input.getInputValue.and.returnValue('test');
      this.view.open();

      expect(this.dropdown.update).toHaveBeenCalled();
      expect(this.dropdown.open).toHaveBeenCalled();
    });
  });

  describe('#close', function() {
    it('should close the dropdown', function() {
      this.view.close();

      expect(this.dropdown.close).toHaveBeenCalled();
    });
  });

  describe('#getVal', function() {
    it('should return the current query', function() {
      this.input.getQuery.and.returnValue('woah');
      this.view.close();

      expect(this.view.getVal()).toBe('woah');
    });
  });

  describe('#setVal', function() {
    it('should update query', function() {
      this.view.isActivated = true;
      this.view.setVal('woah');

      expect(this.input.setInputValue).toHaveBeenCalledWith('woah');
    });

    it('should update query silently if not activated', function() {
      this.view.setVal('woah');

      expect(this.input.setQuery).toHaveBeenCalledWith('woah');
      expect(this.input.setInputValue).toHaveBeenCalledWith('woah', true);
    });
  });

  describe('#destroy', function() {
    it('should destroy input', function() {
      this.view.destroy();

      expect(this.input.destroy).toHaveBeenCalled();
    });

    it('should destroy dropdown', function() {
      this.view.destroy();

      expect(this.dropdown.destroy).toHaveBeenCalled();
    });

    it('should null out its reference to the wrapper element', function() {
      this.view.destroy();

      expect(this.view.$node).toBeNull();
    });

    it('should revert DOM changes', function() {
      this.view.destroy();

      // TODO: bad test
      expect(this.$input).not.toHaveClass('aa-input');
    });
  });

  describe('when instantiated with a custom menu template', function() {
    beforeEach(function() {
      appendSetFixtures(fixtures.html.customMenu);

      this.view.destroy();
      this.view = new Typeahead({
        input: this.$input,
        templates: {
          dropdownMenu: '#my-custom-menu-template'
        },
        datasets: {}
      });
    });

    it('should include the template in the menu', function() {
      expect($('.aa-dropdown-menu .my-custom-menu').length).toEqual(1);
    });
  });

  describe('when instantiated with a custom CSS classes', function() {
    beforeEach(function() {
      appendSetFixtures(fixtures.html.customMenu);

      this.view.destroy();
      this.view = new Typeahead({
        input: this.$input,
        hint: true,
        cssClasses: {
          root: 'my-root',
          prefix: 'pp',
          dropdownMenu: 'my-menu',
          input: 'my-bar',
          hint: 'my-clue',
          suggestions: 'list',
          suggestion: 'item',
          cursor: 'pointer',
          dataset: 'resultset'
        },
        datasets: {}
      });
    });

    it('should include the template in the menu', function() {
      var $fixture = $('#jasmine-fixtures');
      expect($fixture.find('.my-root').length).toEqual(1);
      expect($fixture.find('.my-root .pp-my-menu').length).toEqual(1);
      expect($fixture.find('.my-root .pp-my-bar').length).toEqual(1);
      expect($fixture.find('.my-root .pp-my-clue').length).toEqual(1);
    });
  });

  describe('when instantiated with a custom menu container', function() {
    beforeEach(function() {
      appendSetFixtures(fixtures.html.customMenuContainer);

      this.view.destroy();
      this.view = new Typeahead({
        input: this.$input,
        dropdownMenuContainer: '#custom-menu-container',
        datasets: {}
      });
    });

    it('should include the template in the menu', function() {
      var $fixture = $('#custom-menu-container');
      expect($fixture.find('.aa-dropdown-menu').length).toEqual(1);
    });
  });

  describe('when openOnFocus is set', function() {

    beforeEach(function() {
      appendSetFixtures(fixtures.html.customMenu);

      this.view.destroy();
      this.view = new Typeahead({
        input: this.$input,
        openOnFocus: true,
        minLength: 0,
        datasets: {}
      });

      this.input = this.view.input;
    });

    it('should open the dropdown', function() {
      this.input.getQuery.and.returnValue('');
      this.input.trigger('focused');
      expect(this.view.dropdown.open).toHaveBeenCalled();
    });
  });
});
