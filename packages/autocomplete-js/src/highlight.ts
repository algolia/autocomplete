import {
  parseAlgoliaHitHighlight,
  parseAlgoliaHitReverseHighlight,
  parseAlgoliaHitReverseSnippet,
  parseAlgoliaHitSnippet,
  HighlightedHit,
  SnippetedHit,
} from '@algolia/autocomplete-preset-algolia';
import { createElement as preactCreateElement } from 'preact';

import { AutocompleteRenderer } from './types';

type HighlightItemParams<THit> = {
  hit: THit;
  attribute: keyof THit | string[];
  tagName?: string;
  createElement?: AutocompleteRenderer['createElement'];
};

/**
 * Highlights and escapes the matching parts of an Algolia hit.
 */
export function highlightHit<THit extends HighlightedHit<unknown>>({
  hit,
  attribute,
  tagName = 'mark',
  createElement = preactCreateElement,
}: HighlightItemParams<THit>) {
  return parseAlgoliaHitHighlight<THit>({ hit, attribute }).map((x, index) =>
    x.isHighlighted ? createElement(tagName, { key: index }, x.value) : x.value
  );
}

/**
 * Highlights and escapes the non-matching parts of an Algolia hit.
 *
 * This is a common pattern for Query Suggestions.
 */
export function reverseHighlightHit<THit extends HighlightedHit<unknown>>({
  hit,
  attribute,
  tagName = 'mark',
  createElement = preactCreateElement,
}: HighlightItemParams<THit>) {
  return parseAlgoliaHitReverseHighlight<THit>({
    hit,
    attribute,
  }).map((x, index) =>
    x.isHighlighted ? createElement(tagName, { key: index }, x.value) : x.value
  );
}

/**
 * Highlights and escapes the matching parts of an Algolia hit snippet.
 */
export function snippetHit<THit extends SnippetedHit<unknown>>({
  hit,
  attribute,
  tagName = 'mark',
  createElement = preactCreateElement,
}: HighlightItemParams<THit>) {
  return parseAlgoliaHitSnippet<THit>({ hit, attribute }).map((x, index) =>
    x.isHighlighted ? createElement(tagName, { key: index }, x.value) : x.value
  );
}

/**
 * Highlights and escapes the non-matching parts of an Algolia hit snippet.
 *
 * This is a common pattern for Query Suggestions.
 */
export function reverseSnippetHit<THit extends SnippetedHit<unknown>>({
  hit,
  attribute,
  tagName = 'mark',
  createElement = preactCreateElement,
}: HighlightItemParams<THit>) {
  return parseAlgoliaHitReverseSnippet<THit>({
    hit,
    attribute,
  }).map((x, index) =>
    x.isHighlighted ? createElement(tagName, { key: index }, x.value) : x.value
  );
}
