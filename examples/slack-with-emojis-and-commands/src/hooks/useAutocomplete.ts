import {
  AutocompleteOptions,
  AutocompleteState,
  BaseItem,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import { useMemo, useState } from 'react';

export function useAutocomplete<TItem extends BaseItem>(
  props: AutocompleteOptions<TItem>
) {
  const [state, setState] = useState<AutocompleteState<TItem>>(() => ({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
  }));

  const autocomplete = useMemo(
    () =>
      createAutocomplete<
        TItem,
        React.BaseSyntheticEvent,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        ...props,
        onStateChange(params) {
          props.onStateChange?.(params);
          setState(params.state);
        },
      }),
    []
  );

  return { autocomplete, state };
}
