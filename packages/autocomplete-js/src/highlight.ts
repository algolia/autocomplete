import {
  parseAlgoliaHitHighlight,
  parseAlgoliaHitReverseHighlight,
  parseAlgoliaHitReverseSnippet,
  parseAlgoliaHitSnippet,
} from '@algolia/autocomplete-preset-algolia';
import { Hit } from '@algolia/client-search';
import { createElement as preactCreateElement } from 'preact';

import { AutocompleteRenderer } from './types';

type HighlightItemParams<TItem> = {
  hit: TItem;
  attribute: keyof TItem | string[];
  tagName?: string;
  createElement?: AutocompleteRenderer['createElement'];
};

/**
 * Highlights and escapes the matching parts of an Algolia hit.
 */
export function highlightHit<TItem extends Hit<{}>>({
  hit,
  attribute,
  tagName = 'mark',
  createElement = preactCreateElement,
}: HighlightItemParams<TItem>) {
  return parseAlgoliaHitHighlight<TItem>({ hit, attribute }).map((x, index) =>
    x.isHighlighted ? createElement(tagName, { key: index }, x.value) : x.value
  );
}

/**
 * Highlights and escapes the non-matching parts of an Algolia hit.
 *
 * This is a common pattern for Query Suggestions.
 */
export function reverseHighlightHit<TItem extends Hit<{}>>({
  hit,
  attribute,
  tagName = 'mark',
  createElement = preactCreateElement,
}: HighlightItemParams<TItem>) {
  return parseAlgoliaHitReverseHighlight<TItem>({
    hit,
    attribute,
  }).map((x, index) =>
    x.isHighlighted ? createElement(tagName, { key: index }, x.value) : x.value
  );
}

/**
 * Highlights and escapes the matching parts of an Algolia hit snippet.
 */
export function snippetHit<TItem extends Hit<{}>>({
  hit,
  attribute,
  tagName = 'mark',
  createElement = preactCreateElement,
}: HighlightItemParams<TItem>) {
  return parseAlgoliaHitSnippet<TItem>({ hit, attribute }).map((x, index) =>
    x.isHighlighted ? createElement(tagName, { key: index }, x.value) : x.value
  );
}

/**
 * Highlights and escapes the non-matching parts of an Algolia hit snippet.
 *
 * This is a common pattern for Query Suggestions.
 */
export function reverseSnippetHit<TItem extends Hit<{}>>({
  hit,
  attribute,
  tagName = 'mark',
  createElement = preactCreateElement,
}: HighlightItemParams<TItem>) {
  return parseAlgoliaHitReverseSnippet<TItem>({
    hit,
    attribute,
  }).map((x, index) =>
    x.isHighlighted ? createElement(tagName, { key: index }, x.value) : x.value
  );
}
