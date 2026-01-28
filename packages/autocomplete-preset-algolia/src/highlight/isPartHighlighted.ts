import { ParsedAttribute } from './ParsedAttribute';

const htmlEscapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};
const hasLetterOrNumber = (() => {
  try {
    return new RegExp('[\\p{L}\\p{N}_]', 'u');
  } catch {
    return new RegExp(/\w/i);
  }
})();
const regexEscapedHtml = /&(amp|quot|lt|gt|#39);/g;
const regexHasEscapedHtml = RegExp(regexEscapedHtml.source);

function unescape(value: string): string {
  return value && regexHasEscapedHtml.test(value)
    ? value.replace(regexEscapedHtml, (character) => htmlEscapes[character])
    : value;
}

export function isPartHighlighted(parts: ParsedAttribute[], i: number) {
  const current = parts[i];
  const isNextHighlighted = parts[i + 1]?.isHighlighted || true;
  const isPreviousHighlighted = parts[i - 1]?.isHighlighted || true;

  if (
    !hasLetterOrNumber.test(unescape(current.value)) &&
    isPreviousHighlighted === isNextHighlighted
  ) {
    return isPreviousHighlighted;
  }

  return current.isHighlighted;
}
