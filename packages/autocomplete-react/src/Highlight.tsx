import {
  parseHighlightedAttribute,
  parseReverseHighlightedAttribute,
  parseSnippetedAttribute,
} from '@francoischalifour/autocomplete-preset-algolia';
import React from 'react';

type HighlighterProps = {
  [prop: string]: unknown;
  tagName: string;
  parts: ReturnType<typeof parseHighlightedAttribute>;
};

function Highlighter({ tagName, parts, ...rest }: HighlighterProps) {
  return (
    <span {...rest}>
      {parts.map((part, index) => {
        if (part.isHighlighted) {
          return React.createElement(tagName, { key: index }, part.value);
        }

        return part.value;
      })}
    </span>
  );
}

type HighlightProps = {
  [prop: string]: unknown;
  hit: any;
  attribute: string;
  tagName?: string;
};

export function Highlight({
  hit,
  attribute,
  tagName = 'mark',
  ...rest
}: HighlightProps) {
  let parts: ReturnType<typeof parseHighlightedAttribute> = [];

  try {
    parts = parseHighlightedAttribute({
      hit,
      attribute,
      highlightPreTag: `<${tagName}>`,
      highlightPostTag: `</${tagName}>`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error.message);
  }

  return <Highlighter tagName={tagName} parts={parts} {...rest} />;
}

export function Snippet({
  hit,
  attribute,
  tagName = 'mark',
  ...rest
}: HighlightProps) {
  let parts: ReturnType<typeof parseSnippetedAttribute> = [];

  try {
    parts = parseSnippetedAttribute({
      hit,
      attribute,
      highlightPreTag: `<${tagName}>`,
      highlightPostTag: `</${tagName}>`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error.message);
  }

  return <Highlighter tagName={tagName} parts={parts} {...rest} />;
}

export function ReverseHighlight({
  hit,
  attribute,
  tagName = 'mark',
  ...rest
}: HighlightProps) {
  let parts: ReturnType<typeof parseReverseHighlightedAttribute> = [];

  try {
    parts = parseReverseHighlightedAttribute({
      hit,
      attribute,
      highlightPreTag: `<${tagName}>`,
      highlightPostTag: `</${tagName}>`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error.message);
  }

  return <Highlighter tagName={tagName} parts={parts} {...rest} />;
}
