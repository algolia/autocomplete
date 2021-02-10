---
id: api
title: Introduction
---

The API ref contains details on all the Autocomplete packages.

import Draft from './partials/draft.md'

<Draft />

<!-- - what each package does
- using react or vue, use this
- the api ref explains the raw params, but go to the guides for more comprehensive info, etc.
- package namings, core, recents, presets which provides utils, plugins which are, theme, layouts, etc. -->

This API references how to import and use the Autocomplete APIs without guidance. Make sure to read the [**Core concepts**](basic-options) first. To learn more about Autocomplete patterns, head over to the [**Guides**](adding-suggested-searches).

Autocomplete contains several kind of packages:

## Core

[`autocomplete-core`](createAutocomplete) returns the methods to create an autocomplete experience.

## Renderers

Renderers implement `autocomplete-core` to provide a UI. [`autocomplete-js`](autocomplete-js) is a virtual DOM renderer. You can use it in your JavaScript, Preact, React or Vue projects.

Other examples of renderers are [DocSearch 3](https://docsearch.algolia.com) and the documentation search available on the [Algolia docs](https://www.algolia.com/doc).

## Plugins

Plugins encapsulate and distribute custom Autocomplete behaviors. We provide a few plugins:

- [`autocomplete-plugin-recent-searches`](createLocalStorageRecentSearchesPlugin)
- [`autocomplete-plugin-query-suggestions`](createQuerySuggestionsPlugin)
- [`autocomplete-plugin-algolia-insights`](createAlgoliaInsightsPlugin)

## Presets

Presets provides utilities to use in your Autocomplete experiences.

[`autocomplete-preset-algolia`](getAlgoliaHits) provides the fetching and highlighting utils for Algolia.

## Themes

Themes are CSS packages that design the Autocomplete experience.

[`autocomplete-theme-classic`](autocomplete-theme-classic) is the theme we provide.
