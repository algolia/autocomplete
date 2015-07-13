'use strict';

/* eslint-env jquery */

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

  isArray: $.isArray,

  isFunction: $.isFunction,

  isObject: $.isPlainObject,

  isUndefined: function(obj) { return typeof obj === 'undefined'; },

  toStr: function toStr(s) {
    return this.isUndefined(s) || s === null ? '' : s + '';
  },

  bind: $.proxy,

  each: function(collection, cb) {
    // stupid argument order for jQuery.each
    $.each(collection, reverseArgs);

    function reverseArgs(index, value) { return cb(value, index); }
  },

  map: $.map,

  filter: $.grep,

  every: function(obj, test) {
    var result = true;

    if (!obj) { return result; }

    $.each(obj, function(key, val) {
      result = test.call(null, val, key, obj);
      if (!result) {
        return false;
      }
    });

    return !!result;
  },

  mixin: $.extend,

  getUniqueId: (function() {
    var counter = 0;
    return function() { return counter++; };
  })(),

  templatify: function templatify(obj) {
    if ($.isFunction(obj)) {
      return obj;
    }
    var $template = $(obj);
    if ($template.prop('tagName') === 'SCRIPT') {
      return function template() { return $template.text() };
    }
    return function template() { return String(obj); };
  },

  defer: function(fn) { setTimeout(fn, 0); },

  noop: function() {}
};
