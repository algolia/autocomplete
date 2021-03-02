import { getAttributeValueByPath, warn } from '@algolia/autocomplete-shared';

import { HighlightedHit } from './HighlightedHit';
import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { parseAttribute } from './parseAttribute';
import { ParsedAttribute } from './ParsedAttribute';

export function parseAlgoliaHitHighlight<THit extends HighlightedHit<unknown>>({
  hit,
  attribute,
}: ParseAlgoliaHitParams<THit>): ParsedAttribute[] {
  const path = Array.isArray(attribute) ? attribute : ([attribute] as string[]);
  let highlightedValue = getAttributeValueByPath(hit, [
    '_highlightResult',
    ...path,
    'value',
  ]);

  if (typeof highlightedValue !== 'string') {
    warn(
      false,
      `The attribute "${path.join('.')}" described by the path ${JSON.stringify(
        path
      )} does not exist on the hit. Did you set it in \`attributesToHighlight\`?` +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToHighlight/'
    );

    highlightedValue = getAttributeValueByPath(hit, path) || '';
  }

  return parseAttribute({ highlightedValue });
}
