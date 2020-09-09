import {
  parseHighlightedAttribute,
  parseReverseHighlightedAttribute,
  parseSnippetedAttribute,
  parseReverseSnippetedAttribute,
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

type HighlightItemParams = {
  item: any;
  attribute: string;
  highlightPreTag?: string;
  highlightPostTag?: string;
  ignoreEscape?: string[];
};

/**
 * Highlights and escapes the matching parts of an Algolia hit.
 */
export function highlightItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams) {
  return concatParts(
    parseHighlightedAttribute({
      hit: item,
      attribute,
      highlightPreTag,
      highlightPostTag,
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
export function reverseHighlightItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams) {
  return concatParts(
    parseReverseHighlightedAttribute({
      hit: item,
      attribute,
      highlightPreTag,
      highlightPostTag,
      ignoreEscape,
    }),
    { highlightPreTag, highlightPostTag }
  );
}

/**
 * Highlights and escapes the matching parts of an Algolia hit snippet.
 */
export function snippetItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams) {
  return concatParts(
    parseSnippetedAttribute({
      hit: item,
      attribute,
      highlightPreTag,
      highlightPostTag,
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
export function reverseSnippetItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape,
}: HighlightItemParams) {
  return concatParts(
    parseReverseSnippetedAttribute({
      hit: item,
      attribute,
      highlightPreTag,
      highlightPostTag,
      ignoreEscape,
    }),
    { highlightPreTag, highlightPostTag }
  );
}
