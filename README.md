<div align="center">
	<a href="https://autocomplete.algolia.com"><img src="./media/illustration.png" alt="Autocomplete" width="200" height="200"></a>
	<h1>Autocomplete</h1>
	<p>
		<strong>A JavaScript library that lets you quickly build autocomplete experiences</strong>
	</p>

[![Version](https://img.shields.io/npm/v/@algolia/autocomplete-js.svg?style=flat-square)](https://www.npmjs.com/package/@algolia/autocomplete-js) [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

> 🚧 Autocomplete v1 is in an alpha phase and early feedback is welcome.
>
> **If you're looking for Autocomplete v0, which has been the production-ready version for the last years, [head over to the `master` branch](https://github.com/algolia/autocomplete/tree/master).**

All you need to get started is:

- A container to inject the experience into
- Data to fill the autocomplete with
- Any Virtual DOM solution (JavaScript, Preact, React, Vue, etc.)

The data that populates the autocomplete results are called [sources](https://autocomplete.algolia.com/docs/sources). You can use whatever you want in your sources: a static set of searches terms, search results from an external source like an [Algolia](<[Algolia](https://www.algolia.com/doc/guides/getting-started/what-is-algolia/)>) index, recent searches, and more.

By configuring just those two required parameters ([`container`](https://autocomplete.algolia.com/docs/autocomplete-js/#container) and [`getSources`](https://autocomplete.algolia.com/docs/autocomplete-js/#getsources)) you can have an interactive autocomplete experience. **The library creates an input and provides the interactivity and accessibility attributes, but you're in full control of the DOM elements to output**.

<p align="center">
  <a href="https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/js?file=/app.tsx">
    <img src="./media/screenshot.png" alt="Screenshot">
  </a>
  <br>
  <br>
  <strong>
  <a href="https://autocomplete.algolia.com/docs/introduction">Documentation</a> •
  <a href="https://autocomplete.algolia.com/docs/api">API</a> •
  <a href="https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/js?file=/app.tsx">Playground</a>
  </strong>
</p>

## Installation

The recommended way to get started is with the [`autocomplete-js`](https://autocomplete.algolia.com/docs/autocomplete-js) package. It includes everything you need to render a JavaScript autocomplete experience.

Otherwise, you can install the [`autocomplete-core`](https://autocomplete.algolia.com/docs/createAutocomplete) package if you want to [build a renderer](https://autocomplete.algolia.com/docs/creating-a-renderer) from scratch.

All Autocomplete packages are available on the [npm](https://www.npmjs.com) registry.

```bash
yarn add @algolia/autocomplete-js@alpha
# or
npm install @algolia/autocomplete-js@alpha
```

If you don't want to use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js@alpha"></script>
```

## Usage

To get started, you need a container for your autocomplete to go in. If you don't have one already, you can insert one into your markup:

```js title="HTML"
<div id="autocomplete"></div>
```

Then, insert your autocomplete into it by calling the [`autocomplete`](autocomplete-js) function and providing the [`container`](autocomplete-js/#container). It can be a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement).

Make sure to provide a container (e.g., a `div`), not an `input`. Autocomplete generates a fully accessible search box for you.

```js title="JavaScript"
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  container: '#autocomplete',
  // ...
});
```

Continue reading our [**Getting Started**](https://autocomplete.algolia.com/docs/getting-started#defining-where-to-put-your-autocomplete) guide.

## Documentation

The [documentation](https://autocomplete.algolia.com) offers a few ways to learn about the Autocomplete library:

- Read the [**Core Concepts**](https://autocomplete.algolia.com/docs/basic-options) to learn more about underlying principles, like [**Sources**](https://autocomplete.algolia.com/docs/sources) and [**State**](https://autocomplete.algolia.com/docs/state).
- Follow the [**Guides**](https://autocomplete.algolia.com/docs/using-query-suggestions-plugin) to understand how to build common UX patterns.
- Refer to [**API reference**](https://autocomplete.algolia.com/docs/api) for a comprehensive list of parameters and options.
- Try out the [**Playground**](https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/js?file=/app.tsx) where you can fork a basic implementation and play around.

You can find more on the [documentation](https://autocomplete.algolia.com).

## Support

- [GitHub Discussions](https://github.com/algolia/autocomplete/discussions)

## Packages

| Package | Description | Documentation |
| --- | --- | --- |
| [`autocomplete-core`](packages/autocomplete-core) | Core primitives to build an Autocomplete experience | [Documentation](https://autocomplete.algolia.com/docs/createAutocomplete) |
| [`autocomplete-js`](packages/autocomplete-js) | JavaScript package for Autocomplete | [Documentation](https://autocomplete.algolia.com/docs/autocomplete-js) |
| [`autocomplete-plugin-recent-searches`](packages/autocomplete-plugin-recent-searches) | A plugin to add recent searches to Algolia Autocomplete | [Documentation](https://autocomplete.algolia.com/docs/createLocalStorageRecentSearchesPlugin) |
| [`autocomplete-plugin-query-suggestions`](packages/autocomplete-plugin-query-suggestions) | A plugin to add query suggestions to Algolia Autocomplete | [Documentation](https://autocomplete.algolia.com/docs/createQuerySuggestionsPlugin) |
| [`autocomplete-plugin-algolia-insights`](packages/autocomplete-plugin-algolia-insights) | A plugin to add Algolia Insights to Algolia Autocomplete | [Documentation](https://autocomplete.algolia.com/docs/createAlgoliaInsightsPlugin) |
| [`autocomplete-preset-algolia`](packages/autocomplete-preset-algolia) | Presets to use Algolia features with Autocomplete | [Documentation](https://autocomplete.algolia.com/docs/getAlgoliaHits) |
| [`autocomplete-theme-classic`](packages/autocomplete-theme-classic) | Classic theme for Autocomplete | [Documentation](https://autocomplete.algolia.com/docs/autocomplete-theme-classic) |

## Showcase

See the awesome experiences people built with Autocomplete:

| [![DocSearch](./media/showcase/docsearch.png)](https://docsearch.algolia.com) | [![Algolia Documentation](./media/showcase/algolia-documentation.png)](https://algolia.com/doc) |
| --- | --- |
| <div align="center"><a href="https://docsearch.algolia.com">DocSearch</a></div> | <div align="center"><a href="https://algolia.com/doc">Algolia Documentation</a></div> |

## Sandboxes

Check out [sandboxes](https://codesandbox.io/search?refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=%40algolia%2Fautocomplete-core) using Autocomplete:

<div align="center">

[![Sandboxes](./media/sandboxes.png)](https://codesandbox.io/search?refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=%40algolia%2Fautocomplete-core)

</div>

## License

[MIT](LICENSE)
