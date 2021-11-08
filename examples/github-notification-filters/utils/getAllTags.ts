import { Tag } from '@algolia/autocomplete-plugin-tags';

import { NotificationFilter } from '../types';

import { splitQuery } from '.';

export function getAlltags(
  tags: Array<Tag<NotificationFilter>>,
  query: string
) {
  const [prefix, postfix] = splitQuery(query);
  const tagFromQuery = postfix
    ? [
        {
          label: `${prefix}:${postfix}`,
          token: prefix,
          value: postfix,
        },
      ]
    : [];

  return [...tags, ...tagFromQuery];
}
