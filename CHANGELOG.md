Changelog
==========

For transparency and insight into our release cycle, releases will be numbered 
with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/.

---

### 0.16.0 Dec 11, 2015

* Emit a new `autocomplete:updated` event as soon as a dataset is rendered

### 0.15.0 Dec 10, 2015

* Ability to configure the dropdown menu container

### 0.14.1 Dec 2, 2015

* Move Zepto as a dependency (not a peer dep)
* Really use the `query` instead of the `displayKey` (was supposed to be fixed in 0.11.0)

### 0.14.0 Nov 28, 2015

* Move npm-zepto & angular to peerDependencies
* Fixed custom dropdownMenu's footer & header not being displayed properly
* Allow dataset with name=0

### 0.13.1 Nov 25, 2015

* Move the bower release name to `algolia-autocomplete.js` since `autocomplete.js` is already used

### 0.13.0 Nov 25, 2015

* Add Bower release

### 0.12.0 Oct 15, 2015

* Expose the underlying `close`, `open`, ... functions in the standalone build.

### 0.11.1 Oct 13, 2015

* Zepto doesn't work like jQuery regarding the `data` API, it doesn't support serializing objects.

### 0.11.0 Oct 07, 2015

* If the `displayKey` is not specified and the `value` attribute missing, don't update the input value with `undefined`.
* Expose the `sources` object in the Angular.js build as well.

### 0.10.0 Oct 06, 2015

* Add a new `includeAll` option to the `popularIn` source to add an extra suggestion.

### 0.9.0 Oct 01, 2015

* Full CommonJS compliance (moved from browserify to webpack)

### 0.8.0 Sep 24, 2015

* UMD compliance

### 0.7.0 Sep 16, 2015

* New standalone build (including Zepto.js)
* Get rid of lodash-compat and use jQuery, Zepto or Angular.js's helper functions

### 0.6.0 Sep 11, 2015

* Add Zepto.js support.

### 0.5.0 Sep 9, 2015

* The wrapper span will now have a `table-cell` display if the original input was a `block` inside a `table`.

### 0.4.0 Aug 12, 2015

* Add a new `openOnFocus` option to open the dropdown menu when the input is focused

### 0.3.0 July 27, 2015

* Add Angular.js support [#7]

### 0.2.0 July 16, 2015

* Ability to change the layout based on the matching datasets [#11]

### 0.1.0 July 13, 2015

* Start using semantic versioning

### 0.0.2 July 13, 2015

* Ability to keep the dropdown menu opened when the input if blurred [#1]
* Ability to use a custom dropdown menu template [#2]
* Ability to configure a custom header/footer on the dropdown menu [#3]

### 0.0.1 July 12, 2015

* First release based on Twitter's typeahead.js library
* Travis-ci.org, Coveralls.io, Saucelabs.com integration
* CommonJS compatibility
