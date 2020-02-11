# [1.0.0-alpha.10](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-01-09)


### Bug Fixes

* **Autocomplete:** merge Navigator API options with defaults ([3515aa6](https://github.com/algolia/autocomplete.js/commit/3515aa67d2ecfb0b4140fb3d599e15f9ef06440a))
* **onInput:** don't call `getSuggestions` when querying spaces ([9b33e10](https://github.com/algolia/autocomplete.js/commit/9b33e1054ef0778d6a55826ed9b2768297b18879))
* **showCompletion:** do not show completion if query is the same as completion ([0f0404d](https://github.com/algolia/autocomplete.js/commit/0f0404dedf35167d226847a955137deeaba9eb09))


### Reverts

* refactor(onReset): focus input after `onInput` ([34c3e4f](https://github.com/algolia/autocomplete.js/commit/34c3e4f3ba3ac60906112fab9890c0384cb1c1ce))



# [1.0.0-alpha.9](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2019-11-19)


### Bug Fixes

* **autocomplete:** add `replaceNode` for Preact to reuse the same element ([156c25a](https://github.com/algolia/autocomplete.js/commit/156c25a6e76b4c322d2ff18114f531210ffa78d4)), closes [/github.com/preactjs/preact/blob/3a8b14f5b2d8fdc7998ba6333c25b3dc3a2ae6fd/src/render.js#L13](https://github.com//github.com/preactjs/preact/blob/3a8b14f5b2d8fdc7998ba6333c25b3dc3a2ae6fd/src/render.js/issues/L13)
* **onFocus:** do not trigger `onInput` when focusing with same query ([ca603eb](https://github.com/algolia/autocomplete.js/commit/ca603eb3197ee5b214b1e11c126b092822a29a2f))


### Features

* **shouldDropdownOpen:** introduce option to open the menu programmatically ([#8](https://github.com/algolia/autocomplete.js/issues/8)) ([962e99e](https://github.com/algolia/autocomplete.js/commit/962e99ebf1e3a548a7441127531f07679f38e23e)), closes [#5](https://github.com/algolia/autocomplete.js/issues/5)
* **shouldDropdownOpen:** reverse behavior to work with empty results by default ([6235c1d](https://github.com/algolia/autocomplete.js/commit/6235c1d0fc264d7c290cd7909567ffde560d17bb))



# [1.0.0-alpha.8](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2019-11-18)


### Features

* **getDropdownPosition:** add feature to position the dropdown ([3449a40](https://github.com/algolia/autocomplete.js/commit/3449a40bd1afa0ad9c952f096839e54b2d6d901b))



# [1.0.0-alpha.7](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2019-11-18)


### Bug Fixes

* **Dropdown:** compute right position based on client width ([83fc49e](https://github.com/algolia/autocomplete.js/commit/83fc49e606baec232a3351ac0a922117ff01e49c))


### Reverts

* chore: release v1.0.0-alpha.7 ([#9](https://github.com/algolia/autocomplete.js/issues/9)) ([1516eef](https://github.com/algolia/autocomplete.js/commit/1516eef6b9e7ab2cb3a5c76ee9dca2c1651921e0))



# [1.0.0-alpha.6](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2019-11-13)


### Bug Fixes

* **Autocomplete:** convert to Preact elements when using `transformResultsRender` ([d3fd224](https://github.com/algolia/autocomplete.js/commit/d3fd224aef887dc2e9d1325f7c53abc53739fb39))



# [1.0.0-alpha.5](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2019-11-13)


### Bug Fixes

* **Autocomplete:** fix inconsistent query state on reset ([c033d85](https://github.com/algolia/autocomplete.js/commit/c033d85b58830b5d9eca08b861f967889be30d49))
* **Navigator:** open in new window with `noopener` ([384bf55](https://github.com/algolia/autocomplete.js/commit/384bf5524a799ba08ccd4ae28d3e32e2fbdf327b))


### Features

* **dropdown:** inject custom classNames to rendered sources ([e781560](https://github.com/algolia/autocomplete.js/commit/e781560bee1097bddb43f69f158f746059c5d849))



# [1.0.0-alpha.4](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2019-11-12)


### Bug Fixes

* **Template:** support React elements ([be614ac](https://github.com/algolia/autocomplete.js/commit/be614aca8f3ce9caa07a93ae0b46fca6a29f7838))



# [1.0.0-alpha.3](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2019-11-12)


### Bug Fixes

* **Dropdown:** add React keys ([8f5ca9b](https://github.com/algolia/autocomplete.js/commit/8f5ca9b4af439ab767ce5da0c0ad9630f198c447))
* **SearchBox:** convert SVG attributes to props ([ba7fae4](https://github.com/algolia/autocomplete.js/commit/ba7fae40e236c9ab94f9ccc04c945568f45479a1))
* fix linting issues ([5bdab0c](https://github.com/algolia/autocomplete.js/commit/5bdab0c04b88f14f9c3787309dd5b72d2c10f746))
* prevent default Downshift event on special key down and click ([3f672a6](https://github.com/algolia/autocomplete.js/commit/3f672a67ef376ea41ba42af71c55ebed42dbaf64))
* **SearchBox:** don't prevent default on form reset ([a6a09e0](https://github.com/algolia/autocomplete.js/commit/a6a09e08a6e45859cb97face51b4743adac59c57))
* **sources:** normalize sources when calling `setResult` ([8903aa4](https://github.com/algolia/autocomplete.js/commit/8903aa4d485af384eafc19e2ba0db7c04370511f))


### Features

* **api:** sanitize `getSources()` to add default values ([855b558](https://github.com/algolia/autocomplete.js/commit/855b5582c1dbec45be4ee16cb0b2d47cd2ed0cac))
* **navigator:** introduce Navigator API ([6445db5](https://github.com/algolia/autocomplete.js/commit/6445db59e4f5d0b97290a86d6b43dbeb2d91c010))
* **SearchBox:** allow custom templates ([802e24f](https://github.com/algolia/autocomplete.js/commit/802e24fbe47a23679395a18506987e3b043e4abc))



# [1.0.0-alpha.2](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2019-11-08)



# 1.0.0-alpha.1 (2019-11-08)



<a name="0.37.0"></a>
# [0.37.0](https://github.com/algolia/autocomplete.js/compare/v0.36.0...v0.37.0) (2019-08-30)


### Bug Fixes

* **clear:** Avoid error when clear is called after destroy ([#287](https://github.com/algolia/autocomplete.js/issues/287)) ([244425d](https://github.com/algolia/autocomplete.js/commit/244425d))



<a name="0.36.0"></a>
# [0.36.0](https://github.com/algolia/autocomplete.js/compare/v0.35.0...v0.36.0) (2019-02-21)


### Bug Fixes

* **standalone:** use aria label from input ([#276](https://github.com/algolia/autocomplete.js/issues/276)) ([4b94466](https://github.com/algolia/autocomplete.js/commit/4b94466))



<a name="0.35.0"></a>
# [0.35.0](https://github.com/algolia/autocomplete.js/compare/v0.34.0...v0.35.0) (2018-12-17)


### Bug Fixes

* **chrome-only:** Change autocomplete from 'nope' to 'off' ([#273](https://github.com/algolia/autocomplete.js/issues/273)) ([892a8f0](https://github.com/algolia/autocomplete.js/commit/892a8f0))
* **utils:** correct _.every method ([#274](https://github.com/algolia/autocomplete.js/issues/274)) ([55af1e3](https://github.com/algolia/autocomplete.js/commit/55af1e3))



<a name="0.34.0"></a>
# [0.34.0](https://github.com/algolia/autocomplete.js/compare/v0.33.0...v0.34.0) (2018-12-04)


### Features

* change autocomplete from 'off' to 'nope' ([#250](https://github.com/algolia/autocomplete.js/issues/250)) ([fbbed04](https://github.com/algolia/autocomplete.js/commit/fbbed04))



<a name="0.33.0"></a>
# [0.33.0](https://github.com/algolia/autocomplete.js/compare/v0.32.0...v0.33.0) (2018-11-19)


### Bug Fixes

* **release:** Update mversion to 1.12 ([#268](https://github.com/algolia/autocomplete.js/issues/268)) ([08b8e30](https://github.com/algolia/autocomplete.js/commit/08b8e30))


### Features

* **selected:** Adding context.selectionMethod to selected event ([#267](https://github.com/algolia/autocomplete.js/issues/267)) ([36028a6](https://github.com/algolia/autocomplete.js/commit/36028a6))



<a name="0.32.0"></a>
# [0.32.0](https://github.com/algolia/autocomplete.js/compare/v0.31.0...v0.32.0) (2018-11-06)


### Bug Fixes

* **zepto:** apply patch to prevent an error ([#263](https://github.com/algolia/autocomplete.js/issues/263)) ([917d5a7](https://github.com/algolia/autocomplete.js/commit/917d5a7))


### Features

* **source:** add cache disabling for datasets ([#254](https://github.com/algolia/autocomplete.js/issues/254)) ([0e65fee](https://github.com/algolia/autocomplete.js/commit/0e65fee))
* add flag for toggling tab autocompletion ([#260](https://github.com/algolia/autocomplete.js/issues/260)) ([4dc7c52](https://github.com/algolia/autocomplete.js/commit/4dc7c52))
* Throw err on update if suggestions are invalid type ([#256](https://github.com/algolia/autocomplete.js/issues/256)) ([179febf](https://github.com/algolia/autocomplete.js/commit/179febf)), closes [#131](https://github.com/algolia/autocomplete.js/issues/131)



<a name="0.31.0"></a>
# [0.31.0](https://github.com/algolia/autocomplete.js/compare/v0.30.0...v0.31.0) (2018-08-08)


### Bug Fixes

* **dataset:** avoid to call the source when upadte is canceled ([a47696d](https://github.com/algolia/autocomplete.js/commit/a47696d))
* **dataset:** avoid usage of callNow for debounce ([1a0ce74](https://github.com/algolia/autocomplete.js/commit/1a0ce74))
* Handle an odd case with the user agent ([#242](https://github.com/algolia/autocomplete.js/issues/242)) ([c194736](https://github.com/algolia/autocomplete.js/commit/c194736))


### Features

* update dist files ([9babf2e](https://github.com/algolia/autocomplete.js/commit/9babf2e))
* **clearOnSelected:** allow users to clear the input instead of filling ([#244](https://github.com/algolia/autocomplete.js/issues/244)) ([aa2edbb](https://github.com/algolia/autocomplete.js/commit/aa2edbb)), closes [#241](https://github.com/algolia/autocomplete.js/issues/241)



<a name="0.30.0"></a>
# [0.30.0](https://github.com/algolia/autocomplete.js/compare/v0.29.0...v0.30.0) (2018-04-30)



<a name="0.29.0"></a>
# [0.29.0](https://github.com/algolia/autocomplete.js/compare/v0.28.3...v0.29.0) (2017-10-12)


### Features

* **a11y:** Add ariaLabel option. ([6db8e1b](https://github.com/algolia/autocomplete.js/commit/6db8e1b))
* **a11y:** Add option to control `aria-labelledby` attribute. ([0491c43](https://github.com/algolia/autocomplete.js/commit/0491c43))



<a name="0.28.3"></a>
## [0.28.3](https://github.com/algolia/autocomplete.js/compare/v0.28.2...v0.28.3) (2017-07-31)



<a name="0.28.2"></a>
## [0.28.2](https://github.com/algolia/autocomplete.js/compare/v0.28.1...v0.28.2) (2017-06-22)


### Bug Fixes

* **empty template:** hide main empty template as long as we have results ([344e225](https://github.com/algolia/autocomplete.js/commit/344e225)), closes [#185](https://github.com/algolia/autocomplete.js/issues/185)



<a name="0.28.1"></a>
## [0.28.1](https://github.com/algolia/autocomplete.js/compare/v0.28.0...v0.28.1) (2017-03-29)


### Bug Fixes

* **iOS:** remove double tap bug on hrefs in suggestions ([e532bd8](https://github.com/algolia/autocomplete.js/commit/e532bd8))



<a name="0.28.0"></a>
# [0.28.0](https://github.com/algolia/autocomplete.js/compare/v0.27.0...v0.28.0) (2017-03-24)



<a name="0.27.0"></a>
# [0.27.0](https://github.com/algolia/autocomplete.js/compare/v0.26.0...v0.27.0) (2017-03-06)


### Bug Fixes

* **UA:** add failsafe if params not provided ([30df97a](https://github.com/algolia/autocomplete.js/commit/30df97a)), closes [#166](https://github.com/algolia/autocomplete.js/issues/166)



<a name="0.26.0"></a>
# [0.26.0](https://github.com/algolia/autocomplete.js/compare/v0.25.0...v0.26.0) (2017-02-28)


### Bug Fixes

* **test:** bad handling of no actual inner mechanics of client ([622aec5](https://github.com/algolia/autocomplete.js/commit/622aec5))


### Features

* **algolia agent:** provide an algolia agent when searching ([6ca7ac2](https://github.com/algolia/autocomplete.js/commit/6ca7ac2))
* **algolia agent:** provide an algolia agent when searching ([ef604e1](https://github.com/algolia/autocomplete.js/commit/ef604e1))



<a name="0.25.0"></a>
# [0.25.0](https://github.com/algolia/autocomplete.js/compare/v0.24.2...v0.25.0) (2017-02-07)


### Bug Fixes

* **zepto:** .is() only accepts selectors, reworked code to use pure DOM ([a47a4d4](https://github.com/algolia/autocomplete.js/commit/a47a4d4)), closes [#144](https://github.com/algolia/autocomplete.js/issues/144)



<a name="0.24.2"></a>
## [0.24.2](https://github.com/algolia/autocomplete.js/compare/v0.24.1...v0.24.2) (2017-01-20)


### Bug Fixes

* **dep:** immediate is a dependency, not a devDependency ([22164ad](https://github.com/algolia/autocomplete.js/commit/22164ad))



<a name="0.24.1"></a>
## [0.24.1](https://github.com/algolia/autocomplete.js/compare/v0.24.0...v0.24.1) (2017-01-20)


### Bug Fixes

* **postMessage:** avoid using postMessage when feasible ([a99f664](https://github.com/algolia/autocomplete.js/commit/a99f664)), closes [#142](https://github.com/algolia/autocomplete.js/issues/142)



<a name="0.24.0"></a>
# [0.24.0](https://github.com/algolia/autocomplete.js/compare/0.23.0...v0.24.0) (2017-01-10)


### Bug Fixes

* **angular:** do not launch the directive if autocomplete has a value ([f96a1ba](https://github.com/algolia/autocomplete.js/commit/f96a1ba)), closes [#136](https://github.com/algolia/autocomplete.js/issues/136)
* **typeahead:** propagate redrawn ([82293e4](https://github.com/algolia/autocomplete.js/commit/82293e4))


### Features

* **appendTo:** new parameter ([e40cbd0](https://github.com/algolia/autocomplete.js/commit/e40cbd0))









### 0.23.0 Dec 14, 2016

* feat(build): add noConflict() for standalone build, fixes #133

### 0.22.1 Nov 07, 2016

* Fixes bad behavior when `autoselectOnBlur` used, fixes #113

### 0.22.0 Oct 25, 2016

* Add `autocomplete:cursorremoved` event, see #105
* Add `autoselectOnBlur` option, fixes #113

### 0.21.8 Oct 3, 2016

* Do not allow Zepto to leak to window. Never.

### 0.21.7 Sep 21, 2016

* Ensure the `empty` templates get displayed before the `footer`.
* Ensure the dataset `empty` templates are displayed when all datasets are empty.

### 0.21.6 Sep 20, 2016

* Make sure we don't leak/override `window.Zepto`.

### 0.21.5 Sep 15, 2016

* While selecting the top suggestion (autoselect=true), do not update the input.

### 0.21.4 Sep 2, 2016

* Ensure the cursor selects the first suggestion when the dropdown is shown + send the `cursorchanged` event.

### 0.21.3 Aug 1, 2016

* Ensure empty template displays from first keystroke (#104)

### 0.21.2 July 26, 2016

* fix(empty): fix the empty even handling, fixes #95

### 0.21.1 July 19, 2016

* fix(getVal): fix getVal on standalone build

### 0.21.0 July 15, 2016

* Upgrade to zepto 1.2.0

### 0.20.1 June 14, 2016

* Ensure the dropdown menu is hidden when there is an `$empty` block and blank query.

### 0.20.0 June 04, 2016

* Ensure we don't update the input value on mouseenter (#76)
* Render an `empty` template if no results (#80)

### 0.19.1 May 04, 2016

* Fixed the angular build (_.Event was undefined)

### 0.19.0 Apr 25, 2016

* Allow select handler to prevent menu from being closed (#72)
* Do not trigger the cursorchanged event while entering/leaving nested divs (#71)

### 0.18.0 Apr 07, 2016

* Ability to customize the CSS classes used to render the DOM
* Ensure the `autocomplete:cursorchanged` event is called on `mouseover` as well

### 0.17.3 Apr 04, 2016

* Standalone: ensure we actually use the Zepto object and not whatever is in `window.$`

### 0.17.2 Mar 21, 2016

* Ability to setup the autocomplete on a multi-inputs Zepto selector
* Propagate the `shown` event to the top-level

### 0.17.1 Mar 19, 2016

* REVERT [Ability to setup the autocomplete on a multi-inputs Zepto selector] Fix #59

### 0.17.0 Mar 18, 2016

* Ability to setup the autocomplete on a multi-inputs Zepto selector
* Add a new `shown` event triggered when the dropdown menu is opened and non-empty

BREAKING CHANGE: the standalone object returned by the `autocomplete()` method is now a Zepto object.

### 0.16.2 Jan 22, 2016

* stop using weird zepto package. Stop using chained .data calls
  it seems that chaining them ended up in an `undefined` return value when passing `undefined` as a value

### 0.16.1 Jan 22, 2016

* remove npm-zepto, use zepto original package (now on npm) fixes #48

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
