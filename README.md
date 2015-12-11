Autocomplete.js
=================

This JavaScript library adds a fast and fully-featured auto-completion menu to your search box displaying results "as you type". It can easily be combined with Algolia's realtime search engine. The library is available as a jQuery plugin, an Angular.js directive or a standalone library.

[![build status](https://travis-ci.org/algolia/algoliasearch-client-node.svg?branch=master)](http://travis-ci.org/algolia/autocomplete.js)
[![NPM version](https://badge.fury.io/js/autocomplete.js.svg)](http://badge.fury.io/js/autocomplete.js)
[![Coverage Status](https://coveralls.io/repos/algolia/autocomplete.js/badge.svg?branch=master)](https://coveralls.io/r/algolia/autocomplete.js?branch=master)
![jQuery](https://img.shields.io/badge/jQuery-OK-blue.svg)
![Zepto.js](https://img.shields.io/badge/Zepto.js-OK-blue.svg)
![Zepto.js](https://img.shields.io/badge/Angular.js-OK-blue.svg)

[![Browser tests](https://saucelabs.com/browser-matrix/opensauce-algolia.svg)](https://saucelabs.com/u/opensauce-algolia)

Table of Contents
-----------------

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
  * [Quick Start](#quick-start)
  * [Options](#options)
  * [Look and Feel](#look-and-feel)
  * [Datasets](#datasets)
  * [Sources](#sources)
  * [Custom Events](#custom-events)
  * [API](#api)
* [Development](#development)
* [Testing](#testing)
* [Credits](#credits)

Features
--------

* Displays suggestions to end-users as they type
* Shows top suggestion as a hint (i.e. background text)
* Supports custom templates to allow for UI flexibility
* Works well with RTL languages and input method editors
* Triggers custom events


Installation
-------------

The `autocomplete.js` library must be included **after** jQuery, Zepto or Angular.js.

#### From a CDN

We recommend including it from a CDN:

##### jsDelivr

```html
<script src="//cdn.jsdelivr.net/autocomplete.js/0/autocomplete.min.js"></script>
<!-- OR -->
<script src="//cdn.jsdelivr.net/autocomplete.js/0/autocomplete.jquery.min.js"></script>
<!-- OR -->
<script src="//cdn.jsdelivr.net/autocomplete.js/0/autocomplete.angular.min.js"></script>
```

##### cdnjs

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/autocomplete.js/<VERSION>/autocomplete.min.js"></script>
<!-- OR -->
<script src="//cdnjs.cloudflare.com/ajax/libs/autocomplete.js/<VERSION>/autocomplete.jquery.min.js"></script>
<!-- OR -->
<script src="//cdnjs.cloudflare.com/ajax/libs/autocomplete.js/<VERSION>/autocomplete.angular.min.js"></script>
```

#### From Bower

```sh
bower install algolia-autocomplete.js -S
```

#### From the sources

Or you can fetch the sources:

##### Build/Dist

You can find the builded version in [dist/](https://github.com/algolia/autocomplete.js/tree/master/dist).

##### Browserify

You can require it and use [Browserify](http://browserify.org/):

```js
var autocomplete = require('autocomplete.js');
```

Usage
-----

#### Quick Start

To turn any HTML `<input />` into a simple and fast as-you-type auto-completion menu following one of the 2 next sections:

##### Standalone

 1. Include `autocomplete.min.js`
 1. Initialize the auto-completion menu calling the `autocomplete` function

```html
<input type="text" id="search-input" />

<!-- [ ... ] -->
<script src="//cdn.jsdelivr.net/algoliasearch/3/algoliasearch.min.js"></script>
<script src="//cdn.jsdelivr.net/autocomplete.js/0/autocomplete.min.js"></script>
<script>
  var client = algoliasearch('YourApplicationID', 'YourSearchOnlyAPIKey')
  var index = client.initIndex('YourIndex');
  autocomplete('#search-input', { hint: false }, [
    {
      source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
      displayKey: 'my_attribute',
      templates: {
        suggestion: function(suggestion) {
          return suggestion._highlightResult.my_attribute.value;
        }
      }
    }
  ]).on('autocomplete:selected', function(event, suggestion, dataset) {
    console.log(suggestion, dataset);
  });
</script>
```

##### With jQuery

 1. Include `autocomplete.jquery.min.js` after including `jQuery`
 1. Initialize the auto-completion menu calling the `autocomplete` jQuery plugin

```html
<input type="text" id="search-input" />

<!-- [ ... ] -->
<script src="//cdn.jsdelivr.net/algoliasearch/3/algoliasearch.min.js"></script>
<script src="//cdn.jsdelivr.net/autocomplete.js/0/autocomplete.jquery.min.js"></script>
<script>
  var client = algoliasearch('YourApplicationID', 'YourSearchOnlyAPIKey')
  var index = client.initIndex('YourIndex');
  $('#search-input').autocomplete({ hint: false }, [
    {
      source: $.fn.autocomplete.sources.hits(index, { hitsPerPage: 5 }),
      displayKey: 'my_attribute',
      templates: {
        suggestion: function(suggestion) {
          return suggestion._highlightResult.my_attribute.value;
        }
      }
    }
  ]).on('autocomplete:selected', function(event, suggestion, dataset) {
    console.log(suggestion, dataset);
  });
</script>
```

##### With Angular.js

 1. Include `autocomplete.angular.min.js` after including `jQuery` & `Angular.js`
 1. Inject the `algolia.autocomplete` module
 1. Add the `autocomplete`, `aa-datasets` and the optional `aa-options` attribute to your search bar

```html
<div ng-controller="yourController">
  <input type="text" id="search-input" autocomplete aa-datasets="getDatasets()" />
</div>

<!-- [ ... ] -->
<script src="//cdn.jsdelivr.net/algoliasearch/3/algoliasearch.angular.min.js"></script>
<script src="//cdn.jsdelivr.net/autocomplete.js/0/autocomplete.angular.min.js"></script>
<script>
  angular.module('myApp', ['algoliasearch', 'algolia.autocomplete'])
    .controller('yourController', ['$scope', 'algolia', function($scope, algolia) {
      var client = algolia.Client('YourApplicationID', 'YourSearchOnlyAPIKey');
      var index = client.initIndex('YourIndex');

      $scope.getDatasets = function() {
        return {
          source: algolia.sources.hits(index, { hitsPerPage: 5 }),
          displayKey: 'my_attribute',
          templates: {
            suggestion: function(suggestion) {
              return suggestion._highlightResult.my_attribute.value;
            }
          }
        };
      };

      $scope.$on('autocomplete:selected', function(event, suggestion, dataset) {
        console.log(suggestion, dataset);
      });
    }]);
</script>
```

#### Look and Feel

Below is a faux mustache template describing the DOM structure of an autocomplete 
dropdown menu. Keep in mind that `header`, `footer`, `suggestion`, and `empty` 
come from the provided templates detailed [here](#datasets). 

```html
<span class="aa-dropdown-menu{{#datasets}} aa-{{'with' or 'without'}}-{{name}}{{/datasets}}">
  {{#datasets}}
    <div class="aa-dataset-{{name}}">
      {{{header}}}
      <span class="aa-suggestions">
        {{#suggestions}}
          <div class="aa-suggestion">{{{suggestion}}}</div>
        {{/suggestions}}
        {{^suggestions}}
          {{{empty}}}
        {{/suggestions}}
      </span>
      {{{footer}}}
    </div>
  {{/datasets}}
</span>
```

When an end-user mouses or keys over a `.aa-suggestion`, the class `aa-cursor` will be added to it. You can use this class as a hook for styling the "under cursor" state of suggestions.


Add the following CSS rules to add a default style:

```css
.algolia-autocomplete {
  width: 100%;
}
.algolia-autocomplete .aa-input, .algolia-autocomplete .aa-hint {
  width: 100%;
}
.algolia-autocomplete .aa-hint {
  color: #999;
}
.algolia-autocomplete .aa-dropdown-menu {
  width: 100%;
  background-color: #fff;
  border: 1px solid #999;
  border-top: none;
}
.algolia-autocomplete .aa-dropdown-menu .aa-suggestion {
  cursor: pointer;
  padding: 5px 4px;
}
.algolia-autocomplete .aa-dropdown-menu .aa-suggestion.aa-cursor {
  background-color: #B2D7FF;
}
.algolia-autocomplete .aa-dropdown-menu .aa-suggestion em {
  font-weight: bold;
  font-style: normal;
}
```

Here is what the [basic example](https://github.com/algolia/autocomplete.js/tree/master/examples) looks like:

![Basic example](./examples/basic.gif)


#### Options

When initializing an autocomplete, there are a number of options you can configure.

* `autoselect` – If `true`, pressing `<ENTER>` in the search bar will automatically select the first suggestion.

* `hint` – If `false`, the autocomplete will not show a hint. Defaults to `true`.

* `debug` – If `true`, the autocomplete will not close on `blur`. Defaults to `false`.

* `openOnFocus` – If `true`, the dropdown menu will open when the input is focused. Defaults to `false`.

* `dropdownMenuContainer` – If set with a DOM selector, it overrides the container of the dropdown menu.

* `templates` – An optional hash overriding the default templates.
  * `dropdownMenu` – the dropdown menu template. The template should include all *dataset* placeholders.
  * `header` – the header to prepend to the dropdown menu
  * `footer` – the footer to append to the dropdown menu

```html
<script type="text/template" id="my-custom-menu-template">
  <div class="my-custom-menu">
    <div class="row">
      <div class="col-sm-6">
        <div class="aa-dataset-d1"></div>
      </div>
      <div class="col-sm-6">
        <div class="aa-dataset-d2"></div>
        <div class="aa-dataset-d3"></div>
      </div>
    </div>
  </div>
</script>

<script>
  $('#search-input').autocomplete(
    {
      templates: {
        dropdownMenu: '#my-custom-menu-template',
        footer: '<div class="branding">Powered by <img src="https://www.algolia.com/assets/algolia128x40.png" /></div>'
      }
    },
    [
      {
        source: $.fn.autocomplete.sources.hits(index1, { hitsPerPage: 5 }),
        name: 'd1',
        templates: {
          header: '<h4>List 1</h4>',
          suggestion: function(suggestion) {
            // FIXME
          }
        }
      },
      {
        source: $.fn.autocomplete.sources.hits(index2, { hitsPerPage: 2 }),
        name: 'd2',
        templates: {
          header: '<h4>List 2</h4>',
          suggestion: function(suggestion) {
            // FIXME
          }
        }
      },
      {
        source: $.fn.autocomplete.sources.hits(index3, { hitsPerPage: 2 }),
        name: 'd3',
        templates: {
          header: '<h4>List 3</h4>',
          suggestion: function(suggestion, answer) {
            // FIXME
          }
        }
      }
    ]
  );
</script>
```

* `minLength` – The minimum character length needed before suggestions start 
  getting rendered. Defaults to `1`.

#### Datasets

An autocomplete is composed of one or more datasets. When an end-user modifies the
value of the underlying input, each dataset will attempt to render suggestions for the
new value.

Datasets can be configured using the following options.

* `source` – The backing data source for suggestions. Expected to be a function 
  with the signature `(query, cb)`. It is expected that the function will 
  compute the suggestion set (i.e. an array of JavaScript objects) for `query` 
  and then invoke `cb` with said set. `cb` can be invoked synchronously or 
  asynchronously.

* `name` – The name of the dataset. This will be appended to `tt-dataset-` to 
  form the class name of the containing DOM element.  Must only consist of 
  underscores, dashes, letters (`a-z`), and numbers. Defaults to a random 
  number.

* `displayKey` – For a given suggestion object, determines the string 
  representation of it. This will be used when setting the value of the input
  control after a suggestion is selected. Can be either a key string or a 
  function that transforms a suggestion object into a string. Defaults to 
  `value`.

* `templates` – A hash of templates to be used when rendering the dataset. Note
  a precompiled template is a function that takes a JavaScript object as its
  first argument and returns a HTML string.

  * `empty` – Rendered when `0` suggestions are available for the given query. 
  Can be either a HTML string or a precompiled template. The templating function
  is called with a context containing `query`, `isEmpty`, and any optional
  arguments that may have been forwarded by the source:
  `function emptyTemplate({ query, isEmpty }, [forwarded args])`.

  * `footer`– Rendered at the bottom of the dataset. Can be either a HTML 
  string or a precompiled template. The templating function
  is called with a context containing `query`, `isEmpty`, and any optional
  arguments that may have been forwarded by the source:
  `function footerTemplate({ query, isEmpty }, [forwarded args])`.

  * `header` – Rendered at the top of the dataset. Can be either a HTML string 
  or a precompiled template. The templating function
  is called with a context containing `query`, `isEmpty`, and any optional
  arguments that may have been forwarded by the source:
  `function headerTemplate({ query, isEmpty }, [forwarded args])`.

  * `suggestion` – Used to render a single suggestion. The templating function
  is called with the `suggestion`, and any optional arguments that may have
  been forwarded by the source: `function suggestionTemplate(suggestion, [forwarded args])`.
  Defaults to the value of `displayKey` wrapped in a `p` tag i.e. `<p>{{value}}</p>`.


#### Sources

A few helpers are provided by default to ease the creation of Algolia-based sources.

##### Hits

To build a source based on Algolia's `hits` array, just use:

```js
{
  source: autocomplete.sources.hits(indexObj, { hitsPerPage: 2 }),
  templates: {
    suggestion: function(suggestion, answer) {
      // FIXME
    }
  }
}
```

##### PopularIn (aka "xxxxx in yyyyy")

To build an Amazon-like autocomplete menu, suggesting popular queries and for the most popular one displaying the associated categories, you can use the `popularIn` source:

```js
{
  source: autocomplete.sources.popularIn(popularQueriesIndexObj, { hitsPerPage: 3 }, {
    source: 'sourceAttribute',           // attribute of the `popularQueries` index use to query the `index` index
    index: productsIndexObj,             // targeted index
    facets: 'facetedCategoryAttribute',  // facet used to enrich the most popular query
    maxValuesPerFacet: 3                 // maximum number of facets returned
  }, {
    includeAll: true,                    // should it include an extra "All department" suggestion
    allTitle: 'All departments'          // the included category label
  }),
  templates: {
    suggestion: function(suggestion, answer) {
      var value = suggestion.sourceAttribute;
      if (suggestion.facet) {
        // this is the first suggestion
        // and it has been enriched with the matching facet
        value += ' in ' + suggestion.facet.value + ' (' + suggestion.facet.count + ')';
      }
      return value;
    }
  }
}
```

##### Advanced use

The `source` options can also take a function. It enables you to have more control of the results returned by Algolia search. The function `function(query, callback)` takes 2 parameters
  * `query: String`: the text typed in the autocomplete
  * `callback: Function`: the callback to call at the end of your processing

```
var hitsSource = autocomplete.sources.hits(index, { hitsPerPage: 5 });

templates: {
  source: function(query, callback) {
    hitsSource(query, function(suggestions) {
        //Do stuff with the array of returned suggestions
        console.log(suggestions);
        callback(suggestions);
    });
  },
}

```

#### Custom Events

The autocomplete component triggers the following custom events.

* `autocomplete:opened` – Triggered when the dropdown menu of the autocomplete is 
  opened.

* `autocomplete:closed` – Triggered when the dropdown menu of the autocomplete is 
  closed.

* `autocomplete:updated` – Triggered when a dataset is rendered.

* `autocomplete:cursorchanged` – Triggered when the dropdown menu cursor is moved
  to a different suggestion. The event handler will be invoked with 3 
  arguments: the jQuery event object, the suggestion object, and the name of 
  the dataset the suggestion belongs to.

* `autocomplete:selected` – Triggered when a suggestion from the dropdown menu is 
  selected. The event handler will be invoked with 3 arguments: the jQuery 
  event object, the suggestion object, and the name of the dataset the 
  suggestion belongs to.

* `autocomplete:autocompleted` – Triggered when the query is autocompleted. 
  Autocompleted means the query was changed to the hint. The event handler will 
  be invoked with 3 arguments: the jQuery event object, the suggestion object, 
  and the name of the dataset the suggestion belongs to. 

All custom events are triggered on the element initialized as the autocomplete.

#### API

##### jQuery#autocomplete(options, [\*datasets])

Turns any `input[type="text"]` element into an auto-completion menu. `options` is an 
options hash that's used to configure the autocomplete to your liking. Refer to 
[Options](#options) for more info regarding the available configs. Subsequent 
arguments (`*datasets`), are individual option hashes for datasets. For more 
details regarding datasets, refer to [Datasets](#datasets).

```javascript
$('.search-input').autocomplete({
  minLength: 3
},
{
  name: 'my-dataset',
  source: mySource
});
```

##### jQuery#autocomplete('destroy')

Removes the autocomplete functionality and reverts the `input` element back to its 
original state.

```javascript
$('.search-input').autocomplete('destroy');
```

##### jQuery#autocomplete('open')

Opens the dropdown menu of the autocomplete. Note that being open does not mean that
the menu is visible. The menu is only visible when it is open and has content.

```javascript
$('.search-input').autocomplete('open');
```

##### jQuery#autocomplete('close')

Closes the dropdown menu of the autocomplete.

```javascript
$('.search-input').autocomplete('close');
```

##### jQuery#autocomplete('val')

Returns the current value of the autocomplete. The value is the text the user has 
entered into the `input` element.

```javascript
var myVal = $('.search-input').autocomplete('val');
```

##### jQuery#autocomplete('val', val)

Sets the value of the autocomplete. This should be used in place of `jQuery#val`.

```javascript
$('.search-input').autocomplete('val', myVal);
```

##### jQuery.fn.autocomplete.noConflict()

Returns a reference to the autocomplete plugin and reverts `jQuery.fn.autocomplete` 
to its previous value. Can be used to avoid naming collisions. 

```javascript
var autocomplete = jQuery.fn.autocomplete.noConflict();
jQuery.fn._autocomplete = autocomplete;

```

#### Standalone version

The standalone version API is similiar to jQuery's:

```
var search = autocomplete('#search', { hint: false }, [{
  source: autocomplete.sources.hits(index, { hitsPerPage: 5 }
}]);

search.autocomplete.open();
search.autocomplete.close();
search.autocomplete.getVal();
search.autocomplete.setVal('Hey Jude');
search.autocomplete.destroy();
```

You can also pass a custom Typeahead instance in Autocomplete.js constructor:

```
var search = autocomplete('#search', { hint: false}, [{ ... }], new Typeahead({ ... }));
```

You can always interact with Typeahead object by using the ```typeahead``` property:

```
search.autocomplete.typeahead;
```

Development
-----------

To start developing, you can use the following commands:

```sh
$ npm install
$ npm run dev
$ open http://localhost:8888/test/playground.html
```

Linting is done with [eslint](http://eslint.org/) and [Algolia's configuration](https://github.com/algolia/eslint-config-algolia) and can be run with:

```sh
$ npm run lint
```

Testing
------

Unit tests are written using [Jasmine](http://jasmine.github.io/) and ran with [Karma](http://karma-runner.github.io/). Integration tests are using [Mocha](http://mochajs.org/) and [Saucelabs](https://saucelabs.com/).

To run the unit tests suite run:

```sh
$ npm test
```

To run the integration tests suite run:

```sh
$ npm run build
$ npm run server
$ ngrok 8888
$ TEST_HOST=http://YOUR_NGROK_ID.ngrok.com SAUCE_ACCESS_KEY=YOUR_KEY SAUCE_USERNAME=YOUR_USERNAME./node_modules/mocha/bin/mocha --harmony -R spec ./test/integration/test.js
```

Credits
--------

This library has originally been forked from [Twitter's typeahead.js](https://github.com/twitter/typeahead.js) library. 
