import { Hit } from '@algolia/client-search';

import { warn } from '../utils';

import { getAttributeValueByPath } from './getAttributeValueByPath';
import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { parseAttribute } from './parseAttribute';
import { ParsedAttribute } from './ParsedAttribute';

export function parseAlgoliaHitHighlight<THit extends Hit<{}>>({
  hit,
  attribute,
  ignoreEscape,
}: ParseAlgoliaHitParams<THit>): ParsedAttribute[] {
  const path = `_highlightResult.${attribute}.value`;
  let highlightedValue = getAttributeValueByPath(hit, path);

  if (typeof highlightedValue !== 'string') {
    warn(
      `The attribute ${JSON.stringify(
        path
      )} does not exist on the hit. Did you set it in \`attributesToHighlight\`?` +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToHighlight/'
    );

    highlightedValue = '';
  }

  return parseAttribute({
    highlightedValue,
    ignoreEscape,
  });
}
