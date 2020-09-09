const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

type ParseAttributeParams = {
  highlightPreTag?: string;
  highlightPostTag?: string;
  highlightedValue: string;
  ignoreEscape?: string[];
};

type ParsedAttribute = { value: string; isHighlighted: boolean };

export function parseAttribute({
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
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

  const splitByPreTag = highlightedValue.split(highlightPreTag);
  const firstValue = splitByPreTag.shift();
  const elements = !firstValue
    ? []
    : [{ value: firstValue, isHighlighted: false }];

  if (highlightPostTag === highlightPreTag) {
    let isHighlighted = true;

    splitByPreTag.forEach((split) => {
      elements.push({ value: escape(split), isHighlighted });
      isHighlighted = !isHighlighted;
    });
  } else {
    splitByPreTag.forEach((split) => {
      const splitByPostTag = split.split(highlightPostTag);

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
  }

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
  highlightPreTag?: string;
  highlightPostTag?: string;
  ignoreEscape?: string[];
};

export function parseHighlightedAttribute({
  hit,
  attribute,
  highlightPreTag,
  highlightPostTag,
  ignoreEscape,
}: SharedParseAttributeParams): ParsedAttribute[] {
  const highlightedValue = getAttributeValueByPath(
    hit,
    `_highlightResult.${attribute}.value`
  );

  return parseAttribute({
    highlightPreTag,
    highlightPostTag,
    highlightedValue,
    ignoreEscape,
  });
}

export function parseReverseHighlightedAttribute({
  hit,
  attribute,
  highlightPreTag,
  highlightPostTag,
  ignoreEscape,
}: SharedParseAttributeParams): ParsedAttribute[] {
  return reverseHighlightedParts(
    parseHighlightedAttribute({
      hit,
      attribute,
      highlightPreTag,
      highlightPostTag,
      ignoreEscape,
    })
  );
}

export function parseSnippetedAttribute({
  hit,
  attribute,
  highlightPreTag,
  highlightPostTag,
  ignoreEscape,
}: SharedParseAttributeParams): ParsedAttribute[] {
  const highlightedValue = getAttributeValueByPath(
    hit,
    `_snippetResult.${attribute}.value`
  );

  return parseAttribute({
    highlightPreTag,
    highlightPostTag,
    highlightedValue,
    ignoreEscape,
  });
}

export function parseReverseSnippetedAttribute({
  hit,
  attribute,
  highlightPreTag,
  highlightPostTag,
  ignoreEscape,
}: SharedParseAttributeParams): ParsedAttribute[] {
  return reverseHighlightedParts(
    parseSnippetedAttribute({
      hit,
      attribute,
      highlightPreTag,
      highlightPostTag,
      ignoreEscape,
    })
  );
}
