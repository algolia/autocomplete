import { AutocompleteScopeApi, BaseItem } from '@algolia/autocomplete-core';

export function createScopeApi<
  TItem extends BaseItem
>(): AutocompleteScopeApi<TItem> {
  return {
    setActiveItemId: jest.fn(),
    setQuery: jest.fn(),
    setCollections: jest.fn(),
    setIsOpen: jest.fn(),
    setStatus: jest.fn(),
    setContext: jest.fn(),
    navigator: {
      navigate: jest.fn(),
      navigateNewTab: jest.fn(),
      navigateNewWindow: jest.fn(),
    },
    refresh: jest.fn(),
  };
}
