import { getAttributeValueByPath, warn } from '@algolia/autocomplete-shared';

import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { parseAttribute } from './parseAttribute';
import { ParsedAttribute } from './ParsedAttribute';
import { SnippetedHit } from './SnippetedHit';

export function parseAlgoliaHitSnippet<THit extends SnippetedHit<unknown>>({
  hit,
  attribute,
}: ParseAlgoliaHitParams<THit>): ParsedAttribute[] {
  const path = Array.isArray(attribute) ? attribute : ([attribute] as string[]);
  let highlightedValue = getAttributeValueByPath(hit, [
    '_snippetResult',
    ...path,
    'value',
  ]);

  if (typeof highlightedValue !== 'string') {
    warn(
      false,
      `The attribute "${path.join('.')}" described by the path ${JSON.stringify(
        path
      )} does not exist on the hit. Did you set it in \`attributesToSnippet\`?` +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/'
    );

    highlightedValue = getAttributeValueByPath(hit, path) || '';
  }

  return parseAttribute({ highlightedValue });
}
