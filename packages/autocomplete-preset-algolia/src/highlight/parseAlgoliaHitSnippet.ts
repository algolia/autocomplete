import { warn } from '@algolia/autocomplete-shared';
import { Hit } from '@algolia/client-search';

import { getAttributeValueByPath } from './getAttributeValueByPath';
import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { parseAttribute } from './parseAttribute';
import { ParsedAttribute } from './ParsedAttribute';

export function parseAlgoliaHitSnippet<THit extends Hit<{}>>({
  hit,
  attribute,
  ignoreEscape,
}: ParseAlgoliaHitParams<THit>): ParsedAttribute[] {
  const path = `_snippetResult.${attribute}.value`;
  let highlightedValue = getAttributeValueByPath(hit, path);

  if (typeof highlightedValue !== 'string') {
    warn(
      `The attribute ${JSON.stringify(
        path
      )} does not exist on the hit. Did you set it in \`attributesToSnippet\`?` +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/'
    );

    highlightedValue = getAttributeValueByPath(hit, attribute as string) || '';
  }

  return parseAttribute({
    highlightedValue,
    ignoreEscape,
  });
}
