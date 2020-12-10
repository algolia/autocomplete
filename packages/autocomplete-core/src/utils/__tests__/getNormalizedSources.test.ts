import {
  createScopeApi,
  createSource,
  createState,
} from '../../../../../test/utils';
import { getNormalizedSources } from '../getNormalizedSources';

describe('getNormalizedSources', () => {
  test('returns a promise of sources', async () => {
    const getSources = () => [{ getItems: () => [] }];
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
        onHighlight: expect.any(Function),
        onSelect: expect.any(Function),
      },
    ]);
  });

  test('filters out falsy sources', async () => {
    const getSources = () => [{ getItems: () => [] }, false, undefined];
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
        onHighlight: expect.any(Function),
        onSelect: expect.any(Function),
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

  test('provides a default implementation for getItemInputValue which returns the query', async () => {
    const getSources = () => [{ getItems: () => [] }];
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
    const getSources = () => [{ getItems: () => [] }];
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
    const getSources = () => [{ getItems: () => [] }];
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

  test('provides a default implementation for onHighlight', async () => {
    const getSources = () => [{ getItems: () => [] }];
    const params = {
      query: '',
      state: createState({}),
      ...createScopeApi(),
    };

    const [normalizedSource] = await getNormalizedSources(getSources, params);

    expect(
      normalizedSource.onHighlight({
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
