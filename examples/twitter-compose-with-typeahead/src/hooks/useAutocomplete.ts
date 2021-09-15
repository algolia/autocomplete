import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import { useMemo, useState } from 'react';

import type { AutocompleteItem } from '../types';

export function useAutocomplete(props: AutocompleteOptions<AutocompleteItem>) {
  const [state, setState] = useState<AutocompleteState<AutocompleteItem>>(
    () => ({
      collections: [],
      completion: null,
      context: {},
      isOpen: false,
      query: '',
      activeItemId: null,
      status: 'idle',
    })
  );

  const autocomplete = useMemo(
    () =>
      createAutocomplete<
        AutocompleteItem,
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
