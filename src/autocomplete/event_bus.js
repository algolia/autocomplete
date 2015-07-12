'use strict';

/* eslint-env jquery */

var namespace = 'typeahead:';

var _ = require('../common/utils.js');

// constructor
// -----------

function EventBus(o) {
  if (!o || !o.el) {
    $.error('EventBus initialized without el');
  }

  this.$el = $(o.el);
}

// instance methods
// ----------------

_.mixin(EventBus.prototype, {

  // ### public

  trigger: function(type) {
    var args = [].slice.call(arguments, 1);

    this.$el.trigger(namespace + type, args);
  }
});

module.exports = EventBus;
