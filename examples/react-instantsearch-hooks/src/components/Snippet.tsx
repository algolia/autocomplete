import { Hit as AlgoliaHit } from '@algolia/client-search';
import {
  getHighlightedParts,
  getPropertyByPath,
} from 'instantsearch.js/es/lib/utils';

import { cx } from '../utils';

type HighlightPartProps = {
  children: React.ReactNode;
  highlightedTagName: React.ElementType;
  nonHighlightedTagName: React.ElementType;
  isHighlighted: boolean;
};

function HighlightPart({
  children,
  highlightedTagName,
  isHighlighted,
  nonHighlightedTagName,
}: HighlightPartProps) {
  const TagName = isHighlighted ? highlightedTagName : nonHighlightedTagName;

  return (
    <TagName
      className={
        isHighlighted ? 'ais-Snippet-highlighted' : 'ais-Snippet-nonHighlighted'
      }
    >
      {children}
    </TagName>
  );
}

export type HighlightProps<THit> = {
  hit: THit;
  attribute: keyof THit | string[];
  highlightedTagName?: React.ElementType;
  nonHighlightedTagName?: React.ElementType;
  className?: string;
  separator?: string;
};

export function Snippet<THit extends AlgoliaHit<Record<string, unknown>>>({
  hit,
  attribute,
  highlightedTagName = 'mark',
  nonHighlightedTagName = 'span',
  separator = ', ',
  ...rest
}: HighlightProps<THit>) {
  const { value: attributeValue = '' } =
    getPropertyByPath(hit._snippetResult, attribute as string) || {};
  const parts = getHighlightedParts(attributeValue);

  return (
    <span {...rest} className={cx('ais-Snippet', rest.className)}>
      {parts.map((part, partIndex) => {
        if (Array.isArray(part)) {
          const isLastPart = partIndex === parts.length - 1;

          return (
            <span key={partIndex}>
              {part.map((subPart, subPartIndex) => (
                <HighlightPart
                  key={subPartIndex}
                  highlightedTagName={highlightedTagName}
                  nonHighlightedTagName={nonHighlightedTagName}
                  isHighlighted={subPart.isHighlighted}
                >
                  {subPart.value}
                </HighlightPart>
              ))}

              {!isLastPart && (
                <span className="ais-Snippet-separator">{separator}</span>
              )}
            </span>
          );
        }

        return (
          <HighlightPart
            key={partIndex}
            highlightedTagName={highlightedTagName}
            nonHighlightedTagName={nonHighlightedTagName}
            isHighlighted={part.isHighlighted}
          >
            {part.value}
          </HighlightPart>
        );
      })}
    </span>
  );
}
