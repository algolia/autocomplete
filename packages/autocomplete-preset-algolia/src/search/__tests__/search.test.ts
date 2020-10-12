import {
  MultipleQueriesResponse,
  SearchResponse,
} from '@algolia/client-search';

import { version } from '../../version';
import { getAlgoliaHits } from '../getAlgoliaHits';
import { getAlgoliaResults } from '../getAlgoliaResults';

function createSingleSearchResponse<THit>(
  partialResponse: Partial<SearchResponse<THit>> = {}
): SearchResponse<THit> {
  const {
    query = '',
    page = 0,
    hitsPerPage = 20,
    hits = [],
    nbHits = hits.length,
    nbPages = Math.ceil(nbHits / hitsPerPage),
    params = '',
    exhaustiveNbHits = true,
    exhaustiveFacetsCount = true,
    processingTimeMS = 0,
    ...rest
  } = partialResponse;

  return {
    page,
    hitsPerPage,
    nbHits,
    nbPages,
    processingTimeMS,
    hits,
    query,
    params,
    exhaustiveNbHits,
    exhaustiveFacetsCount,
    ...rest,
  };
}

function createMultiSearchResponse<THit>(
  ...partialReponses: Array<Partial<SearchResponse<THit>>>
): MultipleQueriesResponse<THit> {
  return {
    results: partialReponses.map(createSingleSearchResponse),
  };
}

function createSearchClient(): any {
  return {
    search: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse<{ label: string }>(
          { hits: [{ objectID: '1', label: 'Hit 1' }] },
          { hits: [{ objectID: '2', label: 'Hit 2' }] }
        )
      )
    ),
  };
}

describe('getAlgoliaResults', () => {
  test('with default options', async () => {
    const searchClient = createSearchClient();

    const results = await getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 5,
          highlightPreTag: '__aa-highlight__',
          highlightPostTag: '__/aa-highlight__',
        },
      },
    ]);
    expect(results).toEqual([
      expect.objectContaining({ hits: [{ objectID: '1', label: 'Hit 1' }] }),
      expect.objectContaining({ hits: [{ objectID: '2', label: 'Hit 2' }] }),
    ]);
  });

  test('with custom search parameters', async () => {
    const searchClient = createSearchClient();

    const results = await getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 10,
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          page: 2,
        },
      },
    ]);
    expect(results).toEqual([
      expect.objectContaining({ hits: [{ objectID: '1', label: 'Hit 1' }] }),
      expect.objectContaining({ hits: [{ objectID: '2', label: 'Hit 2' }] }),
    ]);
  });

  test('attaches Algolia agent', async () => {
    const searchClient = createSearchClient();
    searchClient.addAlgoliaAgent = jest.fn();

    await getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledTimes(1);
    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledWith(
      'autocomplete-core',
      version
    );
  });
});

describe('getAlgoliaHits', () => {
  test('with default options', async () => {
    const searchClient = createSearchClient();

    const hits = await getAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 5,
          highlightPreTag: '__aa-highlight__',
          highlightPostTag: '__/aa-highlight__',
        },
      },
    ]);
    expect(hits).toEqual([
      [{ objectID: '1', label: 'Hit 1' }],
      [{ objectID: '2', label: 'Hit 2' }],
    ]);
  });

  test('with custom search parameters', async () => {
    const searchClient = createSearchClient();

    const hits = await getAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 10,
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          page: 2,
        },
      },
    ]);
    expect(hits).toEqual([
      [{ objectID: '1', label: 'Hit 1' }],
      [{ objectID: '2', label: 'Hit 2' }],
    ]);
  });

  test('attaches Algolia agent', async () => {
    const searchClient = createSearchClient();
    searchClient.addAlgoliaAgent = jest.fn();

    await getAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledTimes(1);
    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledWith(
      'autocomplete-core',
      version
    );
  });
});
