import { createAutocomplete } from '../createAutocomplete';

describe('createAutocomplete', () => {
  test('returns the API', () => {
    const autocomplete = createAutocomplete({});

    expect(autocomplete).toEqual({
      getEnvironmentProps: expect.any(Function),
      getFormProps: expect.any(Function),
      getInputProps: expect.any(Function),
      getItemProps: expect.any(Function),
      getLabelProps: expect.any(Function),
      getListProps: expect.any(Function),
      getPanelProps: expect.any(Function),
      getRootProps: expect.any(Function),
      refresh: expect.any(Function),
      setCollections: expect.any(Function),
      setContext: expect.any(Function),
      setIsOpen: expect.any(Function),
      setQuery: expect.any(Function),
      setSelectedItemId: expect.any(Function),
      setStatus: expect.any(Function),
    });
  });

  test('subscribes all plugins', () => {
    const plugin = { subscribe: jest.fn() };
    createAutocomplete({ plugins: [plugin] });

    expect(plugin.subscribe).toHaveBeenCalledTimes(1);
    expect(plugin.subscribe).toHaveBeenLastCalledWith({
      onHighlight: expect.any(Function),
      onSelect: expect.any(Function),
      setCollections: expect.any(Function),
      setContext: expect.any(Function),
      setIsOpen: expect.any(Function),
      setQuery: expect.any(Function),
      setSelectedItemId: expect.any(Function),
      setStatus: expect.any(Function),
    });
  });
});
