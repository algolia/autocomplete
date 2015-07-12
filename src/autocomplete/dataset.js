'use strict';

/* eslint-env jquery */

var datasetKey = 'aaDataset';
var valueKey = 'aaValue';
var datumKey = 'aaDatum';

var _ = require('../common/utils.js');
var html = require('./html.js');
var css = require('./css.js');
var EventEmitter = require('./event_emitter.js');

// constructor
// -----------

function Dataset(o) {
  o = o || {};
  o.templates = o.templates || {};

  if (!o.source) {
    $.error('missing source');
  }

  if (o.name && !isValidName(o.name)) {
    $.error('invalid dataset name: ' + o.name);
  }

  // tracks the last query the dataset was updated for
  this.query = null;

  this.highlight = !!o.highlight;
  this.name = o.name || _.getUniqueId();

  this.source = o.source;
  this.displayFn = getDisplayFn(o.display || o.displayKey);

  this.templates = getTemplates(o.templates, this.displayFn);

  this.$el = $(html.dataset.replace('%CLASS%', this.name));
}

// static methods
// --------------

Dataset.extractDatasetName = function extractDatasetName(el) {
  return $(el).data(datasetKey);
};

Dataset.extractValue = function extractDatum(el) {
  return $(el).data(valueKey);
};

Dataset.extractDatum = function extractDatum(el) {
  return $(el).data(datumKey);
};

// instance methods
// ----------------

_.mixin(Dataset.prototype, EventEmitter, {

  // ### private

  _render: function render(query, suggestions) {
    if (!this.$el) { return; }

    var that = this;
    var hasSuggestions;
    var args = [].slice.call(arguments, 2);

    this.$el.empty();
    hasSuggestions = suggestions && suggestions.length;

    if (!hasSuggestions && this.templates.empty) {
      this.$el
      .html(getEmptyHtml.apply(this, args))
      .prepend(that.templates.header ? getHeaderHtml.apply(this, args) : null)
      .append(that.templates.footer ? getFooterHtml.apply(this, args) : null);
    } else if (hasSuggestions) {
      this.$el
      .html(getSuggestionsHtml.apply(this, args))
      .prepend(that.templates.header ? getHeaderHtml.apply(this, args) : null)
      .append(that.templates.footer ? getFooterHtml.apply(this, args) : null);
    }

    this.trigger('rendered');

    function getEmptyHtml() {
      var args = [].slice.call(arguments, 0);
      args = [{ query: query, isEmpty: true }].concat(args);
      return that.templates.empty.apply(this, args);
    }

    function getSuggestionsHtml() {
      var args = [].slice.call(arguments, 0);
      var $suggestions;
      var nodes;

      $suggestions = $(html.suggestions).css(css.suggestions);

      // jQuery#append doesn't support arrays as the first argument
      // until version 1.8, see http://bugs.jquery.com/ticket/11231
      nodes = _.map(suggestions, getSuggestionNode);
      $suggestions.append.apply($suggestions, nodes);

      return $suggestions;

      function getSuggestionNode(suggestion) {
        var $el;

        $el = $(html.suggestion)
        .append(that.templates.suggestion.apply(this, [suggestion].concat(args)))
        .data(datasetKey, that.name)
        .data(valueKey, that.displayFn(suggestion))
        .data(datumKey, suggestion);

        $el.children().each(function() { $(this).css(css.suggestionChild); });

        return $el;
      }
    }

    function getHeaderHtml() {
      var args = [].slice.call(arguments, 0);
      args = [{ query: query, isEmpty: !hasSuggestions }].concat(args);
      return that.templates.header.apply(this, args);
    }

    function getFooterHtml() {
      var args = [].slice.call(arguments, 0);
      args = [{ query: query, isEmpty: !hasSuggestions }].concat(args);
      return that.templates.footer.apply(this, args);
    }
  },

  // ### public

  getRoot: function getRoot() {
    return this.$el;
  },

  update: function update(query) {
    var that = this;

    this.query = query;
    this.canceled = false;
    this.source(query, render);

    function render(suggestions) {
      // if the update has been canceled or if the query has changed
      // do not render the suggestions as they've become outdated
      if (!that.canceled && query === that.query) {
        // concat all the other arguments that could have been passed
        // to the render function, and forward them to _render
        var args = [].slice.call(arguments, 1);
        args = [query, suggestions].concat(args);
        that._render.apply(that, args);
      }
    }
  },

  cancel: function cancel() {
    this.canceled = true;
  },

  clear: function clear() {
    this.cancel();
    this.$el.empty();
    this.trigger('rendered');
  },

  isEmpty: function isEmpty() {
    return this.$el.is(':empty');
  },

  destroy: function destroy() {
    this.$el = null;
  }
});

// helper functions
// ----------------

function getDisplayFn(display) {
  display = display || 'value';

  return _.isFunction(display) ? display : displayFn;

  function displayFn(obj) { return obj[display]; }
}

function getTemplates(templates, displayFn) {
  return {
    empty: templates.empty && _.templatify(templates.empty),
    header: templates.header && _.templatify(templates.header),
    footer: templates.footer && _.templatify(templates.footer),
    suggestion: templates.suggestion || suggestionTemplate
  };

  function suggestionTemplate(context) {
    return '<p>' + displayFn(context) + '</p>';
  }
}

function isValidName(str) {
  // dashes, underscores, letters, and numbers
  return (/^[_a-zA-Z0-9-]+$/).test(str);
}

module.exports = Dataset;
