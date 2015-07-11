'use strict';

/* eslint-env mocha, jasmine */

global.$ = require('jquery');
var Dataset = require('../../src/typeahead/dataset.js');

describe('Dataset', function() {

  beforeEach(function() {
    this.dataset = new Dataset({
      name: 'test',
      source: this.source = jasmine.createSpy('source')
    });
  });

  it('should throw an error if source is missing', function() {
    expect(noSource).toThrow();

    function noSource() { new Dataset(); }
  });

  it('should throw an error if the name is not a valid class name', function() {
    expect(fn).toThrow();

    function fn() {
      var d = new Dataset({ name: 'a space', source: $.noop });
    }
  });

  describe('#getRoot', function() {
    it('should return the root element', function() {
      expect(this.dataset.getRoot()).toBeMatchedBy('div.tt-dataset-test');
    });
  });

  describe('#update', function() {
    it('should render suggestions', function() {
      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('one');
      expect(this.dataset.getRoot()).toContainText('two');
      expect(this.dataset.getRoot()).toContainText('three');
    });

    it('should allow custom display functions', function() {
      this.dataset = new Dataset({
        name: 'test',
        display: function(o) { return o.display; },
        source: this.source = jasmine.createSpy('source')
      });

      this.source.and.callFake(fakeGetForDisplayFn);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('4');
      expect(this.dataset.getRoot()).toContainText('5');
      expect(this.dataset.getRoot()).toContainText('6');
    });

    it('should render empty when no suggestions are available', function() {
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          empty: '<h2>empty</h2>'
        }
      });

      this.source.and.callFake(fakeGetWithSyncEmptyResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('empty');
    });

    it('should render header', function() {
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          header: '<h2>header</h2>'
        }
      });

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('header');
    });

    it('should render footer', function() {
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          footer: function(c) { return '<p>' + c.query + '</p>'; }
        }
      });

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).toContainText('woah');
    });

    it('should not render header/footer if there is no content', function() {
      this.dataset = new Dataset({
        source: this.source,
        templates: {
          header: '<h2>header</h2>',
          footer: '<h2>footer</h2>'
        }
      });

      this.source.and.callFake(fakeGetWithSyncEmptyResults);
      this.dataset.update('woah');

      expect(this.dataset.getRoot()).not.toContainText('header');
      expect(this.dataset.getRoot()).not.toContainText('footer');
    });

    it('should not render stale suggestions', function(done) {
      this.source.and.callFake(fakeGetWithAsyncResults);
      this.dataset.update('woah');

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('nelly');

      var that = this;
      setTimeout(function() {
        expect(that.dataset.getRoot()).toContainText('one');
        expect(that.dataset.getRoot()).toContainText('two');
        expect(that.dataset.getRoot()).toContainText('three');
        expect(that.dataset.getRoot()).not.toContainText('four');
        expect(that.dataset.getRoot()).not.toContainText('five');
        done();
      }, 100);
    });

    it('should not render suggestions if update was canceled', function(done) {
      this.source.and.callFake(fakeGetWithAsyncResults);
      this.dataset.update('woah');
      this.dataset.cancel();

      var that = this;
      setTimeout(function() {
        expect(that.dataset.getRoot()).toBeEmpty();
        done();
      }, 100);
    });

    it('should trigger rendered after suggestions are rendered', function(done) {
      var spy;

      this.dataset.onSync('rendered', spy = jasmine.createSpy());

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      setTimeout(function() {
        expect(spy.calls.count()).toBe(1);
        done();
      }, 100);
    });
  });

  describe('#clear', function() {
    it('should clear suggestions', function() {
      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      this.dataset.clear();
      expect(this.dataset.getRoot()).toBeEmpty();
    });

    it('should cancel pending updates', function() {
      var spy = spyOn(this.dataset, 'cancel');

      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');
      expect(this.dataset.canceled).toBe(false);

      this.dataset.clear();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#isEmpty', function() {
    it('should return true when empty', function() {
      expect(this.dataset.isEmpty()).toBe(true);
    });

    it('should return false when not empty', function() {
      this.source.and.callFake(fakeGetWithSyncResults);
      this.dataset.update('woah');

      expect(this.dataset.isEmpty()).toBe(false);
    });
  });

  describe('#destroy', function() {
    it('should null out the reference to the dataset element', function() {
      this.dataset.destroy();

      expect(this.dataset.$el).toBeNull();
    });
  });

  // helper functions
  // ----------------

  function fakeGetWithSyncResults(query, cb) {
    cb([
      { value: 'one', raw: { value: 'one' } },
      { value: 'two', raw: { value: 'two' } },
      { value: 'three', raw: { value: 'three' } }
    ]);
  }

  function fakeGetForDisplayFn(query, cb) {
    cb([{ display: '4' }, { display: '5' }, { display: '6' } ]);
  }

  function fakeGetWithSyncEmptyResults(query, cb) {
    cb();
  }

  function fakeGetWithAsyncResults(query, cb) {
    setTimeout(function() {
      cb([
        { value: 'four', raw: { value: 'four' } },
        { value: 'five', raw: { value: 'five' } },
      ]);
    }, 0);
  }
});
