---
id: with-instantsearch
title: Autocomplete with InstantSearch
---

Learn how to allow users to search from anywhere on your website, using Autocomplete with InstantSearch.

## Why use Autocomplete if I've got InstantSearch

Autocomplete brings the search experience from InstantSearch condensed in a full-featured search box. This search box can be available from anywhere on your website.

More than search, Autocomplete enables discovering all kind of information. For example, you can trigger an action like "shipping" that would bring you to the shipping page. This is what we call [multi-source](including-multiple-result-types).

The Autocomplete search box becomes the entry to your pre-set search page. It can both set a category and search. It's able to use context from visit and user, save recent searches, provide suggested searches, give [Algolia Answers](https://www.algolia.com/doc/guides/algolia-ai/answers/), etc. Every thing that is not yet developed can be with [Autocomplete Plugins](plugins).

The search experience would benefit from the Autocomplete design principles. You get instant results in a panel designed to reduce user effort with conversational experiences. This panel supports [rich source display](templates), using your Virtual DOM implementation of choice (JavaScript, Preact, [React](using-react), [Vue](using-vue), etc.).

## How to add Autocomplete with InstantSearch

Replace the InstantSearch search box widget with [`autocomplete`](autocomplete-js) that we plug InstantSearch's lifecycle.

_Code snippet_

When using both libraries on the same page, you need to choose between two experiences:

1. Keep an _as-you-type_ search results page
2. Refresh search results page on Autocomplete validation

### 1. Keep an as-you-type search results page

This is typically better for advanced keyboard users because two screens update at the same time. You can [debounce InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/going-further/improve-performance/js/#debouncing) to limit result flashing.

:::tip UX recommendation

Make sure that the Autocomplete dropdown doesn't overlap with the first InstantSeach results. This would prevent users from seeing key information in the search.

:::

_Code snippet_

### 2. Refresh search results page on Autocomplete validation

To limit flashes on the screen, the other strategy is to confirm an Autocomplete query before applying it to InstantSearch. This can happen on form submit (with [`onSubmit`](createAutocomplete#onsubmit)) or when an item is selected (with [`onSelect`](sources#onselect)).

_Code snippet_

## Bring the best of Autocomplete with InstantSearch

### Adapt Autocomplete results on the current page

When on the home page, you might want to display product items aside the recent searches and suggested queries. This is not required when Autocomplete is on the search results page.
