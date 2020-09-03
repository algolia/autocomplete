import { version } from '@algolia/autocomplete-core';

import { Client, getAlgoliaHits, getAlgoliaResults } from '../results';

function createSearchClient() {
  return {
    search: jest.fn(() =>
      Promise.resolve({
        results: [
          { hits: [{ label: 'Hit 1' }] },
          { hits: [{ label: 'Hit 2' }] },
        ],
      })
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
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        },
      },
    ]);
    expect(results).toEqual([
      { hits: [{ label: 'Hit 1' }] },
      { hits: [{ label: 'Hit 2' }] },
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
      { hits: [{ label: 'Hit 1' }] },
      { hits: [{ label: 'Hit 2' }] },
    ]);
  });

  test('attaches Algolia agent', async () => {
    const searchClient = createSearchClient();
    (searchClient as Client).addAlgoliaAgent = jest.fn();

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

    expect((searchClient as Client).addAlgoliaAgent).toHaveBeenCalledTimes(1);
    expect((searchClient as Client).addAlgoliaAgent).toHaveBeenCalledWith(
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
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        },
      },
    ]);
    expect(hits).toEqual([{ label: 'Hit 1' }, { label: 'Hit 2' }]);
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
    expect(hits).toEqual([{ label: 'Hit 1' }, { label: 'Hit 2' }]);
  });

  test('attaches Algolia agent', async () => {
    const searchClient = createSearchClient();
    (searchClient as Client).addAlgoliaAgent = jest.fn();

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

    expect((searchClient as Client).addAlgoliaAgent).toHaveBeenCalledTimes(1);
    expect((searchClient as Client).addAlgoliaAgent).toHaveBeenCalledWith(
      'autocomplete-core',
      version
    );
  });
});
