'use strict';

/* eslint-env jquery */

var _ = require('../common/utils.js');
var Typeahead = require('./typeahead.js');
var EventBus = require('./event_bus.js');


var old;
var typeaheadKey;
var methods;

old = $.fn.typeahead;

typeaheadKey = 'aaAutocomplete';

methods = {
  // supported signatures:
  // function(o, dataset, dataset, ...)
  // function(o, [dataset, dataset, ...])
  initialize: function initialize(o, datasets) {
    datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);

    o = o || {};

    return this.each(attach);

    function attach() {
      var $input = $(this);
      var eventBus = new EventBus({el: $input});
      var typeahead;

      typeahead = new Typeahead({
        input: $input,
        eventBus: eventBus,
        withHint: _.isUndefined(o.hint) ? true : !!o.hint,
        minLength: o.minLength,
        autoselect: o.autoselect,
        datasets: datasets
      });

      $input.data(typeaheadKey, typeahead);
    }
  },

  open: function open() {
    return this.each(openTypeahead);

    function openTypeahead() {
      var $input = $(this);
      var typeahead;

      if (typeahead = $input.data(typeaheadKey)) {
        typeahead.open();
      }
    }
  },

  close: function close() {
    return this.each(closeTypeahead);

    function closeTypeahead() {
      var $input = $(this);
      var typeahead;

      if (typeahead = $input.data(typeaheadKey)) {
        typeahead.close();
      }
    }
  },

  val: function val(newVal) {
    // mirror jQuery#val functionality: reads opearte on first match,
    // write operates on all matches
    return !arguments.length ? getVal(this.first()) : this.each(setVal);

    function setVal() {
      var $input = $(this);
      var typeahead;

      if (typeahead = $input.data(typeaheadKey)) {
        typeahead.setVal(newVal);
      }
    }

    function getVal($input) {
      var typeahead;
      var query;

      if (typeahead = $input.data(typeaheadKey)) {
        query = typeahead.getVal();
      }

      return query;
    }
  },

  destroy: function destroy() {
    return this.each(unattach);

    function unattach() {
      var $input = $(this);
      var typeahead;

      if (typeahead = $input.data(typeaheadKey)) {
        typeahead.destroy();
        $input.removeData(typeaheadKey);
      }
    }
  }
};

$.fn.autocomplete = function(method) {
  var tts;

  // methods that should only act on intialized typeaheads
  if (methods[method] && method !== 'initialize') {
    // filter out non-typeahead inputs
    tts = this.filter(function() { return !!$(this).data(typeaheadKey); });
    return methods[method].apply(tts, [].slice.call(arguments, 1));
  }
  return methods.initialize.apply(this, arguments);
};

$.fn.autocomplete.noConflict = function noConflict() {
  $.fn.autocomplete = old;
  return this;
};
