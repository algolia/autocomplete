import {
  parseHighlightedAttribute,
  parseReverseHighlightedAttribute,
} from '@francoischalifour/autocomplete-preset-algolia';

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
  return parseHighlightedAttribute({
    hit: item,
    attribute,
    highlightPreTag,
    highlightPostTag,
  }).reduce((acc, current) => {
    return (
      acc +
      (current.isHighlighted
        ? `${highlightPreTag}${current.value}${highlightPostTag}`
        : current.value)
    );
  }, '');
}

export function reverseHighlightItem({
  item,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
}: HighlightItemParams) {
  return parseReverseHighlightedAttribute({
    hit: item,
    attribute,
    highlightPreTag,
    highlightPostTag,
  }).reduce((acc, current) => {
    return (
      acc +
      (current.isHighlighted
        ? `${highlightPreTag}${current.value}${highlightPostTag}`
        : current.value)
    );
  }, '');
}
