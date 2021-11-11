import { getAlgoliaResults, getAlgoliaFacets } from '@algolia/autocomplete-js';
import { Tag } from '@algolia/autocomplete-plugin-tags';

import { searchClient } from './searchClient';
import { Contributor, NotificationFilter, Repository } from './types';

type SearchParams = {
  query?: string;
  facet?: string;
  tags?: Array<Tag<NotificationFilter>>;
};

export const items = [
  {
    token: 'repo',
    label: 'filter by repository',
    attribute: 'name',
    search({ query, tags = [] }: SearchParams) {
      const { token, attribute } = this;

      return getAlgoliaResults<Repository>({
        searchClient,
        queries: [
          {
            indexName: 'github_repos',
            query,
            params: {
              hitsPerPage: 10,
              filters: mapToAlgoliaNegativeFilters(tags, ['name']),
            },
          },
        ],
        transformResponse({ hits }) {
          return hits[0].map((hit) => ({
            ...hit,
            token,
            label: hit.name,
            attribute,
            _highlightResult: {
              ...hit._highlightResult,
              label: hit._highlightResult[attribute],
            },
          }));
        },
      });
    },
  },
  {
    token: 'is',
    label: 'filter by status or discussion type',
    search({ query, tags = [] }: SearchParams) {
      const { token } = this;

      return Promise.resolve(
        [
          {
            label: 'read',
          },
          {
            label: 'unread',
          },
          {
            label: 'done',
          },
          {
            label: 'check-suite',
          },
          {
            label: 'commit',
          },
          {
            label: 'gist',
          },
          {
            label: 'release',
          },
          {
            label: 'repository-invitation',
          },
          {
            label: 'repository-vulnerability-alert',
          },
          {
            label: 'repository-advisory',
          },
          {
            label: 'team-discussion',
          },
          {
            label: 'discussion',
          },
          {
            label: 'issue-or-pull-request',
          },
        ]
          .filter(
            ({ label }) =>
              label.startsWith(query) &&
              !tags.some(({ value }) => value === label)
          )
          .map((item) => ({ ...item, token }))
      );
    },
  },
  {
    token: 'reason',
    label: 'filter by notification reason',
    search({ query, tags = [] }: SearchParams) {
      const { token } = this;

      return Promise.resolve(
        [
          {
            label: 'assign',
          },
          {
            label: 'author',
          },
          {
            label: 'comment',
          },
          {
            label: 'invitation',
          },
          {
            label: 'manual',
          },
          {
            label: 'mention',
          },
          {
            label: 'review-requested',
          },
          {
            label: 'security-advisory-credit',
          },
          {
            label: 'security-alert',
          },
          {
            label: 'state-change',
          },
          {
            label: 'subscribed',
          },
          {
            label: 'team-mention',
          },
          {
            label: 'ci-activity',
          },
          {
            label: 'approval-requested',
          },
        ]
          .filter(
            ({ label }) =>
              label.startsWith(query) &&
              !tags.some(({ value }) => value === label)
          )
          .map((item) => ({ ...item, token }))
      );
    },
  },
  {
    token: 'author',
    label: 'filter by notification author',
    attribute: 'login',
    search({ query, tags = [] }: SearchParams) {
      const { token, attribute } = this;

      return getAlgoliaResults<Contributor>({
        searchClient,
        queries: [
          {
            indexName: 'github_contributors',
            query,
            params: {
              hitsPerPage: 10,
              filters: mapToAlgoliaNegativeFilters(tags, ['login']),
            },
          },
        ],
        transformResponse({ hits }) {
          return hits[0].map((hit) => ({
            ...hit,
            token,
            label: hit.login,
            attribute,
            _highlightResult: {
              ...hit._highlightResult,
              label: hit._highlightResult[attribute],
            },
          }));
        },
      });
    },
  },
  {
    token: 'org',
    label: 'filter by organization',
    attribute: 'label',
    search({ query, facet, tags = [] }: SearchParams) {
      const { token, attribute } = this;

      return getAlgoliaFacets<Contributor>({
        searchClient,
        queries: [
          {
            indexName: 'github_contributors',
            facet,
            params: {
              facetQuery: query,
              maxFacetHits: 5,
              filters: mapToAlgoliaNegativeFilters(tags, ['label']),
            },
          },
        ],
        transformResponse({ facetHits }) {
          return facetHits[0].map((hit) => ({
            ...hit,
            token,
            attribute,
          }));
        },
      });
    },
  },
];

function mapToAlgoliaNegativeFilters(
  tags: Array<Tag<NotificationFilter>>,
  facetsToNegate: string[],
  operator = 'AND'
) {
  return tags
    .map(({ value, attribute }) => {
      const filter = `${attribute}:"${value}"`;

      return facetsToNegate.includes(attribute) && `NOT ${filter}`;
    })
    .filter(Boolean)
    .join(` ${operator} `);
}
