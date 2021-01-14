---
id: introduction
title: What is Autocomplete?
---

Autocomplete is an open-source, production-ready JavaScript library for building autocomplete search experiences.

A basic autocomplete experience works like this: as a user types into an input, the autocomplete UX "completes" their thought by providing completed search terms or results.

For example, try typing the letter "s" into the **Search** bar on the top right of this site. You're given the ability to navigate directly to documentation on concepts like "**s**ources" and "**s**tate". If you continue to type, say "st", the results are refined. You see pages having to do with "**st**ate," "getting **st**arted," and "**st**atic sources."

**Autocomplete is now a ubiquitous part of most search experiences.** Search providers like Google, e-commerce sites like Amazon, and messaging apps like Slack all offer autocomplete experiences on mobile and desktop.

While this site's autocomplete shows documentation pages, autocomplete menus frequently show completed search terms. If you begin a search by typing the letter "j" into Google, it provides complete search terms like "javascript", "jest", "jsonlines", etc. Selecting one of these lands you on the search results page for the term.

This experience minimizes typing, which is particularly impactful on mobile. It enables users to find what they're looking for quicker. It also exposes them to searches, products, or pages they may not have thought of but are interested in anyway.

You may have already used UIs powered by this Autocomplete library. The [Algolia](https://www.algolia.com/doc/), [React Native](https://reactnative.dev/), and other documentation websites are powered by this library and the [DocSearch](https://docsearch.algolia.com/) project. This library is flexible enough to power more than just documentation search though. **Its purpose is to help you build interactive and accessible autocomplete experiences, regardless of your use case.**

## What does this library provide?

Autocomplete is a JavaScript library that lets you quickly build autocomplete search experiences. You can use it to create an autocomplete UX if you have:

- Existing markup where you want to embed the experience,
- Data to fill the autocomplete dropdown with.

For example, if you have an element you want to embed an autocomplete experience into, you only need to configure it as the `container` in the [basic configuration options](/docs/basic-options). Then, once, you've configured the data to populate the autocomplete, the library creates and embeds the interactive DOM elements that make up the UX.

The data that populates the autocomplete results are called [`sources`](/docs/sources). The library is agnostic as to what you use for your  [`sources`](/docs/sources).  They could be recent searches, a static set of searches terms, or from an external source, like an [Algolia](https://www.algolia.com/doc/guides/getting-started/what-is-algolia/) index.

By configuring just those two required parameters (`container` and `getSources`) you can have an interactive autocomplete experience. **The library creates an input and provides the interactivity and accessibility attributes, but you're in full control of the DOM elements to output.**

You don't have to display just suggested search terms, you can display links for actual results themselves (rather than links to results pages) or even display "actions" that a user can take from within an autocomplete. For example, you could let your users turn dark mode on, directly from an autocomplete, if they begin to type "darkmode".

You can display different data types (such as suggested search terms, product results, and actions) differently. The format of each datatype and layout is customizable and up to you.

## What doesn't this library provide?

This library isn't a set of components like [Algolia's InstantSearch libraries](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/). You should have markup you want to plug the experience into and be able to provide the data that gets displayed.

Ready to learn more? Move on to [Getting Started](/docs/getting-started) to see a basic example in action.
