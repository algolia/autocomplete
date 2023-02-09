import {
  createScopeApi,
  createSource,
  createState,
} from '../../../../../test/utils';
import { getNormalizedSources } from '../getNormalizedSources';

describe('getNormalizedSources', () => {
  test('returns a promise of sources', async () => {
    const getSources = () => [createSource()];
    const params = {
      query: '',
      state: createState({
        query: 'query',
      }),
      ...createScopeApi(),
    };

    await expect(getNormalizedSources(getSources, params)).resolves.toEqual([
      {
        getItemInputValue: expect.any(Function),
        getItemUrl: expect.any(Function),
        getItems: expect.any(Function),
        onActive: expect.any(Function),
        onResolve: expect.any(Function),
        onSelect: expect.any(Function),
        sourceId: expect.any(String),
      },
    ]);
  });

  test('filters out falsy sources', async () => {
    const getSources = () => [createSource(), false, undefined];
    const params = {
      query: '',
      state: createState({
        query: 'query',
      }),
      ...createScopeApi(),
    };

    await expect(getNormalizedSources(getSources, params)).resolves.toEqual([
      {
        getItemInputValue: expect.any(Function),
        getItemUrl: expect.any(Function),
        getItems: expect.any(Function),
        onActive: expect.any(Function),
        onResolve: expect.any(Function),
        onSelect: expect.any(Function),
        sourceId: expect.any(String),
      },
    ]);
  });

  test('with wrong `getSources` function return type triggers invariant', async () => {
    const getSources = () => ({});
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    // @ts-expect-error
    await expect(getNormalizedSources(getSources, params)).rejects.toEqual(
      new Error(
        '[Autocomplete] The `getSources` function must return an array of sources but returned type "object":\n\n{}'
      )
    );
  });

  test('with wrong `getSources` function return type containing circular references triggers invariant', async () => {
    const circular = { self: null };
    circular.self = circular;

    const getSources = () => circular;
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    // @ts-expect-error
    await expect(getNormalizedSources(getSources, params)).rejects.toEqual(
      new Error(
        '[Autocomplete] The `getSources` function must return an array of sources but returned type "object":\n\n{\n  "self": "[Circular]"\n}'
      )
    );
  });

  test('with missing `sourceId` triggers invariant', async () => {
    const getSources = () => [
      {
        getItems() {
          return [];
        },
        templates: {
          item() {},
        },
      },
    ];
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    // @ts-expect-error
    await expect(getNormalizedSources(getSources, params)).rejects.toEqual(
      new Error('[Autocomplete] A source must provide a `sourceId` string.')
    );
  });

  test('with wrong `sourceId` type triggers invariant', async () => {
    const getSources = () => [
      {
        sourceId: ['testSource'],
        getItems() {
          return [];
        },
        templates: {
          item() {},
        },
      },
    ];
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    await expect(getNormalizedSources(getSources, params)).rejects.toEqual(
      new Error('[Autocomplete] A source must provide a `sourceId` string.')
    );
  });

  test('with duplicate `sourceId`s throws', async () => {
    const getSources = () => [
      {
        sourceId: 'testSource',
        getItems() {
          return [];
        },
        templates: {
          item() {},
        },
      },
      {
        sourceId: 'testSource',
        getItems() {
          return [];
        },
        templates: {
          item() {},
        },
      },
    ];
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    await expect(getNormalizedSources(getSources, params)).rejects.toEqual(
      new Error('[Autocomplete] The `sourceId` "testSource" is not unique.')
    );
  });

  test('provides a default implementation for getItemInputValue which returns the query', async () => {
    const getSources = () => [{ sourceId: 'testSource', getItems: () => [] }];
    const params = {
      query: '',
      state: createState({
        query: 'query',
      }),
      ...createScopeApi(),
    };

    const [normalizedSource] = await getNormalizedSources(getSources, params);

    expect(normalizedSource.getItemInputValue({ ...params, item: {} })).toEqual(
      'query'
    );
  });

  test('provides a default implementation for getItemUrl', async () => {
    const getSources = () => [{ sourceId: 'testSource', getItems: () => [] }];
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    const [normalizedSource] = await getNormalizedSources(getSources, params);

    expect(
      normalizedSource.getItemUrl({ ...params, item: {} })
    ).toBeUndefined();
  });

  test('provides a default implementation for onSelect', async () => {
    const getSources = () => [{ sourceId: 'testSource', getItems: () => [] }];
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    const [normalizedSource] = await getNormalizedSources(getSources, params);
    normalizedSource.onSelect({
      ...params,
      item: {},
      event: new Event(''),
      itemInputValue: '',
      itemUrl: '',
      source: createSource(),
    });

    expect(params.setIsOpen).toHaveBeenCalledTimes(1);
    expect(params.setIsOpen).toHaveBeenCalledWith(false);
  });

  test('provides a default implementation for onActive', async () => {
    const getSources = () => [{ sourceId: 'testSource', getItems: () => [] }];
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    const [normalizedSource] = await getNormalizedSources(getSources, params);

    expect(
      normalizedSource.onActive({
        ...params,
        item: {},
        event: new Event(''),
        itemInputValue: '',
        itemUrl: '',
        source: createSource(),
      })
    ).toBeUndefined();
  });
});
