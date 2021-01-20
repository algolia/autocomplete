import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';

import { ParsedAttribute } from './ParsedAttribute';

/**
 * Creates a data structure that allows to concatenate similar highlighting
 * parts in a single value.
 */
function createAttributeSet(initialValue: ParsedAttribute[] = []) {
  const value = initialValue;

  return {
    get() {
      return value;
    },
    add(part: ParsedAttribute) {
      const lastPart: ParsedAttribute | undefined = value[value.length - 1];

      if (lastPart?.isHighlighted === part.isHighlighted) {
        value[value.length - 1] = {
          value: lastPart.value + part.value,
          isHighlighted: lastPart.isHighlighted,
        };
      } else {
        value.push(part);
      }
    },
  };
}

type ParseAttributeParams = {
  highlightedValue: string;
};

export function parseAttribute({
  highlightedValue,
}: ParseAttributeParams): ParsedAttribute[] {
  const preTagParts = highlightedValue.split(HIGHLIGHT_PRE_TAG);
  const firstValue = preTagParts.shift();
  const parts = createAttributeSet(
    firstValue ? [{ value: firstValue, isHighlighted: false }] : []
  );

  preTagParts.forEach((part) => {
    const postTagParts = part.split(HIGHLIGHT_POST_TAG);

    parts.add({
      value: postTagParts[0],
      isHighlighted: true,
    });

    if (postTagParts[1] !== '') {
      parts.add({
        value: postTagParts[1],
        isHighlighted: false,
      });
    }
  });

  return parts.get();
}
