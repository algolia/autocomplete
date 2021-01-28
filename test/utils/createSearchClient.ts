import { SearchClient } from 'algoliasearch/lite';

import {
  createMultiSearchResponse,
  createSFFVResponse,
  createSingleSearchResponse,
} from './createApiResponse';

export function createSearchClient(
  args: Partial<SearchClient> = {}
): SearchClient {
  return {
    appId: '',
    addAlgoliaAgent: jest.fn(),
    clearCache: jest.fn(),
    initIndex: jest.fn(),
    transporter: {} as any,
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
  };
}
