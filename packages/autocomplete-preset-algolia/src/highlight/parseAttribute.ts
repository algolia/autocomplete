import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';

import { ParsedAttribute } from './ParsedAttribute';

const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

type ParseAttributeParams = {
  highlightedValue: string;
  ignoreEscape?: string[];
};

export function parseAttribute({
  highlightedValue,
  ignoreEscape = [],
}: ParseAttributeParams): ParsedAttribute[] {
  const unescapedHtmlRegex = new RegExp(
    `[${Object.keys(htmlEscapes)
      .filter((character) => ignoreEscape.indexOf(character) === -1)
      .join('')}]`,
    'g'
  );
  const hasUnescapedHtmlRegex = RegExp(unescapedHtmlRegex.source);

  function escape(value: string) {
    return hasUnescapedHtmlRegex.test(value)
      ? value.replace(unescapedHtmlRegex, (key) => htmlEscapes[key])
      : value;
  }

  const splitByPreTag = highlightedValue.split(HIGHLIGHT_PRE_TAG);
  const firstValue = splitByPreTag.shift();
  const elements = !firstValue
    ? []
    : [{ value: escape(firstValue), isHighlighted: false }];

  splitByPreTag.forEach((split) => {
    const splitByPostTag = split.split(HIGHLIGHT_POST_TAG);

    elements.push({
      value: escape(splitByPostTag[0]),
      isHighlighted: true,
    });

    if (splitByPostTag[1] !== '') {
      elements.push({
        value: escape(splitByPostTag[1]),
        isHighlighted: false,
      });
    }
  });

  return elements;
}
