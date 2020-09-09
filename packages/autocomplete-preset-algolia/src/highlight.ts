import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from './constants';

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

type ParsedAttribute = { value: string; isHighlighted: boolean };

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

function getAttributeValueByPath(hit: object, path: string): string {
  const parts = path.split('.');
  const value = parts.reduce((current, key) => current && current[key], hit);

  if (typeof value !== 'string') {
    throw new Error(
      `The attribute ${JSON.stringify(path)} does not exist on the hit.`
    );
  }

  return value;
}

function reverseHighlightedParts(parts: ParsedAttribute[]) {
  // We don't want to highlight the whole word when no parts match.
  if (!parts.some((part) => part.isHighlighted)) {
    return parts.map((part) => ({ ...part, isHighlighted: false }));
  }

  return parts.map((part) => ({ ...part, isHighlighted: !part.isHighlighted }));
}

type SharedParseAttributeParams = {
  hit: any;
  attribute: string;
  ignoreEscape?: string[];
};

export function parseAlgoliaHitHighlight({
  hit,
  attribute,
  ignoreEscape,
}: SharedParseAttributeParams): ParsedAttribute[] {
  const highlightedValue = getAttributeValueByPath(
    hit,
    `_highlightResult.${attribute}.value`
  );

  return parseAttribute({
    highlightedValue,
    ignoreEscape,
  });
}

export function parseAlgoliaHitReverseHighlight(
  props: SharedParseAttributeParams
): ParsedAttribute[] {
  return reverseHighlightedParts(parseAlgoliaHitHighlight(props));
}

export function parseAlgoliaHitSnippet({
  hit,
  attribute,
  ignoreEscape,
}: SharedParseAttributeParams): ParsedAttribute[] {
  const highlightedValue = getAttributeValueByPath(
    hit,
    `_snippetResult.${attribute}.value`
  );

  return parseAttribute({
    highlightedValue,
    ignoreEscape,
  });
}

export function parseAlgoliaHitReverseSnippet(
  props: SharedParseAttributeParams
): ParsedAttribute[] {
  return reverseHighlightedParts(parseAlgoliaHitSnippet(props));
}
