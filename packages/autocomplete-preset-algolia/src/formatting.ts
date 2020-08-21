type ParseAttributeParams = {
  highlightPreTag?: string;
  highlightPostTag?: string;
  highlightedValue: string;
};

type ParsedAttribute = { value: string; isHighlighted: boolean };

export function parseAttribute({
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  highlightedValue,
}: ParseAttributeParams): ParsedAttribute[] {
  const splitByPreTag = highlightedValue.split(highlightPreTag);
  const firstValue = splitByPreTag.shift();
  const elements = !firstValue
    ? []
    : [{ value: firstValue, isHighlighted: false }];

  if (highlightPostTag === highlightPreTag) {
    let isHighlighted = true;

    splitByPreTag.forEach((split) => {
      elements.push({ value: split, isHighlighted });
      isHighlighted = !isHighlighted;
    });
  } else {
    splitByPreTag.forEach((split) => {
      const splitByPostTag = split.split(highlightPostTag);

      elements.push({
        value: splitByPostTag[0],
        isHighlighted: true,
      });

      if (splitByPostTag[1] !== '') {
        elements.push({
          value: splitByPostTag[1],
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

type SharedParseAttributeParams = {
  hit: any;
  attribute: string;
  highlightPreTag?: string;
  highlightPostTag?: string;
};

export function parseHighlightedAttribute({
  hit,
  attribute,
  highlightPreTag,
  highlightPostTag,
}: SharedParseAttributeParams): ParsedAttribute[] {
  const highlightedValue = getAttributeValueByPath(
    hit,
    `_highlightResult.${attribute}.value`
  );

  return parseAttribute({
    highlightPreTag,
    highlightPostTag,
    highlightedValue,
  });
}

export function parseReverseHighlightedAttribute({
  hit,
  attribute,
  highlightPreTag,
  highlightPostTag,
}: SharedParseAttributeParams): ParsedAttribute[] {
  const highlightedValue = getAttributeValueByPath(
    hit,
    `_highlightResult.${attribute}.value`
  );

  const parts = parseAttribute({
    highlightPreTag,
    highlightPostTag,
    highlightedValue,
  });

  // We don't want to highlight the whole word when no parts match.
  if (!parts.some((part) => part.isHighlighted)) {
    return parts.map((part) => ({ ...part, isHighlighted: false }));
  }

  return parts.map((part) => ({ ...part, isHighlighted: !part.isHighlighted }));
}

export function parseSnippetedAttribute({
  hit,
  attribute,
  highlightPreTag,
  highlightPostTag,
}: SharedParseAttributeParams): ParsedAttribute[] {
  const highlightedValue = getAttributeValueByPath(
    hit,
    `_snippetResult.${attribute}.value`
  );

  return parseAttribute({
    highlightPreTag,
    highlightPostTag,
    highlightedValue,
  });
}
