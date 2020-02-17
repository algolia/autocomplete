import { useState, useRef } from 'preact/hooks';

import { createAutocomplete } from '../autocomplete-core';
import { AutocompleteOptions } from '../autocomplete-core/types';

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
