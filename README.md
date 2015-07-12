[![build status](https://secure.travis-ci.org/algolia/autocomplete.js.png?branch=master)](http://travis-ci.org/algolia/autocomplete.js)

[![Browser tests](https://saucelabs.com/browser-matrix/opensauce-algolia.svg)](https://saucelabs.com/u/opensauce-algolia)

Autocomplete.js
=================

This JavaScript library adds a fast and fully-featured auto-completion menu to your search box displaying results "as you type". It can be easily combined with Algolia's realtime search engine. The library is available as a jQuery plugin.

Table of Contents
-----------------

* [Features](#features)
* [Usage](#usage)
  * [API](#api)
  * [Options](#options)
  * [Datasets](#datasets)
  * [Custom Events](#custom-events)
  * [Look and Feel](#look-and-feel)
* [Specification](#specification)
* [Testing](#testing)
* [Credits](#credits)

Features
--------

* Displays suggestions to end-users as they type
* Shows top suggestion as a hint (i.e. background text)
* Supports custom templates to allow for UI flexibility
* Works well with RTL languages and input method editors
* Triggers custom events

Usage
-----

### API

#### jQuery#autocomplete(options, [\*datasets])

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

#### jQuery#autocomplete('destroy')

Removes the autocomplete functionality and reverts the `input` element back to its 
original state.

```javascript
$('.search-input').autocomplete('destroy');
```

#### jQuery#autocomplete('open')

Opens the dropdown menu of the autocomplete. Note that being open does not mean that
the menu is visible. The menu is only visible when it is open and has content.

```javascript
$('.search-input').autocomplete('open');
```

#### jQuery#autocomplete('close')

Closes the dropdown menu of the autocomplete.

```javascript
$('.search-input').autocomplete('close');
```

#### jQuery#autocomplete('val')

Returns the current value of the autocomplete. The value is the text the user has 
entered into the `input` element.

```javascript
var myVal = $('.search-input').autocomplete('val');
```

#### jQuery#autocomplete('val', val)

Sets the value of the autocomplete. This should be used in place of `jQuery#val`.

```javascript
$('.search-input').autocomplete('val', myVal);
```

#### jQuery.fn.autocomplete.noConflict()

Returns a reference to the autocomplete plugin and reverts `jQuery.fn.autocomplete` 
to its previous value. Can be used to avoid naming collisions. 

```javascript
var autocomplete = jQuery.fn.autocomplete.noConflict();
jQuery.fn._typeahead = autocomplete;
```

### Options

When initializing an autocomplete, there are a number of options you can configure.

* `hint` – If `false`, the autocomplete will not show a hint. Defaults to `true`.

* `minLength` – The minimum character length needed before suggestions start 
  getting rendered. Defaults to `1`.

### Datasets

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
  Can be either a HTML string or a precompiled template. If it's a precompiled
  template, the passed in context will contain `query`.

  * `footer`– Rendered at the bottom of the dataset. Can be either a HTML 
  string or a precompiled template. If it's a precompiled template, the passed 
  in context will contain `query` and `isEmpty`.

  * `header` – Rendered at the top of the dataset. Can be either a HTML string 
  or a precompiled template. If it's a precompiled template, the passed in 
  context will contain `query` and `isEmpty`.

  * `suggestion` – Used to render a single suggestion. If set, this has to be a 
  precompiled template. The associated suggestion object will serve as the 
  context. Defaults to the value of `displayKey` wrapped in a `p` tag i.e. 
  `<p>{{value}}</p>`.

### Custom Events

The autocomplete component triggers the following custom events.

* `autocomplete:opened` – Triggered when the dropdown menu of the autocomplete is 
  opened.

* `autocomplete:closed` – Triggered when the dropdown menu of the autocomplete is 
  closed.

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

### Look and Feel

Below is a faux mustache template describing the DOM structure of an autocomplete 
dropdown menu. Keep in mind that `header`, `footer`, `suggestion`, and `empty` 
come from the provided templates detailed [here](#datasets). 

```html
<span class="aa-dropdown-menu">
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

When an end-user mouses or keys over a `.aa-suggestion`, the class `aa-cursor` 
will be added to it. You can use this class as a hook for styling the "under 
cursor" state of suggestions.

Specification
-------------

In an effort to take advantage of the pre-existing knowledge of autocomplete.js 
users, the behavior of the typeahead.js UI is modeled after google.com's search 
box. Below is pseudocode that details how the UI reacts to pertinent events.

**Input Control Gains Focus**

```
activate typeahead
```

**Input Control Loses Focus**

```
deactivate typeahead
close dropdown menu
remove hint
clear suggestions from dropdown menu
```

**Value of the Input Control Changes**

```
IF query satisfies minLength requirement THEN
  request suggestions for new query

  IF suggestions are available THEN
    render suggestions in dropdown menu
    open dropdown menu 
    update hint
  ELSE
    close dropdown menu 
    clear suggestions from dropdown menu
    remove hint
  ENDIF
ELSE
  close dropdown menu 
  clear suggestions from dropdown menu
  remove hint
ENDIF
```

**Up Arrow is Keyed**

```
IF dropdown menu is open THEN
  move dropdown menu cursor up 1 suggestion
ELSE
  request suggestions for current query

  IF suggestions are available THEN
    render suggestions in dropdown menu
    open dropdown menu 
    update hint
  ENDIF
ENDIF
```

**Down Arrow is Keyed**

```
IF dropdown menu is open THEN
  move dropdown menu cursor down 1 suggestion
ELSE
  request suggestions for current query

  IF suggestions are available THEN
    render suggestions in dropdown menu
    open dropdown menu 
    update hint
  ENDIF
ENDIF
```

**Left Arrow is Keyed**

```
IF detected query language direction is right-to-left THEN
  IF hint is being shown THEN
    IF text cursor is at end of query THEN
      autocomplete query to hint
    ENDIF
  ENDIF
ENDIF
```

**Right Arrow is Keyed**

```
IF detected query language direction is left-to-right THEN
  IF hint is being shown THEN
    IF text cursor is at the end of the query THEN
      autocomplete query to hint
    ENDIF
  ENDIF
ENDIF
```

**Tab is Keyed**

```
IF dropdown menu cursor is on suggestion THEN
  close dropdown menu
  update query to display key of suggestion
  remove hint
ELSIF hint is being shown THEN
  autocomplete query to hint
ENDIF
```

**Enter is Keyed**

```
IF dropdown menu cursor is on suggestion THEN
  close dropdown menu
  update query to display key of suggestion
  remove hint
  prevent default browser action e.g. form submit
ENDIF
```

**Esc is Keyed**

```
close dropdown menu
remove hint
```

**Suggestion is Clicked**

```
update query to display key of suggestion
close dropdown menu
remove hint
```

Testing
------

Unit tests are written using [Jasmine](http://jasmine.github.io/) and ran with [Karma](http://karma-runner.github.io/). Integration tests uses [Mocha](http://mochajs.org/) and [Saucelabs](https://saucelabs.com/).

To run the unit tests suite run:

```sh
$ npm test
```

To run the integration tests suite run:

```sh
$ grunt
$ grunt server
$ ngrok 8888
$ TEST_HOST=http://YOUR_NGROK_ID.ngrok.com SAUCE_ACCESS_KEY=YOUR_KEY SAUCE_USERNAME=YOUR_USERNAME./node_modules/mocha/bin/mocha --harmony -R spec ./test/integration/test.js
```

Credits
--------

This library has originally been forked from [Twitter's typeahead.js](https://github.com/twitter/typeahead.js) library. 
