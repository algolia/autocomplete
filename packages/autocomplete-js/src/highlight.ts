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
};

export function highlightItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
}: HighlightItemParams) {
  return concatParts(
    parseHighlightedAttribute({
      hit: item,
      attribute,
      highlightPreTag,
      highlightPostTag,
    }),
    { highlightPreTag, highlightPostTag }
  );
}

export function reverseHighlightItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
}: HighlightItemParams) {
  return concatParts(
    parseReverseHighlightedAttribute({
      hit: item,
      attribute,
      highlightPreTag,
      highlightPostTag,
    }),
    { highlightPreTag, highlightPostTag }
  );
}

export function snippetItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
}: HighlightItemParams) {
  return concatParts(
    parseSnippetedAttribute({
      hit: item,
      attribute,
      highlightPreTag,
      highlightPostTag,
    }),
    { highlightPreTag, highlightPostTag }
  );
}

export function reverseSnippetItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
}: HighlightItemParams) {
  return concatParts(
    parseReverseSnippetedAttribute({
      hit: item,
      attribute,
      highlightPreTag,
      highlightPostTag,
    }),
    { highlightPreTag, highlightPostTag }
  );
}
