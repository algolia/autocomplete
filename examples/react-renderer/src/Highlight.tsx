import { parseAlgoliaHitHighlight } from '@algolia/autocomplete-preset-algolia';
import { createElement, Fragment } from 'react';

type HighlightHitParams<THit> = {
  /**
   * The Algolia hit whose attribute to retrieve the highlighted parts from.
   */
  hit: THit;
  /**
   * The attribute to retrieve the highlighted parts from.
   *
   * You can use the array syntax to reference nested attributes.
   */
  attribute: keyof THit | string[];
  /**
   * The tag name to use for highlighted parts.
   *
   * @default "mark"
   */
  tagName?: string;
};

export function Highlight<THit>({
  hit,
  attribute,
  tagName = 'mark',
}: HighlightHitParams<THit>): JSX.Element {
  return createElement(
    Fragment,
    {},
    parseAlgoliaHitHighlight<THit>({ hit, attribute }).map(
      ({ value, isHighlighted }, index) => {
        if (isHighlighted) {
          return createElement(tagName, { key: index }, value);
        }

        return value;
      }
    )
  );
}
