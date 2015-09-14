'use strict';

var DOM = require('./dom.js');

module.exports = {
  isMsie: function() {
    // from https://github.com/ded/bowser/blob/master/bowser.js
    return (/(msie|trident)/i).test(navigator.userAgent) ?
      navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
  },

  // http://stackoverflow.com/a/6969486
  escapeRegExChars: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  },

  isNumber: function(obj) { return typeof obj === 'number'; },

  isArray: require('lodash-compat/lang/isArray'),

  isFunction: require('lodash-compat/lang/isFunction'),

  isObject: require('lodash-compat/lang/isPlainObject'),

  toStr: function toStr(s) {
    return s === undefined || s === null ? '' : s + '';
  },

  bind: require('lodash-compat/function/bind'),

  each: require('lodash-compat/collection/forEach'),

  map: require('lodash-compat/collection/map'),

  filter: require('lodash-compat/collection/filter'),

  error: function(msg) {
    throw new Error(msg);
  },

  every: require('lodash-compat/collection/every'),

  mixin: require('lodash-compat/object/assign'),

  getUniqueId: (function() {
    var counter = 0;
    return function() { return counter++; };
  })(),

  templatify: function templatify(obj) {
    var isFunction = require('lodash-compat/lang/isFunction');

    if (isFunction(obj)) {
      return obj;
    }
    var $template = DOM.element(obj);
    if ($template.prop('tagName') === 'SCRIPT') {
      return function template() { return $template.text(); };
    }
    return function template() { return String(obj); };
  },

  defer: function(fn) { setTimeout(fn, 0); },

  noop: function() {}
};
