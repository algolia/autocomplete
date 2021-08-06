import { Tag } from '@algolia/autocomplete-plugin-tags';

import { TagExtraData } from '../types';

export function mapToAlgoliaNegativeFilters(
  tags: Array<Tag<TagExtraData>>,
  facetsToNegate: string[],
  operator = 'AND'
) {
  return tags
    .map(({ label, facet }) => {
      const filter = `${facet}:"${label}"`;

      return facetsToNegate.includes(facet) ? `NOT ${filter}` : filter;
    })
    .join(` ${operator} `);
}
