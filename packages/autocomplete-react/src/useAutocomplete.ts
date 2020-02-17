import { useState, useRef } from 'preact/hooks';

import {
  createAutocomplete,
  AutocompleteOptions,
} from '@francoischalifour/autocomplete-core';

export function useAutocomplete<TItem>(props: AutocompleteOptions<TItem>) {
  const [state, setState] = useState(props.initialState);

  const autocomplete = useRef(
    createAutocomplete<TItem>({
      ...props,
      onStateChange({ state }) {
        setState(state as any);

        props.onStateChange({ state });
      },
    })
  );

  return [state, autocomplete.current] as const;
}
