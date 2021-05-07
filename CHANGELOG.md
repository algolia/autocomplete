# [1.0.1](https://github.com/algolia/autocomplete/compare/v1.0.0...v1.0.1) (2021-05-07)

### Bug Fixes

- **js:** pass children as array in highlight components ([#575](https://github.com/algolia/autocomplete/issues/575)) ([7d3402e](https://github.com/algolia/autocomplete/commit/7d3402e0b157533aea74ad4b00115a1ae9ca09d1)), closes [#574](https://github.com/algolia/autocomplete/issues/574)
- **js:** rely on `environment` instead of global object ([#572](https://github.com/algolia/autocomplete/issues/572)) ([0a33b44](https://github.com/algolia/autocomplete/commit/0a33b442a48f5888412e2ae19326afd7f8ba3fb8))
- **js:** render `noResults` template when `openOnFocus` is `true` ([#573](https://github.com/algolia/autocomplete/issues/573)) ([f2154c8](https://github.com/algolia/autocomplete/commit/f2154c80c7e54dec8107bc158c13ae21f01f8b5f))

# [1.0.0](https://github.com/algolia/autocomplete/compare/v1.0.0-alpha.49...v1.0.0) (2021-05-03)

[![Banner](https://user-images.githubusercontent.com/6137112/116869321-ce911180-ac10-11eb-91fe-0965c9dbb52a.png)](http://alg.li/autocomplete)

Read the [**Upgrading**](https://algolia.com/doc/ui-libraries/autocomplete/guides/upgrading/) guide to migrate from Autocomplete v0 to v1.

# [1.0.0-alpha.49](https://github.com/algolia/autocomplete/compare/v1.0.0-alpha.48...v1.0.0-alpha.49) (2021-05-03)

### Bug Fixes

- **core:** support Insights in requesters ([#562](https://github.com/algolia/autocomplete/issues/562)) ([c305ab4](https://github.com/algolia/autocomplete/commit/c305ab4e974f18991cf4cbcf4189a4c81c47fa8a))

# [1.0.0-alpha.48](https://github.com/algolia/autocomplete/compare/v1.0.0-alpha.47...v1.0.0-alpha.48) (2021-04-30)

### Features

- **js:** sync detached mode open state ([#556](https://github.com/algolia/autocomplete/issues/556)) ([1239b63](https://github.com/algolia/autocomplete/commit/1239b63e80dd2351771d74e91b275eda19fb997f))

# [1.0.0-alpha.47](https://github.com/algolia/autocomplete/compare/v1.0.0-alpha.46...v1.0.0-alpha.47) (2021-04-29)

### Bug Fixes

- **theme-classic:** various fixes ([#546](https://github.com/algolia/autocomplete/issues/546)) ([6b4bc12](https://github.com/algolia/autocomplete/commit/6b4bc120f4eecfac3f7d2ab8b49067dacc833b55))

### Features

- **js:** expose `GetSources` type ([#551](https://github.com/algolia/autocomplete/issues/551)) ([3d1bf26](https://github.com/algolia/autocomplete/commit/3d1bf269c02a7e35b100dda0b1d148805731a3ed))

# [1.0.0-alpha.46](https://github.com/algolia/autocomplete/compare/v1.0.0-alpha.45...v1.0.0-alpha.46) (2021-04-22)

This new version introduces the Requester API, which **transparently batches calls to the same Algolia application.** The `getAlgoliaHits` function is replaced by `getAlgoliaResults`, and `getAlgoliaFacetHits` by `getAlgoliaFacets`. Both functions no longer return a promise that resolves to the fetched records, but expose a `transformResponse` method that exposes the results, hits and facet hits for you to manipulate and return if need be. Learn more in the [documentation](https://autocomplete.algolia.com/docs/getAlgoliaResults).

### Bug Fixes

- **classic-theme:** fix modal display in Detached Mode ([#531](https://github.com/algolia/autocomplete/issues/531)) ([abf98ef](https://github.com/algolia/autocomplete/commit/abf98ef2c332c5f44988b521811e17a093adfd6a))
- **classic-theme:** remove pointer cursor on no result item content ([#529](https://github.com/algolia/autocomplete/issues/529)) ([b241df4](https://github.com/algolia/autocomplete/commit/b241df426fce5e062139fcc48fbee26765aba0e3))
- **examples:** update build command ([#539](https://github.com/algolia/autocomplete/issues/539)) ([f5254e9](https://github.com/algolia/autocomplete/commit/f5254e9a3e2c63962af87beea8e939319f12e619))
- **js:** compute panel top position with `getBoundingClientRect` ([#536](https://github.com/algolia/autocomplete/issues/536)) ([492e058](https://github.com/algolia/autocomplete/commit/492e058c66f0c9972206ef4417ba7d0c8edf92a2))
- **types:** fix collision between js/core and plugins ([#532](https://github.com/algolia/autocomplete/issues/532)) ([ac79f67](https://github.com/algolia/autocomplete/commit/ac79f6790f34cabe911492dbe24aad4633d9d949))
- adjust examples ([#527](https://github.com/algolia/autocomplete/issues/527)) ([32bd2bc](https://github.com/algolia/autocomplete/commit/32bd2bc08c14c06faa3551f11253da6b14af5450))
- **theme-classic:** wrap item content when there's no link ([#522](https://github.com/algolia/autocomplete/issues/522)) ([c6afe42](https://github.com/algolia/autocomplete/commit/c6afe4256047b234a5b4b0e45a1cfa61b1e82c6d))

### Features

- **core:** introduce Requester API ([#540](https://github.com/algolia/autocomplete/issues/540)) ([be1cee7](https://github.com/algolia/autocomplete/commit/be1cee7003ef6e804a22a62415f0711ec9f583a4))
- **qs:** append space to query on tap-ahead ([#525](https://github.com/algolia/autocomplete/issues/525)) ([06358bc](https://github.com/algolia/autocomplete/commit/06358bc8c295ffb7439d49c5959034dc5772f467))

# [1.0.0-alpha.45](https://github.com/algolia/autocomplete/compare/v1.0.0-alpha.44...v1.0.0-alpha.45) (2021-04-09)

### Bug Fixes

- **js:** change button class name to "aa-ClearButton" ([5991e77](https://github.com/algolia/autocomplete/commit/5991e77539f4cf2c7ab0a92c1ce626f3176348e7))
- **js:** prevent id incrementation when toggling detached mode ([#489](https://github.com/algolia/autocomplete/issues/489)) ([fe2bf13](https://github.com/algolia/autocomplete/commit/fe2bf1326135ed6efa5b1434d7e23650a53442e5))
- **js:** remove `window` references ([#501](https://github.com/algolia/autocomplete/issues/501)) ([7628d09](https://github.com/algolia/autocomplete/commit/7628d0944c3820d9227a1a4f4014efe78b7afeab))
- **js:** run reactive values only once ([8356031](https://github.com/algolia/autocomplete/commit/83560313e0dfcc8c47e5078916f2f860ab347f5d))
- **qs:** rename `categoriesLimit` to `itemsWithCategories` ([#491](https://github.com/algolia/autocomplete/issues/491)) ([4c97375](https://github.com/algolia/autocomplete/commit/4c9737563da9cb04b085bb1c2fb1c28e850d1b6d))

### Features

- **autocomplete-theme-classic:** align search box properly ([#511](https://github.com/algolia/autocomplete/issues/511)) ([c807ed4](https://github.com/algolia/autocomplete/commit/c807ed46c29e594d2dff62f325545dc53bfda165)), closes [#513](https://github.com/algolia/autocomplete/issues/513)
- **js:** introduce Component API ([#505](https://github.com/algolia/autocomplete/issues/505)) ([74a908c](https://github.com/algolia/autocomplete/commit/74a908c9d2898e20da9451b4cf5f3575cd2f0151))
- **js:** pass `elements` record to `render` ([#490](https://github.com/algolia/autocomplete/issues/490)) ([a50712e](https://github.com/algolia/autocomplete/commit/a50712e151266f13046d50ef7f8fccea27425bd4))
- **plugins:** provide `state` to `transformSource` ([#516](https://github.com/algolia/autocomplete/issues/516)) ([eaa2026](https://github.com/algolia/autocomplete/commit/eaa2026dfe58603be48c5400fdadb6ec9ed539c4))
- **recent-searches:** export storage and search APIs ([#473](https://github.com/algolia/autocomplete/issues/473)) ([09be485](https://github.com/algolia/autocomplete/commit/09be4855417840ae2428916d5291a49ab24e8532))
- **theme:** patch theme ([#497](https://github.com/algolia/autocomplete/issues/497)) ([9bf41e2](https://github.com/algolia/autocomplete/commit/9bf41e2897624d7f69bb9dab4e7088f30247c73c))

# [1.0.0-alpha.44](https://github.com/algolia/autocomplete/compare/v1.0.0-alpha.43...v1.0.0-alpha.44) (2021-03-01)

### Bug Fixes

- **core:** compute open state on focus with `shouldPanelOpen` ([#456](https://github.com/algolia/autocomplete/issues/456)) ([dd28098](https://github.com/algolia/autocomplete/commit/dd28098accb75b5e76bc02df716a37b273b3e58a))
- **js:** provide `title`s to submit and clear button ([45944e4](https://github.com/algolia/autocomplete/commit/45944e4c9f4e695039ab18e41284ff3d621774b7)), closes [algolia/algoliasearch-netlify#203](https://github.com/algolia/algoliasearch-netlify/issues/203)
- **js:** rename "Reset" button to "Clear" ([434c565](https://github.com/algolia/autocomplete/commit/434c56506f866c791553a79d2d3bbf325f8f11a6))
- **theme:** keep item icon ratio ([b77921e](https://github.com/algolia/autocomplete/commit/b77921e857691dcda3d5d110a494425464899aab))

### Features

- **js:** scroll to top when query changes ([#457](https://github.com/algolia/autocomplete/issues/457)) ([706939c](https://github.com/algolia/autocomplete/commit/706939c4f45e781b9cf9ae886521a7eb99f16755))
- **qs:** rename `category` to `categoryAttribute` ([5d8c5d4](https://github.com/algolia/autocomplete/commit/5d8c5d4f5e2ce6d5621033fd04bd8431c0b7b915))

# [1.0.0-alpha.43](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.42...v1.0.0-alpha.43) (2021-02-19)

### Bug Fixes

- **js:** display `empty` template only with a query ([7c2f9a3](https://github.com/algolia/autocomplete.js/commit/7c2f9a35ae8935793f0e9838369225a4fedad37e))
- **js:** rely on `environment` instead of `window` ([0bc15e9](https://github.com/algolia/autocomplete.js/commit/0bc15e9c354cacafe5f54fd91ece651dcc51cc58))
- **theme:** update icons and Detached mode design ([#443](https://github.com/algolia/autocomplete.js/issues/443)) ([af43a37](https://github.com/algolia/autocomplete.js/commit/af43a379215376cab811adfd512bc7fb60965803))

### Features

- **algolia:** add `getAlgoliaFacetHits` preset ([#451](https://github.com/algolia/autocomplete.js/issues/451)) ([8876fd3](https://github.com/algolia/autocomplete.js/commit/8876fd3283e846be3bf9a6b8929efa5b09600d61))
- **algolia:** fix highlighting hit type ([#452](https://github.com/algolia/autocomplete.js/issues/452)) ([0f92710](https://github.com/algolia/autocomplete.js/commit/0f927100e353adc0f6aac81bcad7c5fcc4c5862b))
- **css:** support Detached mode ([#438](https://github.com/algolia/autocomplete.js/issues/438)) ([82747d5](https://github.com/algolia/autocomplete.js/commit/82747d58a9e53036f1cfb31efd79bb9a409d45f9))
- **js:** add `aa-Detached` CSS class on Detached mode ([8a50e90](https://github.com/algolia/autocomplete.js/commit/8a50e90693ada6f876faf153e23fbc85300207a8))
- **js:** always keep panel open on detached mode ([9014a41](https://github.com/algolia/autocomplete.js/commit/9014a4168c76dcc736c5895af614c970d4c0c2c0))
- **js:** rename `detachedMediaQuery` ([46d30f5](https://github.com/algolia/autocomplete.js/commit/46d30f5178f7467b01a572cbea492ad63a5942ca))
- **js:** rename `empty` to `noResults` ([#450](https://github.com/algolia/autocomplete.js/issues/450)) ([71ea2d0](https://github.com/algolia/autocomplete.js/commit/71ea2d010f7a370c03fbdcb01e155244f4ea8bb2))
- **js:** rename classnames to Detached ([dadec26](https://github.com/algolia/autocomplete.js/commit/dadec26300b3f4bed3c8f704d2decf5211d6d3f0))
- **plugins:** add categories to Query Suggestions and Recent Searches ([54ef36c](https://github.com/algolia/autocomplete.js/commit/54ef36c366e8328d99c6741cce839748f4914d89))
- **recent-searches:** display tap-ahead button ([b3670c9](https://github.com/algolia/autocomplete.js/commit/b3670c95ebf5a8d6570e169351956360a18ac1f5))
- **theme:** design search button focus state ([e284771](https://github.com/algolia/autocomplete.js/commit/e284771d6f2c5057a015912fbda0c50896a4c603))
- **theme:** support modal design on Detached Mode ([#445](https://github.com/algolia/autocomplete.js/issues/445)) ([5043d27](https://github.com/algolia/autocomplete.js/commit/5043d27eb04ef550415d9235c60c40344abe8603))
- **theme:** update search button design ([818a1d9](https://github.com/algolia/autocomplete.js/commit/818a1d9adc2df54ca289dd983bc8e77b5676029c))

# [1.0.0-alpha.42](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.41...v1.0.0-alpha.42) (2021-02-09)

### Bug Fixes

- **core:** rename `shouldPanelShow` to `shouldPanelOpen` ([c442884](https://github.com/algolia/autocomplete.js/commit/c442884c99535939acef1309a6eff99d3358399b))
- **js:** change highlighted element `key` to index ([d4d0348](https://github.com/algolia/autocomplete.js/commit/d4d03486fb72397644abd66e16dff879767f2a8d))

### Features

- **core:** remove `onInput` option ([#437](https://github.com/algolia/autocomplete.js/issues/437)) ([3827605](https://github.com/algolia/autocomplete.js/commit/38276059f30c9e99a09be5764ba90cd79f9963da))

# [1.0.0-alpha.41](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.40...v1.0.0-alpha.41) (2021-02-09)

### Bug Fixes

- **core:** don't open panel with `openOnFocus` without items ([fde8b8a](https://github.com/algolia/autocomplete.js/commit/fde8b8abe7f459ac797e5a45b0b6e5f8b201fed0))
- **core:** rename `OnHighlightParams` to `OnActiveParams` ([2d7762d](https://github.com/algolia/autocomplete.js/commit/2d7762df555782c0ff622e69faa86d5868e773a3))
- **js:** add `footer` template ([b2223d5](https://github.com/algolia/autocomplete.js/commit/b2223d5a707846ac8efbe109d95cc97af0ad6b86))
- **js:** add `key` props to highlight children ([11e5667](https://github.com/algolia/autocomplete.js/commit/11e566778bdc056f1ce048380ed16f04a75928d8))
- **js:** forward `TData` type to `AutocompletePlugin` ([f62cb36](https://github.com/algolia/autocomplete.js/commit/f62cb36fcce6e2912269f9e456d0e68d73214a13))
- **js:** use `AutocompletePlugin` type from JS ([ba3cda5](https://github.com/algolia/autocomplete.js/commit/ba3cda54b6d9088a938339f9d4d585915fe9a7bb))
- **plugins:** pass `createElement` to highlight utils ([11f4cb7](https://github.com/algolia/autocomplete.js/commit/11f4cb7a5d47bce75ef830ff455bc9fe7f4b9f13))

### Features

- **emptyStates:** implements empty source template and renderEmpty method ([#395](https://github.com/algolia/autocomplete.js/issues/395)) ([fbfca35](https://github.com/algolia/autocomplete.js/commit/fbfca35e99002c27d3b79f79aa91a10fde2bdf27))
- **js:** wrap item action buttons in container ([#434](https://github.com/algolia/autocomplete.js/issues/434)) ([0032f38](https://github.com/algolia/autocomplete.js/commit/0032f389eefdc752352d424ab427235608e50467))
- **plugin:** add `transformSource` API ([fbd9e72](https://github.com/algolia/autocomplete.js/commit/fbd9e72ee20b225e574aa32e16e24e0252339f41))
- **sourceId:** add `sourceId` to provide `data-autocomplete-source-id` on `section` source container ([#429](https://github.com/algolia/autocomplete.js/issues/429)) ([ce35fea](https://github.com/algolia/autocomplete.js/commit/ce35fea95a3d408064eba698d47ac0c57bd58349))
- **theme:** add `aa-ItemWrapper` CSS class ([a56c9d4](https://github.com/algolia/autocomplete.js/commit/a56c9d4da87ca2b8b32c373da99f6f9fee0170fe))

# [1.0.0-alpha.40](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.39...v1.0.0-alpha.40) (2021-02-03)

### Bug Fixes

- **core:** forward props in `getEnvironmentProps` ([af49483](https://github.com/algolia/autocomplete.js/commit/af4948304f5b95fdc8c642882609b87d39562f83))
- **core:** remove error handler when fetching results ([#416](https://github.com/algolia/autocomplete.js/issues/416)) ([eb98af6](https://github.com/algolia/autocomplete.js/commit/eb98af611ecd91b07d161d68ce1c81abf84bbf70))
- **insights:** rename event to "Item Active" ([03059b6](https://github.com/algolia/autocomplete.js/commit/03059b6b2942f114ea48a304d964480cb43b02c5))
- **js:** ignore empty template with no query and `openOnFocus` ([#407](https://github.com/algolia/autocomplete.js/issues/407)) ([92eeb3e](https://github.com/algolia/autocomplete.js/commit/92eeb3e523e4c1b1c87c4108d903029052472387))
- **js:** update panel markup ([1eecc65](https://github.com/algolia/autocomplete.js/commit/1eecc65fa86cb490dc2987dedaedbbc7812fac10))
- **mergeClassNames:** prevent classes with the same name being merged ([#413](https://github.com/algolia/autocomplete.js/issues/413)) ([9651481](https://github.com/algolia/autocomplete.js/commit/9651481a9e903605bbb26c28b1426fa7088416e5))

### Features

- **core:** pass scoped API to lifecycle hooks ([#422](https://github.com/algolia/autocomplete.js/issues/422)) ([049b343](https://github.com/algolia/autocomplete.js/commit/049b3430f9bd6fe53536c346f287dab06652b7cf))
- **highlighting:** support array syntax for nested attributes ([#418](https://github.com/algolia/autocomplete.js/issues/418)) ([4ad4e41](https://github.com/algolia/autocomplete.js/commit/4ad4e411d5c5ff6f6a8374b567fb9afa725bfd30))
- **js:** add JS user agent to Algolia requests ([#420](https://github.com/algolia/autocomplete.js/issues/420)) ([fab2d57](https://github.com/algolia/autocomplete.js/commit/fab2d57c3d0c08ab2e46fad80224fe9f740988eb))
- **js:** update reset icon ([2c953f6](https://github.com/algolia/autocomplete.js/commit/2c953f6ae8473b2fc5bd63b01b32470024e125bc))
- **query-suggestions:** remove `getAlgoliaHits` param ([efa4c93](https://github.com/algolia/autocomplete.js/commit/efa4c938f8a1c885a38e8130be44c9ab17fba146))
- **recent-searches:** update remove icon ([b828171](https://github.com/algolia/autocomplete.js/commit/b82817171718eab9041f41146d8accbd7d0cf909))
- **theme:** introduce Autocomplete Classic Theme ([#409](https://github.com/algolia/autocomplete.js/issues/409)) ([226fc54](https://github.com/algolia/autocomplete.js/commit/226fc549e07e957b7b6177e0f3d592bc509b0089))

# [1.0.0-alpha.39](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.38...v1.0.0-alpha.39) (2021-01-22)

This is a big release that changes the rendering implementation from plain HTML to Virtual DOM (see [#381](https://github.com/algolia/autocomplete.js/issues/381)).

### Bug Fixes

- **recent-searches:** escape highlighted query regex ([#387](https://github.com/algolia/autocomplete.js/issues/387)) ([d23f133](https://github.com/algolia/autocomplete.js/commit/d23f1336624680b72068fa93131448d251346a56))

### Features

- **core:** rename highlight to active ([1c1b951](https://github.com/algolia/autocomplete.js/commit/1c1b9512cd834c2bd2c48525df535d7039c14058))
- **emptyStates:** add `empty` source template and `renderEmpty` method ([#395](https://github.com/algolia/autocomplete.js/issues/395)) ([8bd35e6](https://github.com/algolia/autocomplete.js/commit/8bd35e6c186f1a4398108abd76dbd006c2b734b2))
- **js:** ([#381](https://github.com/algolia/autocomplete.js/issues/381)) ([5a1efc2](https://github.com/algolia/autocomplete.js/commit/5a1efc2cccd968b9f359ebd9ea26812743122d4c))
- **reverseHighlight/reverseSnippet:** implement sibling strategy from InstantSearch.js ([#388](https://github.com/algolia/autocomplete.js/issues/388)) ([d86a33a](https://github.com/algolia/autocomplete.js/commit/d86a33a50adefa3b6996e80e1d3b407f0dab59be))

# [1.0.0-alpha.38](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.37...v1.0.0-alpha.38) (2020-12-12)

### Bug Fixes

- **core:** convert `AutocompleteContext` to interface ([0fbfe59](https://github.com/algolia/autocomplete.js/commit/0fbfe59a1897f64e6b95a45269ff710f72183925))
- **js:** vertically offset panel based on `offsetTop` ([bb1af17](https://github.com/algolia/autocomplete.js/commit/bb1af17f92ffe97c9002fdddc8733356161fdf4e))

### Features

- **core:** add `enterKeyHint` prop to input ([7ff2971](https://github.com/algolia/autocomplete.js/commit/7ff29719b48e08863f5d4eb62021b12e4e1472c0))
- **core:** add invariant for `getItems` ([b57ccf3](https://github.com/algolia/autocomplete.js/commit/b57ccf3f915f5316c67af682427f7e6d8b07dc04))
- **core:** add invariant for `getSources` ([309371c](https://github.com/algolia/autocomplete.js/commit/309371c5ec06b5c50fb3aef08de8f0b25b34d216))
- **core:** add invariant for unknown reducer actions ([27d6281](https://github.com/algolia/autocomplete.js/commit/27d628194724bf04c381490c13d910fd368cd582))
- **insights:** extends `AutocompleteContext` with Insights API ([f1e8de4](https://github.com/algolia/autocomplete.js/commit/f1e8de43fcbad20c48997a3d8dd17e11f6339fe7))
- **js:** add non-input container invariant ([2e3a8ed](https://github.com/algolia/autocomplete.js/commit/2e3a8ed12a0167c78400ec0ae9c0c92041229a99))
- **js:** introduce Autocomplete Touch ([#379](https://github.com/algolia/autocomplete.js/issues/379)) ([5cfbdf2](https://github.com/algolia/autocomplete.js/commit/5cfbdf266818fa6a2a026ec7ce62b0e37d2a1f8b))
- **js:** introduce Update API ([921788c](https://github.com/algolia/autocomplete.js/commit/921788ce1067da9e8d42fd5dd2c688db659b9c88))
- **js:** pass scope API to prop getters ([18c7474](https://github.com/algolia/autocomplete.js/commit/18c7474b74b4e023dd6bcaa6c05040b5680ba926))
- **js:** schedule renders ([ef54af3](https://github.com/algolia/autocomplete.js/commit/ef54af3b85d13af511b7ae7edef5fbae00dd61e6))
- **query-suggestions:** pass `state` to `getSearchParams` ([5b8de7f](https://github.com/algolia/autocomplete.js/commit/5b8de7f48165f4ff60a9250f9245ef7771e5eb16))
- **shared:** add invariant util ([0e28f55](https://github.com/algolia/autocomplete.js/commit/0e28f550ca918d15023fe641ef2e893ce779cc95))

# [1.0.0-alpha.37](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.36...v1.0.0-alpha.37) (2020-12-06)

### Features

- **core:** export `AutocompleteContext` type ([f6ce779](https://github.com/algolia/autocomplete.js/commit/f6ce779575aadcce4d7c711f950ebff7ae25dcc5))
- **core:** pass `refresh` to all events ([bd45a77](https://github.com/algolia/autocomplete.js/commit/bd45a7793143425ba84f6f0bd2b66811b525f984))
- **core:** support `onReset` prop ([b7a66a8](https://github.com/algolia/autocomplete.js/commit/b7a66a85216c8a54330c087127da1ae45a59c1e6))
- **js:** introduce Props API ([04bef73](https://github.com/algolia/autocomplete.js/commit/04bef73d7b8b23fa2d0d1a0256dc794dab5a8422))

# [1.0.0-alpha.36](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.35...v1.0.0-alpha.36) (2020-12-03)

### Bug Fixes

- **core:** allow null `inputElement` in `getInputProps` ([75b990a](https://github.com/algolia/autocomplete.js/commit/75b990a866399af4b1f51aa45cd44206ce03a99d))
- **core:** disable `getSources` concurrent fix ([a558b5e](https://github.com/algolia/autocomplete.js/commit/a558b5e238a5f1897bf61e1b1ae6e5742685e4ea))
- **core:** extend `TItem` to object ([fcf94ff](https://github.com/algolia/autocomplete.js/commit/fcf94fff4788f3f132095a2a6d359b51824a4d51))
- **examples:** update ref types ([1d0cb20](https://github.com/algolia/autocomplete.js/commit/1d0cb208a6b3ce3da24bbfab3557831481e96032))
- **js:** add `templates` type to `getSources` ([69b9718](https://github.com/algolia/autocomplete.js/commit/69b97188dc570ef1082287576eae01ef4c505947))
- **js:** calculate panel position before opening ([#375](https://github.com/algolia/autocomplete.js/issues/375)) ([307a7ac](https://github.com/algolia/autocomplete.js/commit/307a7acc4283e10a19cb7d067f04f1bea79dc56f))
- **js:** clean environment effects ([eec80d2](https://github.com/algolia/autocomplete.js/commit/eec80d2cd590234dc653517adc78b2c6c6423716))
- **js:** fix debounce function ([82e6f4e](https://github.com/algolia/autocomplete.js/commit/82e6f4e0c017dbab675b53a107a8842f529a73fc))
- **js:** fix internal state type ([6def041](https://github.com/algolia/autocomplete.js/commit/6def041fdb0487184d571639a912e70d61a9576d))
- **js:** make `panelContainer` optional ([fe5db0c](https://github.com/algolia/autocomplete.js/commit/fe5db0c16aae404af6f1a8e34ad4fa8c259a676d))
- **js:** pass submit button to render ([ca119f3](https://github.com/algolia/autocomplete.js/commit/ca119f33f1ebb00b22bfb21423ffbaa8ac576e81))
- update icons `stroke-width` ([23e321b](https://github.com/algolia/autocomplete.js/commit/23e321ba22e535a184d8a000f8ee16b887b1ac2d))

### Features

- **core:** rename `searchBoxElement` to `formElement` ([#374](https://github.com/algolia/autocomplete.js/issues/374)) ([79c4985](https://github.com/algolia/autocomplete.js/commit/79c49854b0ff18a2c28b47e0173e819af7a6112c))
- **js:** add loading indicator ([59dc31b](https://github.com/algolia/autocomplete.js/commit/59dc31bec1b4ba0f199359bfaddb2d37074ae8c8))
- **js:** add PanelLayout element ([371fae0](https://github.com/algolia/autocomplete.js/commit/371fae04c43c1d7bfec2b125873a8ee4bb075aad))
- **js:** batch DOM updates ([#372](https://github.com/algolia/autocomplete.js/issues/372)) ([d06873e](https://github.com/algolia/autocomplete.js/commit/d06873e1fff737f853ac813df21d2b7b365c5446))
- **js:** display reset button only when query ([1656530](https://github.com/algolia/autocomplete.js/commit/16565304a50724d898e68686ef5301797cfac7ad))
- **js:** don't append panel on initial loading ([84ce729](https://github.com/algolia/autocomplete.js/commit/84ce729d24b7cf027daa0f61e7816ba5892cf6c5))
- **js:** introduce `panelContainer` option ([98dfe4b](https://github.com/algolia/autocomplete.js/commit/98dfe4b95b9085bb2a9e51d03d466582aeffee55))
- **js:** pass source to header and footer templates ([9983c64](https://github.com/algolia/autocomplete.js/commit/9983c64477408b52b9449cdb46faa2dc3e24ef0d))
- **js:** turn search label into submit button ([27e61cb](https://github.com/algolia/autocomplete.js/commit/27e61cbc4e6f3b039764f665225bd385c82941c4))
- **plugins:** introduce Insights plugin ([#373](https://github.com/algolia/autocomplete.js/issues/373)) ([2e967be](https://github.com/algolia/autocomplete.js/commit/2e967be6a33c532c472f9ca76295d605ed4f6f99))
- **theme:** prepare Autocomplete Classic Theme ([#361](https://github.com/algolia/autocomplete.js/issues/361)) ([8638a98](https://github.com/algolia/autocomplete.js/commit/8638a98c76c28f7ecdd51775888f52b514432405))
- **website:** update GitHub logo ([20a9b48](https://github.com/algolia/autocomplete.js/commit/20a9b482b267f8866d1b9795e4024a0cd084fd4e))

# [v1.0.0-alpha.35](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.34...v1.0.0-alpha.35) (2020-11-12)

This new version introduces breaking changes.

### Bug Fixes

- **core:** don't complete query when closed ([86adc65](https://github.com/algolia/autocomplete.js/commit/86adc659b65b2808f0eafe2ca0419c126bf1336c))
- **getSuggestions:** allow nested arrays to be returned ([#331](https://github.com/algolia/autocomplete.js/issues/331)) ([753c8ca](https://github.com/algolia/autocomplete.js/commit/753c8ca1358d1bd26c818ddb704caa0265d5aeae))
- **js:** correct `item` class name ([475e88f](https://github.com/algolia/autocomplete.js/commit/475e88f6184d2b01a9ab9639c0e23601e157fb88))
- **js:** correct `panel` class name ([a2be862](https://github.com/algolia/autocomplete.js/commit/a2be8626bc22f47f265ee5713754fc422a21af42))
- **js:** fix highlight `hit` param ([6c03d8d](https://github.com/algolia/autocomplete.js/commit/6c03d8d148877c914e43ad75952156ac1f014803))
- **js:** make `getSources` optional ([b12cc26](https://github.com/algolia/autocomplete.js/commit/b12cc268f900de9b47b9150156434c2ca5b8b3e9))
- **js:** resize panel also when hidden ([9007fe0](https://github.com/algolia/autocomplete.js/commit/9007fe0e3378e4e56c6039614dcf700d46dbb6fc))
- **qs:** ignore `storage` param ([5279dba](https://github.com/algolia/autocomplete.js/commit/5279dba5360286eba5125a24bfc2ed8b1d0aa690))
- **recent-searches:** type `getTemplates` internal function ([1ff6a0d](https://github.com/algolia/autocomplete.js/commit/1ff6a0d0dea7a1f0fa70b15945f4b3ded097558f))
- fix `setCollections` type ([cb967a4](https://github.com/algolia/autocomplete.js/commit/cb967a49fa07a6d67b792f24b015289ab4c44afb))

### Features

- **core:** warn when using `debug` option ([#364](https://github.com/algolia/autocomplete.js/issues/364)) ([2a2e3dd](https://github.com/algolia/autocomplete.js/commit/2a2e3dd72b2ba4e1856a7772f7e95a3ddad82812))
- **recent-searches:** add search highlighting ([#370](https://github.com/algolia/autocomplete.js/issues/370)) ([3cb1d39](https://github.com/algolia/autocomplete.js/commit/3cb1d39fde6c5e0199bd9912c5fb448f5d002959))
- introduce development and production modes ([#363](https://github.com/algolia/autocomplete.js/issues/363)) ([eed934f](https://github.com/algolia/autocomplete.js/commit/eed934f1d7d632c934c37593f555d8258c0084e3))
- rename getters ([#362](https://github.com/algolia/autocomplete.js/issues/362)) ([b7e86d5](https://github.com/algolia/autocomplete.js/commit/b7e86d551aa29f8c372b2f560f3a9dc3c44548ca))
- **core:** introduce new completion system ([#354](https://github.com/algolia/autocomplete.js/issues/354)) ([25099e8](https://github.com/algolia/autocomplete.js/commit/25099e8ad37004b1522364716275eb4f90f01c51))
- **core:** remove `statusContext` API ([#350](https://github.com/algolia/autocomplete.js/issues/350)) ([a916aea](https://github.com/algolia/autocomplete.js/commit/a916aea48743eaa3e97e1e421aa1ac6986fa0e83))
- **core:** rename private and public methods and properties ([#349](https://github.com/algolia/autocomplete.js/issues/349)) ([aeebe6d](https://github.com/algolia/autocomplete.js/commit/aeebe6de5b71c72fa4ac52b0cc5bd2b71965b973))
- **js:** rename class names ([#351](https://github.com/algolia/autocomplete.js/issues/351)) ([8c53d2d](https://github.com/algolia/autocomplete.js/commit/8c53d2da3cf2c1669300549aadba93d486b7bf5e))
- **plugins:** introduce Query Suggestions plugin ([#360](https://github.com/algolia/autocomplete.js/issues/360)) ([7d19396](https://github.com/algolia/autocomplete.js/commit/7d19396efbbe9c03225bb7b51540438a5ecd9ba0))
- **recent-searches:** support search and templating ([#353](https://github.com/algolia/autocomplete.js/issues/353)) ([b8ff178](https://github.com/algolia/autocomplete.js/commit/b8ff178f48438d5e5feaf2d10d7cfe6d54d4b7de))
- **shared:** introduce autocomplete-shared package ([#359](https://github.com/algolia/autocomplete.js/issues/359)) ([af04ae1](https://github.com/algolia/autocomplete.js/commit/af04ae1a53a89fe853c73ffc450998ef3898c38d))
- **shared:** prefix warnings ([586f0f1](https://github.com/algolia/autocomplete.js/commit/586f0f14af9647433c8d1afa4e9dc2ecc75226c8))

# [v1.0.0-alpha.34](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.33...v1.0.0-alpha.34) (2020-10-20)

### Bug Fixes

- **core:** keep cursor position on state changes ([#343](https://github.com/algolia/autocomplete.js/issues/343)) ([bae4d62](https://github.com/algolia/autocomplete.js/commit/bae4d621e5e8577d3394292e357e767d26d26742))
- **algolia:** fix `getAlgoliaResults` typings ([#336](https://github.com/algolia/autocomplete.js/issues/336)) ([0559624](https://github.com/algolia/autocomplete.js/commit/0559624affe43307d0f5b47ddeed6bdbc30a0961))
- **core:** turn public `navigator` type to partial ([#339](https://github.com/algolia/autocomplete.js/issues/339)) ([056daeb](https://github.com/algolia/autocomplete.js/commit/056daeba21764c12e2933999d0ae243ce94c956d))
- **core:** keep last `isOpen` value on refresh ([#334](https://github.com/algolia/autocomplete.js/issues/334)) ([637d23e](https://github.com/algolia/autocomplete.js/commit/637d23ecb82f88b6de686b76657fe53a8acf119d))

### Features

- **core:** provide prevState in `onStateChange` ([#335](https://github.com/algolia/autocomplete.js/issues/335)) ([21739b4](https://github.com/algolia/autocomplete.js/commit/21739b446dd7d5105dabb67adfff0937cbe06162))

# [1.0.0-alpha.33](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.32...v1.0.0-alpha.33) (2020-10-05)

### Bug Fixes

- **js:** support `onStateChange` ([e4c1488](https://github.com/algolia/autocomplete.js/commit/e4c14886361c7914ba29bf6da4b2db773ed84fc6))

### Features

- **recentSearches:** add remove button ([#326](https://github.com/algolia/autocomplete.js/issues/326)) ([648f1e8](https://github.com/algolia/autocomplete.js/commit/648f1e8de82ddfdf385da091e7402a2e4742f7d0))

# [1.0.0-alpha.32](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.31...v1.0.0-alpha.32) (2020-09-28)

### Features

- **core:** run `onSelect` on item click ([079a4c1](https://github.com/algolia/autocomplete.js/commit/079a4c15e78cf5e560aa34276cf2d2ac95812944))

# [1.0.0-alpha.31](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.30...v1.0.0-alpha.31) (2020-09-28)

### Bug Fixes

- **algolia:** fallback non-existant highlighted to default value ([7783bc6](https://github.com/algolia/autocomplete.js/commit/7783bc666607c9e08720e11f934945f68629b257))
- **algolia:** warn when an attribute cannot be highlighted ([ce43e83](https://github.com/algolia/autocomplete.js/commit/ce43e83fb2eeea6da494acbba87f192c9490699a))

### Features

- **core:** skip `onInput` on keyboard select with URL ([399be2b](https://github.com/algolia/autocomplete.js/commit/399be2b3e4eb316c65d2a054cded6d23df71cd62))
- **core:** trigger `onSelect` on meta keyboard select ([b10fbe1](https://github.com/algolia/autocomplete.js/commit/b10fbe102a6e28386b41bc4c2fbdd239bc5aa886))
- **core:** use `scrollIntoViewIfNeeded` if exists ([c409f11](https://github.com/algolia/autocomplete.js/commit/c409f11dfd0511bcfcdd60d3ba0c28cf3a61bd26))
- **recent-searches**: add recent-searches plugin ([#316](https://github.com/algolia/autocomplete.js/issues/316)) ([858637e](https://github.com/algolia/autocomplete.js/commit/858637e34ba5bfcdfa8bf66e8785296afd436971))

# [1.0.0-alpha.30](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.29...v1.0.0-alpha.30) (2020-09-17)

### Bug Fixes

- **algolia:** don't flatten `getAlgoliaHits` ([8da805f](https://github.com/algolia/autocomplete.js/commit/8da805f7b6061b73387ed937152980f6b76f42ac))
- **algolia:** type Algolia presets ([7c34ada](https://github.com/algolia/autocomplete.js/commit/7c34adacc71fb8da3a75c66edacce6489170efba))
- **core:** rename public types without prefix ([77487a6](https://github.com/algolia/autocomplete.js/commit/77487a6392e23c0c1a8ac674fbb8f80cc11e6c6d))
- **js:** forward event to all `onInput` calls ([c5492aa](https://github.com/algolia/autocomplete.js/commit/c5492aa536f8189bc37f1c603ae7a8c26bcbb444))
- **website:** ignore lint rule for Docusaurus packages ([042f4dc](https://github.com/algolia/autocomplete.js/commit/042f4dc4cf5e22518194b67c7e898c61f451282c))

### Features

- **algolia:** type highlight presets ([9f4b6bd](https://github.com/algolia/autocomplete.js/commit/9f4b6bdc58d7e1d9b4d22692f4aeaf0b0309e008))
- **core:** support `onHighlight` on input ([e463933](https://github.com/algolia/autocomplete.js/commit/e4639332bff017925814f21857ade1c7c270222d))
- **js:** type highlight utils ([23cff13](https://github.com/algolia/autocomplete.js/commit/23cff13800a223239b54074087bf8127f9b314fa))

# [1.0.0-alpha.29](https://github.com/algolia/autocomplete.js/compare/v1.0.0-alpha.28...v1.0.0-alpha.29) (2020-09-15)

### Bug Fixes

- **algolia:** import version from file ([d880d8a](https://github.com/algolia/autocomplete.js/commit/d880d8a304cb79f095fcbb1bf12d5f1e9e805a3f))
- **algolia:** import version from package ([c314375](https://github.com/algolia/autocomplete.js/commit/c31437529724fe15a599a7356e0b9fbf78948305))
- **algolia:** proxy highlighting tags ([baabc3a](https://github.com/algolia/autocomplete.js/commit/baabc3abc74cff260025b17f18e8b6900f7ebe9c))
- **core:** fix type for `getSources` ([18e88ae](https://github.com/algolia/autocomplete.js/commit/18e88aee249f02769d55599dd209e2ca73c0600d))
- **js:** call debounced function ([0662e1b](https://github.com/algolia/autocomplete.js/commit/0662e1be711a53c4d9ca4c82c771739a6eceffa7))
- **js:** convert header and footer templates to `div`s ([1435aad](https://github.com/algolia/autocomplete.js/commit/1435aad459b814b435651cffe83cb5b759a914a2))
- **js:** fix source types ([9913fe1](https://github.com/algolia/autocomplete.js/commit/9913fe1403830008eea7f61df59049d5dad34b72))
- **js:** fix type for `getSources` ([4a29700](https://github.com/algolia/autocomplete.js/commit/4a29700f0f18fe35d60e3172932950a211cfecfe))
- **js:** make options types optional ([569f738](https://github.com/algolia/autocomplete.js/commit/569f7381ff5bb84bd0d46fc4b2aa74ad1a7f0142))
- **js:** update HTML elements properties at every render ([b00878c](https://github.com/algolia/autocomplete.js/commit/b00878cf2e32e50f7faee13a3521c6b6a30bb539))

### Features

- **algolia:** escape values in highlighting utils ([50a9a73](https://github.com/algolia/autocomplete.js/commit/50a9a73df440565c5a9cbff84e12f3ce5c455e17))
- **algolia:** introduce `parseReverseSnippetedAttribute` ([0f7a912](https://github.com/algolia/autocomplete.js/commit/0f7a9126a72468ac63513391c7f460e4c86bcc05))
- **algolia:** type highlighting utils ([fa4b959](https://github.com/algolia/autocomplete.js/commit/fa4b959c575aeb6f36720c6e67ce6bfef2dacb06))
- **core:** introduce debug mode ([#315](https://github.com/algolia/autocomplete.js/issues/315)) ([7a7b612](https://github.com/algolia/autocomplete.js/commit/7a7b61211209ebffacd2ccc61725df426397f2f0))
- **js:** add `destroy` API ([4e32138](https://github.com/algolia/autocomplete.js/commit/4e3213860958aaedce52c719bd5dc263671d4a02))
- **js:** add magnifier glass as label ([0cc8a44](https://github.com/algolia/autocomplete.js/commit/0cc8a44c3d27933bb581a2c258b2c238e8009904))
- **js:** add reset icon ([7d2dccc](https://github.com/algolia/autocomplete.js/commit/7d2dccccaf5fb8292808bf2291f82b205a99554a))
- **js:** allow escaping in highlighting utils ([a70f80d](https://github.com/algolia/autocomplete.js/commit/a70f80df9e0281d547ec0fe1a0c4e5102bfbc1ed))
- **js:** export snippeting utils ([e276c5e](https://github.com/algolia/autocomplete.js/commit/e276c5e91ee8028d8b7ac87a238375ec97caf730))
- **js:** introduce `classNames` API ([#317](https://github.com/algolia/autocomplete.js/issues/317)) ([28bb422](https://github.com/algolia/autocomplete.js/commit/28bb4220067b690145738a894c95ba8bf32cb49d))
- **js:** introduce `dropdownPlacement` API ([#314](https://github.com/algolia/autocomplete.js/issues/314)) ([4a52ce5](https://github.com/algolia/autocomplete.js/commit/4a52ce5a27efa8b9b230bce85fb953531b8e07b8))
- **js:** type highlighting utils ([b178487](https://github.com/algolia/autocomplete.js/commit/b17848753a2794a76edf545d649be6107c712f31))

# [1.0.0-alpha.28](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.27...v1.0.0-alpha.28) (2020-08-26)

### Bug Fixes

- **core:** add type `search` to `getInputProps` ([92d95cc](https://github.com/francoischalifour/autocomplete.js/commit/92d95ccbd6683a1d8cd3ce53786f7fffc192cd00))
- **core:** add type to `GetDropdownProps` ([6bd21fc](https://github.com/francoischalifour/autocomplete.js/commit/6bd21fc67451058f32460b1afaf65ae3a73ce71c)), closes [#70](https://github.com/francoischalifour/autocomplete.js/issues/70)
- **core:** allow calling `getDropdownProps` without argument ([c44e494](https://github.com/francoischalifour/autocomplete.js/commit/c44e49439684e8577e3341a84381acf8dba463aa))
- **core:** prevent `mousedown` event on dropdown to keep it open ([ec9733b](https://github.com/francoischalifour/autocomplete.js/commit/ec9733bfcce0be0e94a8f4d402d1bae9c3090549))
- **core:** rename `showCompletion` to `enableCompletion` ([07b46af](https://github.com/francoischalifour/autocomplete.js/commit/07b46afb6c382a3f8be5bb711b477b4cbc0c1382))
- **core:** type form props ([1c2551b](https://github.com/francoischalifour/autocomplete.js/commit/1c2551b838933c095543c7abd807c0de1ac5aeb1))
- **docsearch:** add type to `GetDropdownProps` ([50b4879](https://github.com/francoischalifour/autocomplete.js/commit/50b487969c0a1b355499b7526315eb9e4967c47a))
- **docsearch:** allow a single instance to open ([90bfaaa](https://github.com/francoischalifour/autocomplete.js/commit/90bfaaa81740be5dac4abac23c9180718527b55e))
- **docsearch:** capture `mousedown` event to close modal ([b802621](https://github.com/francoischalifour/autocomplete.js/commit/b802621c1e999d11296f1d1b711e454f980fb314)), closes [/github.com/facebook/react-native-website/pull/2139#issuecomment-678330203](https://github.com//github.com/facebook/react-native-website/pull/2139/issues/issuecomment-678330203)
- **docsearch:** remove `data-cy` attributes ([6bedbb7](https://github.com/francoischalifour/autocomplete.js/commit/6bedbb7d0fd4a086a5af974eb814e0ffaa355d1f))
- **docsearch:** remove Docusaurus style ([a52cc44](https://github.com/francoischalifour/autocomplete.js/commit/a52cc448843cba0e4a04f8cb0e180c316870abb4))
- **docsearch:** use `"false"` value for `spellCheck` in vanilla version ([d22bea7](https://github.com/francoischalifour/autocomplete.js/commit/d22bea77d7e098b6e849bd57302244c0fe15dc0a))
- **js:** return setters and `refresh` only ([758565e](https://github.com/francoischalifour/autocomplete.js/commit/758565e71f73415e9b0d9f0f454e8c1d43a43f51))
- **js:** revert highlighting conditions ([8fb33b1](https://github.com/francoischalifour/autocomplete.js/commit/8fb33b1e07eb5e18461c2290cbafaea61fc5c65f))
- **js:** update types ([607ea45](https://github.com/francoischalifour/autocomplete.js/commit/607ea4547067ca994ed8e3b5e855cb3a6f85b81c))
- **types:** allow arbitrary keys in sources ([6ed9e4a](https://github.com/francoischalifour/autocomplete.js/commit/6ed9e4ae14c6e8534f8904676b1c6d5c2755e759))

### Features

- **autocomplete:** introduce JavaScript API ([fd9d2b7](https://github.com/francoischalifour/autocomplete.js/commit/fd9d2b7d62ad5ad4ad8d641eb5bda12d02cc7931))
- **core:** add default form props ([2264f2b](https://github.com/francoischalifour/autocomplete.js/commit/2264f2bbd6b470d758a98ae445fb7efa945d34fa))
- **docsearch:** add `enterkeyhint` to `go` ([d652514](https://github.com/francoischalifour/autocomplete.js/commit/d652514bc35c16f4d406a7b89ac7b479ed316c54))
- **js:** pass state to `render` ([7f7da3d](https://github.com/francoischalifour/autocomplete.js/commit/7f7da3db27ab34c841692d034c2135d3c4e0a7a8))

# [1.0.0-alpha.27](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.26...vv1.0.0-alpha.27) (2020-08-07)

### Bug Fixes

- **docsearch:** fix vanilla DocSearch types ([2b5e7aa](https://github.com/francoischalifour/autocomplete.js/commit/2b5e7aad3cc02c4021970bc1971a719843416474))

### Features

- **docsearch:** export DocSearch types ([b499fee](https://github.com/francoischalifour/autocomplete.js/commit/b499fee3e88a496b89c62f327f25e114c8e8f486))
- **docsearch:** update missing results issue link ([fb8d735](https://github.com/francoischalifour/autocomplete.js/commit/fb8d735354d5b06752abd1008f14cef8bd986b42))

# [1.0.0-alpha.26](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.25...v1.0.0-alpha.26) (2020-08-04)

### Bug Fixes

- **docsearch:** don't open modal on `/` when editing text ([6118725](https://github.com/francoischalifour/autocomplete.js/commit/6118725dda6a3c0fc92ec478923c6b3187a43ad7))

# [1.0.0-alpha.25](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.24...v1.0.0-alpha.25) (2020-07-30)

### Bug Fixes

- **docsearch:** pass `autoFocus` prop to autocomplete for mobiles ([8f4d3fb](https://github.com/francoischalifour/autocomplete.js/commit/8f4d3fb8d9926e74d44da2b7b1eb388e5283b0db))

### Features

- **docsearch:** add `aria-label` to search button ([5bc08ca](https://github.com/francoischalifour/autocomplete.js/commit/5bc08cabc87c876fb26bf7608509cfcd000fac89))

# [1.0.0-alpha.24](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.23...v1.0.0-alpha.24) (2020-07-23)

### Bug Fixes

- **docsearch:** don't blur input on submit ([86da0fc](https://github.com/francoischalifour/autocomplete.js/commit/86da0fc3c66f8bb0757ce7b3a760ea752184de82))
- **docsearch:** focus input on Selection Search ([9f1fa52](https://github.com/francoischalifour/autocomplete.js/commit/9f1fa52c68b765a36060aef8ce25728cda37affa))

# [1.0.0-alpha.23](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.22...v1.0.0-alpha.23) (2020-07-22)

### Bug Fixes

- **docsearch:** add padding to dropdown when no recent searches ([0e3d0f5](https://github.com/francoischalifour/autocomplete.js/commit/0e3d0f570abee1361651e07de47b93c1b990a8b0))
- **docsearch:** rename `DocSearch-Button` CSS class ([f3a5449](https://github.com/francoischalifour/autocomplete.js/commit/f3a5449a7ddfdf987422e213db3b2baa52d54d0e))
- **docsearch:** use Preact alias in Babel config ([31b3bd4](https://github.com/francoischalifour/autocomplete.js/commit/31b3bd42d6677c2dbd40ee7012059bcd1202c781))
- **search:** hide content when `disableUserPersonalization` ([4940538](https://github.com/francoischalifour/autocomplete.js/commit/4940538563b89545612fbe8f19acbd0f89d1219d))
- **website:** memoize `onInput` callback ([9fa7d30](https://github.com/francoischalifour/autocomplete.js/commit/9fa7d30629578774d318989a7200385034e5ff3c))

### Features

- **docsearch:** introduce `disableUserPersonalization` API ([de31121](https://github.com/francoischalifour/autocomplete.js/commit/de311210ae2bc63d7907abfbf75b61d3b624e976))
- **docsearch:** support `initialQuery` ([11aa27b](https://github.com/francoischalifour/autocomplete.js/commit/11aa27bf332b91542cf9c0f6f7e88b0412172fb6)), closes [#51](https://github.com/francoischalifour/autocomplete.js/issues/51)
- **DocSearch:** add `DocSearch` CSS class to DocSearch elements ([0e93615](https://github.com/francoischalifour/autocomplete.js/commit/0e9361568440281f5c632d7a086cda523bf4948e))
- **website:** forward Docusaurus props to DocSearch ([abfb06d](https://github.com/francoischalifour/autocomplete.js/commit/abfb06d6ebb6973ac40c890fa9d91dbe05459c13))

# [1.0.0-alpha.22](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.21...v1.0.0-alpha.22) (2020-07-09)

### Bug Fixes

- **docsearch:** support initial query ([dc476d3](https://github.com/francoischalifour/autocomplete.js/commit/dc476d322de3a8d4d589c638076767e009dd59e4))
- **website:** import DS variables and button styles dynamically ([bef75be](https://github.com/francoischalifour/autocomplete.js/commit/bef75be039479c6b45c0f12ec12c21d1af42520f))

### Features

- **docsearch:** attach `docsearch.js` user agent to vanilla renderer ([e1bd8d3](https://github.com/francoischalifour/autocomplete.js/commit/e1bd8d3a94147b325adacafd5f609d5184d4aeb2))
- **docsearch:** introduce `transformSearchClient` API ([edf6b9b](https://github.com/francoischalifour/autocomplete.js/commit/edf6b9b77b187d6d32e43c335593eb8b1a3daacf))
- **docsearch:** introduce DocSearch.js v3 ([#56](https://github.com/francoischalifour/autocomplete.js/issues/56)) ([0ff2462](https://github.com/francoischalifour/autocomplete.js/commit/0ff2462b44eb6b42f1e4d8f53361315b0247a17b))
- **docsearch:** track `docsearch-react` UA ([2c280e2](https://github.com/francoischalifour/autocomplete.js/commit/2c280e2ad9ca6a8d99c7e60ac6da48dd06991d30))
- **website:** lazy load DocSearch styles ([e3bc021](https://github.com/francoischalifour/autocomplete.js/commit/e3bc021b52e282c5e516e84c2988e4c8c8355837))
- **website:** track `docsearch-docusaurus` UA ([eb400f2](https://github.com/francoischalifour/autocomplete.js/commit/eb400f2e4ac4c4fe2eb08bb84581ea07dd20665a))

# [1.0.0-alpha.21](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.20...v1.0.0-alpha.21) (2020-07-07)

### Bug Fixes

- **css:** don't display key shortcuts on mobile ([1adc418](https://github.com/francoischalifour/autocomplete.js/commit/1adc418722f0017b1d504e7d3f7dda8e8104a352))
- **css:** firefox placeholder opacity ([49f7ac3](https://github.com/francoischalifour/autocomplete.js/commit/49f7ac3c9a7680a4e49593f278cb815d52d8d48b))
- **docsearch:** remove theme media query ([a1030e4](https://github.com/francoischalifour/autocomplete.js/commit/a1030e493c22c5c615fa9c49e385030452b18729))
- **test:** removed extra percy snapshot ([24e38b7](https://github.com/francoischalifour/autocomplete.js/commit/24e38b7771471609e190c5c1a61c57627126551a))

### Features

- **docsearch:** support keyboard on focus on default integration ([7600f2a](https://github.com/francoischalifour/autocomplete.js/commit/7600f2a385b193fe5f60b67e135c1810e496052c))
- **docsearch:** support typing query when search button is focused ([#54](https://github.com/francoischalifour/autocomplete.js/issues/54)) ([dcf2247](https://github.com/francoischalifour/autocomplete.js/commit/dcf22474d93ab261d59d12a44b3d677b7271e86e))

# [1.0.0-alpha.20](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.19...v1.0.0-alpha.20) (2020-07-01)

### Features

- **docsearch:** add `/` keyboard shortcut ([d3a7275](https://github.com/francoischalifour/autocomplete.js/commit/d3a7275f03c8d397d797c9375a42bf977fc824ed))

# [1.0.0-alpha.19](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.18...v1.0.0-alpha.19) (2020-06-24)

### Bug Fixes

- **ci:** fix orbs declaration ([db902a1](https://github.com/francoischalifour/autocomplete.js/commit/db902a12972a206f2b75646f40625376a80cad82))
- **ci:** Install cypress ([fb32788](https://github.com/francoischalifour/autocomplete.js/commit/fb327886b6d22d3c59cab2f8e6a32b24c5bd8eaf))
- **ci:** install cypress with Yarn ([5f7dc27](https://github.com/francoischalifour/autocomplete.js/commit/5f7dc27547bcf195586d1ddb43f5a981bc1c7f42))
- **ci:** npm script + percy ([949a24a](https://github.com/francoischalifour/autocomplete.js/commit/949a24a9da50a6f1ca2c7b0a6891d0a09f63ae20))
- **ci:** remove test cypress job args ([c1bf37b](https://github.com/francoischalifour/autocomplete.js/commit/c1bf37b7966eb468281410e055a107f0e9ac3d0d))
- **ci:** rerun ([04fb6f6](https://github.com/francoischalifour/autocomplete.js/commit/04fb6f6f93da0fdd14949cb79176a1b678e83dbd))
- **ci:** use cypress docker image ([fa5521b](https://github.com/francoischalifour/autocomplete.js/commit/fa5521bce55e029e8510e41903024c4252ac2567))
- **ci:** use latest cypress browsers image with node 13 ([bdab390](https://github.com/francoischalifour/autocomplete.js/commit/bdab3901876668e7cbc5b3b15498ca82af90077a))
- **css:** fixed Modal height undefined on Gecko ([85753c5](https://github.com/francoischalifour/autocomplete.js/commit/85753c546da2465b731f70c4f7b6c6e06206feea))
- **cypress:** Added Verify and Info npm scripts ([5f4ae05](https://github.com/francoischalifour/autocomplete.js/commit/5f4ae05c58fb76d92517fab07f622444c3d9a5b3))
- **cypress:** changed env var name for cypress key ([28307a8](https://github.com/francoischalifour/autocomplete.js/commit/28307a84c92b2fe79939cfa4e0755a44326de54c))
- **docsearch:** hoist `transformItems` default value ([1e0ae9e](https://github.com/francoischalifour/autocomplete.js/commit/1e0ae9eefb5fc185cbf41e6ac5c876ed8be24075))
- **lint:** Disable import/no-common for percy ([8af940d](https://github.com/francoischalifour/autocomplete.js/commit/8af940d69bf9eb35bcc70fbc533abdcf721ea209))
- **lint:** set cariage return in prettier config ([3016601](https://github.com/francoischalifour/autocomplete.js/commit/3016601a47699a37e9fa30620e71eef3f30f8c6d))
- **lint:** set eol to auto ([e6db26e](https://github.com/francoischalifour/autocomplete.js/commit/e6db26e57aaf433b149dc16d9a846cdfa19c0314))
- **test:** lint ([896ef59](https://github.com/francoischalifour/autocomplete.js/commit/896ef5959f06576f03d6ecd4ff7ee6ce96333a6d))
- **ypress:** Record reuslts ([7dac93e](https://github.com/francoischalifour/autocomplete.js/commit/7dac93e6a538f69bfe44bfdfe0fbb939b0e241e1))

# [1.0.0-alpha.18](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2020-06-11)

### Bug Fixes

- **css:** overflow overlay not supported on gecko ([9e5b764](https://github.com/francoischalifour/autocomplete.js/commit/9e5b764794b5de5e2169ed13f48e024f5f1df812))

### Features

- **docsearch:** introduce `initialScrollY` option ([2d5b216](https://github.com/francoischalifour/autocomplete.js/commit/2d5b21684174f0940c405d4da6839b0e94412f61))

# [1.0.0-alpha.17](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2020-06-08)

### Bug Fixes

- **docsearch:** use `scrollTo` when unmounting modal ([aae0a14](https://github.com/francoischalifour/autocomplete.js/commit/aae0a1420caf17bb87249c988c735be5d5ae5c8a))

# [1.0.0-alpha.16](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2020-06-08)

### Bug Fixes

- **docsearch:** always use `aria-expanded` to `true` ([b89aeb5](https://github.com/francoischalifour/autocomplete.js/commit/b89aeb5c2eccb43b3657239c519caa34ed62299e))
- **dosearch:** don't add `distinct` search parameter ([1c11457](https://github.com/francoischalifour/autocomplete.js/commit/1c1145768a74f372c683fbee9d0aaaf0dd3fb62a))
- **website:** don't pass default `appId` ([62e0609](https://github.com/francoischalifour/autocomplete.js/commit/62e060917b864e2a86328ea9816252d50c189654))
- **website:** support missing `algolia` config ([4b30cdd](https://github.com/francoischalifour/autocomplete.js/commit/4b30cdd90bfb2226cfd5f34642ea1593a64f833b))
- **website:** update netlify.com to netlify.app ([9cbb80b](https://github.com/francoischalifour/autocomplete.js/commit/9cbb80bb9078a7a19750e8f2bbef6e69ecce9cda))

### Features

- **docsearch:** display 5 hits per category maximum ([7e6582c](https://github.com/francoischalifour/autocomplete.js/commit/7e6582cf0be5df74e8f239432db6309929caf1a6))
- **docsearch:** introduce `resultsFooterComponent` option ([b613bb2](https://github.com/francoischalifour/autocomplete.js/commit/b613bb2a63da604cbd44e5d3dff32a4e60c63723))
- **website:** add "Creating a renderer" guide ([71a94ea](https://github.com/francoischalifour/autocomplete.js/commit/71a94eab8cbe6e76219730b7eda3c60460dfc35b))
- **website:** add link to search page in DocSearch modal ([d610ce9](https://github.com/francoischalifour/autocomplete.js/commit/d610ce9cd717253b33a4596ee855268e38c82ffa))

# [1.0.0-alpha.15](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.14...v1.0.0-alpha.15) (2020-05-20)

### Bug Fixes

- **css:** scroll windows ([a966e74](https://github.com/francoischalifour/autocomplete.js/commit/a966e74aee86cf4b7b25818c3f2b0e2b463636ef))
- **css:** separate docusaurus css variables ([f41c31d](https://github.com/francoischalifour/autocomplete.js/commit/f41c31dd4af5bf5178982ed725f03dc67d0d4a6e))
- **docsearch:** use `scrollTop` on body ([129c1d1](https://github.com/francoischalifour/autocomplete.js/commit/129c1d13aa77e1f6c38d09ee3b9cfa2eb9df8f57))
- **website:** update DocSearch integration ([d41605d](https://github.com/francoischalifour/autocomplete.js/commit/d41605dd0d1451c1760ad78ab361fa5a52e35820))

# [1.0.0-alpha.14](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.13...v1.0.0-alpha.14) (2020-05-15)

### Bug Fixes

- **docsearch:** remove blur effect to avoid performance issues ([978229f](https://github.com/francoischalifour/autocomplete.js/commit/978229f2b838f71effe04b77876cbcf36f17e0a4))
- **docsearch:** use `scrollTop` for IE support ([b51e81d](https://github.com/francoischalifour/autocomplete.js/commit/b51e81d94b473ed3602b02073911899cc5dc6a4a))
- **docsearch:** use absolute URLs ([e1ed4e8](https://github.com/francoischalifour/autocomplete.js/commit/e1ed4e887a9e57af37e384fb08423d293502423c))

### Features

- **docsearch:** add `DocSearch` component ([218944e](https://github.com/francoischalifour/autocomplete.js/commit/218944e4412dc0afee54521895247736a86f16ca))
- **docsearch:** add `useDocSearchKeyboardEvents` API ([5697895](https://github.com/francoischalifour/autocomplete.js/commit/5697895167e7bdc61429b9794c92ef57cd0315bc))
- **docusaurus:** import DocSearch modal on hover ([e680f24](https://github.com/francoischalifour/autocomplete.js/commit/e680f2453a9339467f3e502586d3bccc23edb911))

# [1.0.0-alpha.13](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2020-04-24)

### Bug Fixes

- **fix**: update workspace dependencies when releasing ([076b7be](076b7be69f89fa677a66cb0a91c51d02d440ac0a))

# [1.0.0-alpha.12](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2020-04-24)

### Bug Fixes

- **docsearch:** add index name to localStorage key ([f5fbaa3](https://github.com/francoischalifour/autocomplete.js/commit/f5fbaa3b544038caa76cd8382af2a9c990f80a4f))

# [](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.11...v) (2020-04-24)

### Bug Fixes

- **docsearch:** add index name to localStorage key ([f5fbaa3](https://github.com/francoischalifour/autocomplete.js/commit/f5fbaa3b544038caa76cd8382af2a9c990f80a4f))

# [1.0.0-alpha.11](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-04-24)

### Features

- **docsearch**: create clean exports ([d0f8ff3](https://github.com/francoischalifour/autocomplete.js/commit/d0f8ff3ab4f89c9dce1f2bdc923d94aed7515dc1))
- **design:** icon actions ([056d333](https://github.com/francoischalifour/autocomplete.js/commit/056d333780d6c5f48cf86236b443916b75b073b4))
- **design:** new error icons + update icons + update light shadows / searchbox ([2e77e70](https://github.com/francoischalifour/autocomplete.js/commit/2e77e70e792ccb52d7c6300f149697fad441fd2e))
- **design:** new icons ([5bd3cbc](https://github.com/francoischalifour/autocomplete.js/commit/5bd3cbc10693d3b65f7908e3523fa9bcc187f0ea))
- **docsearch:** add `hitComponent` and `transformItems` options ([daaafe5](https://github.com/francoischalifour/autocomplete.js/commit/daaafe5178cd43e258e389f579bc7517a3935b09))
- **docsearch:** add DocSearch for Docusaurus ([#39](https://github.com/francoischalifour/autocomplete.js/issues/39)) ([ad63053](https://github.com/francoischalifour/autocomplete.js/commit/ad630539c444417f414e0e8bcf74fd20f7cd73c8))
- **docsearch:** add recent searches ([#40](https://github.com/francoischalifour/autocomplete.js/issues/40)) ([36e7fab](https://github.com/francoischalifour/autocomplete.js/commit/36e7fabe43582fe358cb15f92e5afddecd5f1a7d))
- **docsearch:** add search suggestions ([d1fe8b2](https://github.com/francoischalifour/autocomplete.js/commit/d1fe8b2be3d30f067892ac9f04f6f802b6b40826))
- **docsearch:** allow placeholder customization ([3a4f13b](https://github.com/francoischalifour/autocomplete.js/commit/3a4f13b35198a0372f6d4cab7b661e774e424c6f))
- **docsearch:** animate cards on action ([8c7bdc1](https://github.com/francoischalifour/autocomplete.js/commit/8c7bdc117f6a76a53c9245a2089cda5dd02b71e6))
- **docsearch:** append modal to body ([73a7f0e](https://github.com/francoischalifour/autocomplete.js/commit/73a7f0ed491407d9c80ef9d14ddd704c0ac8f7c4))
- **docsearch:** catch retry errors in the search client ([750c4b5](https://github.com/francoischalifour/autocomplete.js/commit/750c4b51e2159a787613aa959ac62238c1f1a65b))
- **docsearch:** display more recent searches when no favorites ([a4c7082](https://github.com/francoischalifour/autocomplete.js/commit/a4c70825cc5d204b0ee44bcb8965a325f7fa5471))
- **docsearch:** forward props to autocomplete-core ([7cbcb12](https://github.com/francoischalifour/autocomplete.js/commit/7cbcb128bd59fe5c550ffb534f399b2b1022e5a3))
- **docsearch:** introduce favorite searches ([61bd0aa](https://github.com/francoischalifour/autocomplete.js/commit/61bd0aa5f768658c70f7cb0b7bb465c9b9579da7))
- **docsearch:** introduce Selection Search ([d5fd4d6](https://github.com/francoischalifour/autocomplete.js/commit/d5fd4d66a08a1b6d7f990757261c5f9e32e95c1c))
- **docsearch:** save content record hit parent in recent searches ([3fe547f](https://github.com/francoischalifour/autocomplete.js/commit/3fe547f2cc17f2c5a2f1c526bca4e98b42093e1f))
- **docsearch:** trap focus in modal ([0ca92ca](https://github.com/francoischalifour/autocomplete.js/commit/0ca92ca18b60d3949f4150a7afb5eb1f6984612d))
- **docsearch:** use `preconnect` link in Docusaurus integration ([33e2e8b](https://github.com/francoischalifour/autocomplete.js/commit/33e2e8bd9436222933e7bd949082c3a446cb9f6e))
- **docsearch:** use relative URLs ([f434ca1](https://github.com/francoischalifour/autocomplete.js/commit/f434ca1f92c9638ddfa42f3cd8b7d0093490830f))

# [1.0.0-alpha.10](https://github.com/francoischalifour/autocomplete.js/compare/v0.37.0...v1.0.0-alpha.10) (2020-03-31)

### Bug Fixes

- remove unused prop getters ([074c92d](https://github.com/francoischalifour/autocomplete.js/commit/074c92d3601cd0208759a211b2d22ca2430a2340))
- **core:** call `generateAutocompleteId` only if necessary ([ce4d496](https://github.com/francoischalifour/autocomplete.js/commit/ce4d496d1f074d02051c1cbe1f296d2a5d6e1c1c))
- **getters:** compute `aria-autocomplete` based on the props ([9ea5042](https://github.com/francoischalifour/autocomplete.js/commit/9ea5042c3a78126c09b03daff2b682db4535aba1))
- **getters:** don't forward data prop getters ([0deb9a1](https://github.com/francoischalifour/autocomplete.js/commit/0deb9a14a14e7730c2b54c63a5138a4bfcd2d1e7))
- **react:** fix options types ([fdde35f](https://github.com/francoischalifour/autocomplete.js/commit/fdde35ff26da7a097c073816e1da76d6f0e6ed49))
- **react:** remove dropdown from DOM when closed ([c647224](https://github.com/francoischalifour/autocomplete.js/commit/c64722467f7ab77babc6e53b4f46386efd335d95))

### Features

- **core:** allow input pause in keyboard navigation ([0000499](https://github.com/francoischalifour/autocomplete.js/commit/000049971884e958e92cbfd14331ab88ff2b5e1f))
- **core:** introduce `getDropdownProps` ([9b758ee](https://github.com/francoischalifour/autocomplete.js/commit/9b758eee271954eb7228916bf822b09a1a715e61))
- **react:** attach Algolia agents in React renderer ([c6c4da5](https://github.com/francoischalifour/autocomplete.js/commit/c6c4da580afec6dbf69b55c55809b1e1f9b8e9fc))
- **react:** create highlighting components ([fb49161](https://github.com/francoischalifour/autocomplete.js/commit/fb49161ea59f3ff925bcffe3e74435acb6e47c18))
- add openOnFocus and remove minLength ([#31](https://github.com/francoischalifour/autocomplete.js/issues/31)) ([553ea68](https://github.com/francoischalifour/autocomplete.js/commit/553ea68950bfc94eb8588a71dd5580db4682931c))
- swap Preact with React ([#34](https://github.com/francoischalifour/autocomplete.js/issues/34)) ([e0f2568](https://github.com/francoischalifour/autocomplete.js/commit/e0f25689440f7177e663ac6306e49f8f89a0727a))
- **autoFocus:** add support for `autoFocus` option ([4d3f792](https://github.com/francoischalifour/autocomplete.js/commit/4d3f7921307ef9417a8dd1147e71309350de77fe))
- **core:** filter out falsy sources ([f771522](https://github.com/francoischalifour/autocomplete.js/commit/f771522df77f3297644aec5214b459fc960f0b3f))
- **core:** introduce `getEnvironmentProps` for mobile experience ([#27](https://github.com/francoischalifour/autocomplete.js/issues/27)) ([f9d7eed](https://github.com/francoischalifour/autocomplete.js/commit/f9d7eed75514911ee45ed3aaee47c30373fdbd8a))
- **core:** process completion as a state enhancer ([#29](https://github.com/francoischalifour/autocomplete.js/issues/29)) ([53c2ef7](https://github.com/francoischalifour/autocomplete.js/commit/53c2ef7b1b985486199ae2dc54069a7bcfe3b41a))
- **core:** rename `shouldDropdownOpen` to `shouldDropdownShow` ([f2c3eb2](https://github.com/francoischalifour/autocomplete.js/commit/f2c3eb2d5ec6e5338df5b685af8edfb6cc477659)), closes [/github.com/francoischalifour/autocomplete.js/pull/16#pullrequestreview-355978230](https://github.com//github.com/francoischalifour/autocomplete.js/pull/16/issues/pullrequestreview-355978230)
- **core:** support `onHighlight` on sources ([0f4101b](https://github.com/francoischalifour/autocomplete.js/commit/0f4101bbf82e15afcc6f02ae1075a05dee7f261c))
- **core:** support `onSelect` on sources ([0cf0a93](https://github.com/francoischalifour/autocomplete.js/commit/0cf0a93bf3e5c04972e70c716867ce82e220c640))
- **onInput:** support `onInput` prop for controlled mode ([7345eb9](https://github.com/francoischalifour/autocomplete.js/commit/7345eb9c279b28a00bc833912fa9697654becab0))
- **onSubmit:** introduce `onSubmit` option ([#24](https://github.com/francoischalifour/autocomplete.js/issues/24)) ([ca0891c](https://github.com/francoischalifour/autocomplete.js/commit/ca0891c87256f0eb6a04f28fbf92b42826346c67))
- **react:** introduce `inputRef` for focus management ([#32](https://github.com/francoischalifour/autocomplete.js/issues/32)) ([4d804fe](https://github.com/francoischalifour/autocomplete.js/commit/4d804fe62ee7d67fb335866aeeb87f070255319e))
- **react:** place dropdown with Popper ([#25](https://github.com/francoischalifour/autocomplete.js/issues/25)) ([ca38070](https://github.com/francoischalifour/autocomplete.js/commit/ca380704f6506dc6c9c82b564701da3ce5772109))
- **website:** add Docusaurus 2 website ([#33](https://github.com/francoischalifour/autocomplete.js/issues/33)) ([3ee0ab5](https://github.com/francoischalifour/autocomplete.js/commit/3ee0ab53bd3d78ac3943fd35ec54f14d016dbd5a))

<a name="0.37.0"></a>

# [0.37.0](https://github.com/algolia/autocomplete.js/compare/v0.36.0...v0.37.0) (2019-08-30)

### Bug Fixes

- **clear:** Avoid error when clear is called after destroy ([#287](https://github.com/algolia/autocomplete.js/issues/287)) ([244425d](https://github.com/algolia/autocomplete.js/commit/244425d))

<a name="0.36.0"></a>

# [0.36.0](https://github.com/algolia/autocomplete.js/compare/v0.35.0...v0.36.0) (2019-02-21)

### Bug Fixes

- **standalone:** use aria label from input ([#276](https://github.com/algolia/autocomplete.js/issues/276)) ([4b94466](https://github.com/algolia/autocomplete.js/commit/4b94466))

<a name="0.35.0"></a>

# [0.35.0](https://github.com/algolia/autocomplete.js/compare/v0.34.0...v0.35.0) (2018-12-17)

### Bug Fixes

- **chrome-only:** Change autocomplete from 'nope' to 'off' ([#273](https://github.com/algolia/autocomplete.js/issues/273)) ([892a8f0](https://github.com/algolia/autocomplete.js/commit/892a8f0))
- **utils:** correct \_.every method ([#274](https://github.com/algolia/autocomplete.js/issues/274)) ([55af1e3](https://github.com/algolia/autocomplete.js/commit/55af1e3))

<a name="0.34.0"></a>

# [0.34.0](https://github.com/algolia/autocomplete.js/compare/v0.33.0...v0.34.0) (2018-12-04)

### Features

- change autocomplete from 'off' to 'nope' ([#250](https://github.com/algolia/autocomplete.js/issues/250)) ([fbbed04](https://github.com/algolia/autocomplete.js/commit/fbbed04))

<a name="0.33.0"></a>

# [0.33.0](https://github.com/algolia/autocomplete.js/compare/v0.32.0...v0.33.0) (2018-11-19)

### Bug Fixes

- **release:** Update mversion to 1.12 ([#268](https://github.com/algolia/autocomplete.js/issues/268)) ([08b8e30](https://github.com/algolia/autocomplete.js/commit/08b8e30))

### Features

- **selected:** Adding context.selectionMethod to selected event ([#267](https://github.com/algolia/autocomplete.js/issues/267)) ([36028a6](https://github.com/algolia/autocomplete.js/commit/36028a6))

<a name="0.32.0"></a>

# [0.32.0](https://github.com/algolia/autocomplete.js/compare/v0.31.0...v0.32.0) (2018-11-06)

### Bug Fixes

- **zepto:** apply patch to prevent an error ([#263](https://github.com/algolia/autocomplete.js/issues/263)) ([917d5a7](https://github.com/algolia/autocomplete.js/commit/917d5a7))

### Features

- **source:** add cache disabling for datasets ([#254](https://github.com/algolia/autocomplete.js/issues/254)) ([0e65fee](https://github.com/algolia/autocomplete.js/commit/0e65fee))
- add flag for toggling tab autocompletion ([#260](https://github.com/algolia/autocomplete.js/issues/260)) ([4dc7c52](https://github.com/algolia/autocomplete.js/commit/4dc7c52))
- Throw err on update if suggestions are invalid type ([#256](https://github.com/algolia/autocomplete.js/issues/256)) ([179febf](https://github.com/algolia/autocomplete.js/commit/179febf)), closes [#131](https://github.com/algolia/autocomplete.js/issues/131)

<a name="0.31.0"></a>

# [0.31.0](https://github.com/algolia/autocomplete.js/compare/v0.30.0...v0.31.0) (2018-08-08)

### Bug Fixes

- **dataset:** avoid to call the source when upadte is canceled ([a47696d](https://github.com/algolia/autocomplete.js/commit/a47696d))
- **dataset:** avoid usage of callNow for debounce ([1a0ce74](https://github.com/algolia/autocomplete.js/commit/1a0ce74))
- Handle an odd case with the user agent ([#242](https://github.com/algolia/autocomplete.js/issues/242)) ([c194736](https://github.com/algolia/autocomplete.js/commit/c194736))

### Features

- update dist files ([9babf2e](https://github.com/algolia/autocomplete.js/commit/9babf2e))
- **clearOnSelected:** allow users to clear the input instead of filling ([#244](https://github.com/algolia/autocomplete.js/issues/244)) ([aa2edbb](https://github.com/algolia/autocomplete.js/commit/aa2edbb)), closes [#241](https://github.com/algolia/autocomplete.js/issues/241)

<a name="0.30.0"></a>

# [0.30.0](https://github.com/algolia/autocomplete.js/compare/v0.29.0...v0.30.0) (2018-04-30)

<a name="0.29.0"></a>

# [0.29.0](https://github.com/algolia/autocomplete.js/compare/v0.28.3...v0.29.0) (2017-10-12)

### Features

- **a11y:** Add ariaLabel option. ([6db8e1b](https://github.com/algolia/autocomplete.js/commit/6db8e1b))
- **a11y:** Add option to control `aria-labelledby` attribute. ([0491c43](https://github.com/algolia/autocomplete.js/commit/0491c43))

<a name="0.28.3"></a>

## [0.28.3](https://github.com/algolia/autocomplete.js/compare/v0.28.2...v0.28.3) (2017-07-31)

<a name="0.28.2"></a>

## [0.28.2](https://github.com/algolia/autocomplete.js/compare/v0.28.1...v0.28.2) (2017-06-22)

### Bug Fixes

- **empty template:** hide main empty template as long as we have results ([344e225](https://github.com/algolia/autocomplete.js/commit/344e225)), closes [#185](https://github.com/algolia/autocomplete.js/issues/185)

<a name="0.28.1"></a>

## [0.28.1](https://github.com/algolia/autocomplete.js/compare/v0.28.0...v0.28.1) (2017-03-29)

### Bug Fixes

- **iOS:** remove double tap bug on hrefs in suggestions ([e532bd8](https://github.com/algolia/autocomplete.js/commit/e532bd8))

<a name="0.28.0"></a>

# [0.28.0](https://github.com/algolia/autocomplete.js/compare/v0.27.0...v0.28.0) (2017-03-24)

<a name="0.27.0"></a>

# [0.27.0](https://github.com/algolia/autocomplete.js/compare/v0.26.0...v0.27.0) (2017-03-06)

### Bug Fixes

- **UA:** add failsafe if params not provided ([30df97a](https://github.com/algolia/autocomplete.js/commit/30df97a)), closes [#166](https://github.com/algolia/autocomplete.js/issues/166)

<a name="0.26.0"></a>

# [0.26.0](https://github.com/algolia/autocomplete.js/compare/v0.25.0...v0.26.0) (2017-02-28)

### Bug Fixes

- **test:** bad handling of no actual inner mechanics of client ([622aec5](https://github.com/algolia/autocomplete.js/commit/622aec5))

### Features

- **algolia agent:** provide an algolia agent when searching ([6ca7ac2](https://github.com/algolia/autocomplete.js/commit/6ca7ac2))
- **algolia agent:** provide an algolia agent when searching ([ef604e1](https://github.com/algolia/autocomplete.js/commit/ef604e1))

<a name="0.25.0"></a>

# [0.25.0](https://github.com/algolia/autocomplete.js/compare/v0.24.2...v0.25.0) (2017-02-07)

### Bug Fixes

- **zepto:** .is() only accepts selectors, reworked code to use pure DOM ([a47a4d4](https://github.com/algolia/autocomplete.js/commit/a47a4d4)), closes [#144](https://github.com/algolia/autocomplete.js/issues/144)

<a name="0.24.2"></a>

## [0.24.2](https://github.com/algolia/autocomplete.js/compare/v0.24.1...v0.24.2) (2017-01-20)

### Bug Fixes

- **dep:** immediate is a dependency, not a devDependency ([22164ad](https://github.com/algolia/autocomplete.js/commit/22164ad))

<a name="0.24.1"></a>

## [0.24.1](https://github.com/algolia/autocomplete.js/compare/v0.24.0...v0.24.1) (2017-01-20)

### Bug Fixes

- **postMessage:** avoid using postMessage when feasible ([a99f664](https://github.com/algolia/autocomplete.js/commit/a99f664)), closes [#142](https://github.com/algolia/autocomplete.js/issues/142)

<a name="0.24.0"></a>

# [0.24.0](https://github.com/algolia/autocomplete.js/compare/0.23.0...v0.24.0) (2017-01-10)

### Bug Fixes

- **angular:** do not launch the directive if autocomplete has a value ([f96a1ba](https://github.com/algolia/autocomplete.js/commit/f96a1ba)), closes [#136](https://github.com/algolia/autocomplete.js/issues/136)
- **typeahead:** propagate redrawn ([82293e4](https://github.com/algolia/autocomplete.js/commit/82293e4))

### Features

- **appendTo:** new parameter ([e40cbd0](https://github.com/algolia/autocomplete.js/commit/e40cbd0))

### 0.23.0 Dec 14, 2016

- feat(build): add noConflict() for standalone build, fixes #133

### 0.22.1 Nov 07, 2016

- Fixes bad behavior when `autoselectOnBlur` used, fixes #113

### 0.22.0 Oct 25, 2016

- Add `autocomplete:cursorremoved` event, see #105
- Add `autoselectOnBlur` option, fixes #113

### 0.21.8 Oct 3, 2016

- Do not allow Zepto to leak to window. Never.

### 0.21.7 Sep 21, 2016

- Ensure the `empty` templates get displayed before the `footer`.
- Ensure the dataset `empty` templates are displayed when all datasets are empty.

### 0.21.6 Sep 20, 2016

- Make sure we don't leak/override `window.Zepto`.

### 0.21.5 Sep 15, 2016

- While selecting the top suggestion (autoselect=true), do not update the input.

### 0.21.4 Sep 2, 2016

- Ensure the cursor selects the first suggestion when the dropdown is shown + send the `cursorchanged` event.

### 0.21.3 Aug 1, 2016

- Ensure empty template displays from first keystroke (#104)

### 0.21.2 July 26, 2016

- fix(empty): fix the empty even handling, fixes #95

### 0.21.1 July 19, 2016

- fix(getVal): fix getVal on standalone build

### 0.21.0 July 15, 2016

- Upgrade to zepto 1.2.0

### 0.20.1 June 14, 2016

- Ensure the dropdown menu is hidden when there is an `$empty` block and blank query.

### 0.20.0 June 04, 2016

- Ensure we don't update the input value on mouseenter (#76)
- Render an `empty` template if no results (#80)

### 0.19.1 May 04, 2016

- Fixed the angular build (\_.Event was undefined)

### 0.19.0 Apr 25, 2016

- Allow select handler to prevent menu from being closed (#72)
- Do not trigger the cursorchanged event while entering/leaving nested divs (#71)

### 0.18.0 Apr 07, 2016

- Ability to customize the CSS classes used to render the DOM
- Ensure the `autocomplete:cursorchanged` event is called on `mouseover` as well

### 0.17.3 Apr 04, 2016

- Standalone: ensure we actually use the Zepto object and not whatever is in `window.$`

### 0.17.2 Mar 21, 2016

- Ability to setup the autocomplete on a multi-inputs Zepto selector
- Propagate the `shown` event to the top-level

### 0.17.1 Mar 19, 2016

- REVERT [Ability to setup the autocomplete on a multi-inputs Zepto selector] Fix #59

### 0.17.0 Mar 18, 2016

- Ability to setup the autocomplete on a multi-inputs Zepto selector
- Add a new `shown` event triggered when the dropdown menu is opened and non-empty

BREAKING CHANGE: the standalone object returned by the `autocomplete()` method is now a Zepto object.

### 0.16.2 Jan 22, 2016

- stop using weird zepto package. Stop using chained .data calls it seems that chaining them ended up in an `undefined` return value when passing `undefined` as a value

### 0.16.1 Jan 22, 2016

- remove npm-zepto, use zepto original package (now on npm) fixes #48

### 0.16.0 Dec 11, 2015

- Emit a new `autocomplete:updated` event as soon as a dataset is rendered

### 0.15.0 Dec 10, 2015

- Ability to configure the dropdown menu container

### 0.14.1 Dec 2, 2015

- Move Zepto as a dependency (not a peer dep)
- Really use the `query` instead of the `displayKey` (was supposed to be fixed in 0.11.0)

### 0.14.0 Nov 28, 2015

- Move npm-zepto & angular to peerDependencies
- Fixed custom dropdownMenu's footer & header not being displayed properly
- Allow dataset with name=0

### 0.13.1 Nov 25, 2015

- Move the bower release name to `algolia-autocomplete.js` since `autocomplete.js` is already used

### 0.13.0 Nov 25, 2015

- Add Bower release

### 0.12.0 Oct 15, 2015

- Expose the underlying `close`, `open`, ... functions in the standalone build.

### 0.11.1 Oct 13, 2015

- Zepto doesn't work like jQuery regarding the `data` API, it doesn't support serializing objects.

### 0.11.0 Oct 07, 2015

- If the `displayKey` is not specified and the `value` attribute missing, don't update the input value with `undefined`.
- Expose the `sources` object in the Angular.js build as well.

### 0.10.0 Oct 06, 2015

- Add a new `includeAll` option to the `popularIn` source to add an extra suggestion.

### 0.9.0 Oct 01, 2015

- Full CommonJS compliance (moved from browserify to webpack)

### 0.8.0 Sep 24, 2015

- UMD compliance

### 0.7.0 Sep 16, 2015

- New standalone build (including Zepto.js)
- Get rid of lodash-compat and use jQuery, Zepto or Angular.js's helper functions

### 0.6.0 Sep 11, 2015

- Add Zepto.js support.

### 0.5.0 Sep 9, 2015

- The wrapper span will now have a `table-cell` display if the original input was a `block` inside a `table`.

### 0.4.0 Aug 12, 2015

- Add a new `openOnFocus` option to open the dropdown menu when the input is focused

### 0.3.0 July 27, 2015

- Add Angular.js support [#7]

### 0.2.0 July 16, 2015

- Ability to change the layout based on the matching datasets [#11]

### 0.1.0 July 13, 2015

- Start using semantic versioning

### 0.0.2 July 13, 2015

- Ability to keep the dropdown menu opened when the input if blurred [#1]
- Ability to use a custom dropdown menu template [#2]
- Ability to configure a custom header/footer on the dropdown menu [#3]

### 0.0.1 July 12, 2015

- First release based on Twitter's typeahead.js library
- Travis-ci.org, Coveralls.io, Saucelabs.com integration
- CommonJS compatibility
