import {
  parseAlgoliaHitHighlight,
  parseAlgoliaHitReverseHighlight,
  parseAlgoliaHitSnippet,
  parseAlgoliaHitReverseSnippet,
} from '@algolia/autocomplete-preset-algolia';
import { Hit } from '@algolia/client-search';

type ParsedAttribute = {
  value: string;
  isHighlighted: boolean;
};

function concatParts(
  parts: ParsedAttribute[],
  { highlightPreTag, highlightPostTag }
) {
  return parts.reduce<string>((acc, current) => {
    return (
      acc +
      (current.isHighlighted
        ? `${highlightPreTag}${current.value}${highlightPostTag}`
        : current.value)
    );
  }, '');
}

type HighlightItemParams<TItem> = {
  item: TItem;
  attribute: keyof TItem;
  highlightPreTag?: string;
  highlightPostTag?: string;
  ignoreEscape?: string[];
};

/**
 * Highlights and escapes the matching parts of an Algolia hit.
 */
export function highlightHit<TItem extends Hit<{}>>({
  item: hit,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams<TItem>) {
  return concatParts(
    parseAlgoliaHitHighlight<TItem>({
      hit,
      attribute,
      ignoreEscape,
    }),
    { highlightPreTag, highlightPostTag }
  );
}

/**
 * Highlights and escapes the non-matching parts of an Algolia hit.
 *
 * This is a common pattern for Query Suggestions.
 */
export function reverseHighlightHit<TItem extends Hit<{}>>({
  item: hit,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams<TItem>) {
  return concatParts(
    parseAlgoliaHitReverseHighlight<TItem>({
      hit,
      attribute,
      ignoreEscape,
    }),
    { highlightPreTag, highlightPostTag }
  );
}

/**
 * Highlights and escapes the matching parts of an Algolia hit snippet.
 */
export function snippetHit<TItem extends Hit<{}>>({
  item: hit,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams<TItem>) {
  return concatParts(
    parseAlgoliaHitSnippet<TItem>({
      hit,
      attribute,
      ignoreEscape,
    }),
    { highlightPreTag, highlightPostTag }
  );
}

/**
 * Highlights and escapes the non-matching parts of an Algolia hit snippet.
 *
 * This is a common pattern for Query Suggestions.
 */
export function reverseSnippetHit<TItem extends Hit<{}>>({
  item: hit,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams<TItem>) {
  return concatParts(
    parseAlgoliaHitReverseSnippet<TItem>({
      hit,
      attribute,
      ignoreEscape,
    }),
    { highlightPreTag, highlightPostTag }
  );
}
