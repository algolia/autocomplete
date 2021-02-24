---
id: api
title: Introduction
---

import Draft from './partials/draft.md'
import PluginsList from './partials/plugins-list.md'

The API reference contains technical information on all Autocomplete packages.

This API references how to import and use the Autocomplete APIs without guidance. Make sure to read the [**Core concepts**](basic-options) first. To learn more about Autocomplete patterns, head over to the [**Guides**](#).

Autocomplete provides an ecosystem of companion libraries you can use for various purposes.

## Core

The [`autocomplete-core`](createAutocomplete) package is the foundation of Autocomplete. It exposes primitives to build an autocomplete experience.

You likely don't need to use this package directly unless you're building a [renderer](#renderers).

## Renderers

Renderers [provide a UI](creating-a-renderer) to headless autocomplete experiences built with [`autocomplete-core`](createAutocomplete). For example, [`autocomplete-js`](autocomplete-js) is an agnostic virtual DOM renderer. You can use it in JavaScript, Preact, React, or Vue projects.

**Custom renderers are an advanced pattern that you should only use when hitting the limits of [`autocomplete-js`](autocomplete-js).** For instance, you might need your own renderer when working with a JavaScript library that doesn't use a virtual DOM or when the layout structure of [`autocomplete-js`](autocomplete-js) is too constraining for your use case.

## Plugins

Plugins encapsulate custom functionalities. They abstract common behaviors that you might want to use in your experience by hooking into the Autocomplete lifecycle.

We provide a few official plugins:

<PluginsList />

You can [build your own plugin](plugins#building-your-own-plugin) by implementing the [`AutocompletePlugin` interface](https://github.com/algolia/autocomplete/blob/next/packages/autocomplete-js/src/types/AutocompletePlugin.ts).

## Presets

Presets provide utilities to use in Autocomplete experiences. They facilitate integration with other tools or libraries by providing common helpers and sane defaults.

We currently provide a single preset:

- [`autocomplete-preset-algolia`](getAlgoliaHits) provides fetching and highlighting utilities for usage with Algolia.

## Themes

Themes are CSS packages to style Autocomplete experiences. They work out of the box with the exposed class names from [`autocomplete-js`](autocomplete-js).

We currently provide a single theme:

- [`autocomplete-theme-classic`](autocomplete-theme-classic) is the official Autocomplete theme.
