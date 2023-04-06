import { SearchClient } from 'algoliasearch/lite';

import {
  createMultiSearchResponse,
  createSFFVResponse,
  createSingleSearchResponse,
} from './createApiResponse';

export function createSearchClient(
  args: Partial<SearchClient> = {}
): SearchClient {
  /* eslint-disable @typescript-eslint/consistent-type-assertions */
  return {
    appId: '',
    addAlgoliaAgent: jest.fn(),
    clearCache: jest.fn(),
    initIndex: jest.fn(),
    transporter: {
      headers: {
        'x-algolia-application-id': 'algoliaAppId',
        'x-algolia-api-key': 'algoliaApiKey',
      },
    } as any,
    search: jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map(() => createSingleSearchResponse())
        )
      )
    ),
    searchForFacetValues: jest.fn(() =>
      Promise.resolve([createSFFVResponse()])
    ),
    ...args,
  } as SearchClient;
  /* eslint-enable @typescript-eslint/consistent-type-assertions */
}
