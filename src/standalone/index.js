'use strict';

var current$ = window.$;
require('../../zepto.js');
var zepto = window.Zepto;
window.$ = current$; // restore the `$` (we don't want Zepto here)

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
_.Event = zepto.Event;

var typeaheadKey = 'aaAutocomplete';
var Typeahead = require('../autocomplete/typeahead.js');
var EventBus = require('../autocomplete/event_bus.js');

function autocomplete(selector, options, datasets, typeaheadObject) {
  datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 2);

  var inputs = zepto(selector).each(function(i, input) {
    var $input = zepto(input);
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
      cssClasses: options.cssClasses,
      datasets: datasets,
      keyboardShortcuts: options.keyboardShortcuts
    });

    $input.data(typeaheadKey, typeahead);
  });

  // expose all methods in the `autocomplete` attribute
  inputs.autocomplete = {};
  _.each(['open', 'close', 'getVal', 'setVal', 'destroy'], function(method) {
    inputs.autocomplete[method] = function() {
      var methodArguments = arguments;
      inputs.each(function(j, input) {
        var typeahead = zepto(input).data(typeaheadKey);
        typeahead[method].apply(typeahead, methodArguments);
      });
    };
  });

  return inputs;
}

autocomplete.sources = Typeahead.sources;

module.exports = autocomplete;
