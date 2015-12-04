'use strict';

var zepto = require('npm-zepto');

// setup DOM element
var DOM = require('../common/dom.js');
DOM.element = zepto;

// setup utils functions
var _ = require('../common/utils.js');
_.isArray = zepto.isArray;
_.isFunction = zepto.isFunction;
_.isObject = zepto.isPlainObject;
_.bind = zepto.proxy;
_.each = function(collection, cb) {
  // stupid argument order for jQuery.each
  zepto.each(collection, reverseArgs);
  function reverseArgs(index, value) {
    return cb(value, index);
  }
};
_.map = zepto.map;
_.mixin = zepto.extend;

var Typeahead = require('../autocomplete/typeahead.js');
var EventBus = require('../autocomplete/event_bus.js');

function autocomplete(selector, options, datasets, typeaheadObject) {
  datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 2);
  var $input = zepto(selector);
  var eventBus = new EventBus({el: $input});
  var typeahead = typeaheadObject || new Typeahead({
    input: $input,
    eventBus: eventBus,
    dropdownMenuContainer: options.dropdownMenuContainer,
    hint: options.hint === undefined ? true : !!options.hint,
    minLength: options.minLength,
    autoselect: options.autoselect,
    openOnFocus: options.openOnFocus,
    templates: options.templates,
    debug: options.debug,
    datasets: datasets
  });

  typeahead.input.$input.autocomplete = {
    typeahead: typeahead,
    open: function() {
      typeahead.open();
    },
    close: function() {
      typeahead.close();
    },
    getVal: function() {
      return typeahead.getVal();
    },
    setVal: function(value) {
      return typeahead.setVal(value);
    },
    destroy: function() {
      typeahead.destroy();
    }
  };

  return typeahead.input.$input;
}

autocomplete.sources = Typeahead.sources;

module.exports = autocomplete;
