'use strict';

var old$ = window.$;
var Zepto = require('npm-zepto');
require('npm-zepto/zepto/src/data.js');
window.$ = old$;

var DOM = require('../common/dom.js');
DOM.element = Zepto;

var _ = require('../common/utils.js');
var Typeahead = require('../autocomplete/typeahead.js');
var EventBus = require('../autocomplete/event_bus.js');

function autocomplete(selector, options, datasets) {
  var $input = Zepto(selector);
  var eventBus = new EventBus({el: $input});

  new Typeahead({
    input: $input,
    eventBus: eventBus,
    hint: options.hint === undefined ? true : !!options.hint,
    minLength: options.minLength,
    autoselect: options.autoselect,
    openOnFocus: options.openOnFocus,
    templates: options.templates,
    debug: options.debug,
    datasets: datasets
  });
};

module.exports = autocomplete;
