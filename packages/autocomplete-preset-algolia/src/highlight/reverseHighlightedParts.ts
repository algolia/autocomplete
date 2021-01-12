import { isPartHighlighted } from './isPartHighlighted';
import { ParsedAttribute } from './ParsedAttribute';

export function reverseHighlightedParts(parts: ParsedAttribute[]) {
  // We don't want to highlight the whole word when no parts match.
  if (!parts.some((part) => part.isHighlighted)) {
    return parts.map((part) => ({ ...part, isHighlighted: false }));
  }

  return parts.map((part, i) => ({
    ...part,
    isHighlighted: !isPartHighlighted(parts, i),
  }));
}
