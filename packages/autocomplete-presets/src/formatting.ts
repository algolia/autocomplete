const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const unescapedHtml = /[&<>"']/g;
const hasUnescapedHtml = RegExp(unescapedHtml.source);

function escape(value: string): string {
  return value && hasUnescapedHtml.test(value)
    ? value.replace(unescapedHtml, char => htmlEscapes[char])
    : value;
}

function parseHighlightedAttribute({
  highlightPreTag,
  highlightPostTag,
  highlightedValue,
}) {
  const splitByPreTag = highlightedValue.split(highlightPreTag);
  const firstValue = splitByPreTag.shift();
  const elements =
    firstValue === '' ? [] : [{ value: firstValue, isHighlighted: false }];

  if (highlightPostTag === highlightPreTag) {
    let isHighlighted = true;

    splitByPreTag.forEach(split => {
      elements.push({ value: split, isHighlighted });
      isHighlighted = !isHighlighted;
    });
  } else {
    splitByPreTag.forEach(split => {
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

function getPropertyByPath(hit: object, path: string): string {
  const parts = path.split('.');
  const value = parts.reduce((current, key) => current && current[key], hit);

  return typeof value === 'string' ? value : '';
}

interface HighlightOptions {
  hit: any;
  attribute: string;
  highlightPreTag?: string;
  highlightPostTag?: string;
  ignoreEscape?: string[];
}

interface GetHighlightedValue extends HighlightOptions {
  hitKey: '_highlightResult' | '_snippetResult';
}

function getHighlightedValue({
  hit,
  hitKey,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape = [],
}: GetHighlightedValue): string {
  const highlightedValue = getPropertyByPath(
    hit,
    `${hitKey}.${attribute}.value`
  );

  return parseHighlightedAttribute({
    highlightPreTag,
    highlightPostTag,
    highlightedValue,
  })
    .map(part => {
      const escapedValue =
        ignoreEscape.indexOf(part.value) === -1
          ? part.value
          : escape(part.value);

      return part.isHighlighted
        ? `${highlightPreTag}${escapedValue}${highlightPostTag}`
        : escapedValue;
    })
    .join('');
}

export function highlightAlgoliaHit(options: HighlightOptions): string {
  return getHighlightedValue({
    hitKey: '_highlightResult',
    ...options,
  });
}

export function snippetAlgoliaHit(options: HighlightOptions): string {
  return getHighlightedValue({
    hitKey: '_snippetResult',
    ...options,
  });
}

export function reverseHighlightAlgoliaHit({
  hit,
  attribute,
  highlightPreTag = '<mark>',
  highlightPostTag = '</mark>',
  ignoreEscape = [],
}: HighlightOptions): string {
  const highlightedValue = getPropertyByPath(
    hit,
    `_highlightResult.${attribute}.value`
  );
  const parsedHighlightedAttribute = parseHighlightedAttribute({
    highlightPreTag,
    highlightPostTag,
    highlightedValue,
  });
  const noPartsMatch = !parsedHighlightedAttribute.some(
    part => part.isHighlighted
  );

  return parsedHighlightedAttribute
    .map(part => {
      const escapedValue =
        ignoreEscape.indexOf(part.value) === -1
          ? part.value
          : escape(part.value);

      // We don't want to highlight the whole word when no parts match.
      if (noPartsMatch) {
        return escapedValue;
      }

      return part.isHighlighted
        ? escapedValue
        : `${highlightPreTag}${escapedValue}${highlightPostTag}`;
    })
    .join('');
}
