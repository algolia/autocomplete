import {
  parseAlgoliaHitHighlight,
  parseAlgoliaHitReverseHighlight,
  parseAlgoliaHitSnippet,
  parseAlgoliaHitReverseSnippet,
} from '@algolia/autocomplete-preset-algolia';

type ParsedAttribute = { value: string; isHighlighted: boolean };

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
export function highlightItem<TItem extends object>({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams<TItem>) {
  return concatParts(
    parseAlgoliaHitHighlight<TItem>({
      hit: item,
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
export function reverseHighlightItem<TItem extends object>({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams<TItem>) {
  return concatParts(
    parseAlgoliaHitReverseHighlight<TItem>({
      hit: item,
      attribute,
      ignoreEscape,
    }),
    { highlightPreTag, highlightPostTag }
  );
}

/**
 * Highlights and escapes the matching parts of an Algolia hit snippet.
 */
export function snippetItem<TItem extends object>({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams<TItem>) {
  return concatParts(
    parseAlgoliaHitSnippet<TItem>({
      hit: item,
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
export function reverseSnippetItem<TItem extends object>({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams<TItem>) {
  return concatParts(
    parseAlgoliaHitReverseSnippet<TItem>({
      hit: item,
      attribute,
      ignoreEscape,
    }),
    { highlightPreTag, highlightPostTag }
  );
}
