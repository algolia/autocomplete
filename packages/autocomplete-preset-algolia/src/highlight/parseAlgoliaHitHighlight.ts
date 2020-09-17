import { Hit } from '@algolia/client-search';

import { getAttributeValueByPath } from './getAttributeValueByPath';
import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { parseAttribute } from './parseAttribute';
import { ParsedAttribute } from './ParsedAttribute';

export function parseAlgoliaHitHighlight<THit extends Hit<{}>>({
  hit,
  attribute,
  ignoreEscape,
}: ParseAlgoliaHitParams<THit>): ParsedAttribute[] {
  const highlightedValue = getAttributeValueByPath(
    hit,
    `_highlightResult.${attribute}.value`
  );

  return parseAttribute({
    highlightedValue,
    ignoreEscape,
  });
}
