import {
  AutocompleteOptions,
  createAutocomplete,
} from '@francoischalifour/autocomplete-core';
import React, { useRef, useState } from 'react';

export function useAutocomplete<
  TItem,
  TChangeEvent = React.ChangeEvent,
  TMouseEvent = React.MouseEvent,
  TKeyboardEvent = React.KeyboardEvent
>(props: AutocompleteOptions<TItem>) {
  const [state, setState] = useState(props.initialState);

  const autocomplete = useRef(
    createAutocomplete<TItem, TChangeEvent, TMouseEvent, TKeyboardEvent>({
      ...props,
      onStateChange({ state }) {
        setState(state as any);

        props.onStateChange({ state });
      },
    })
  );

  return [state, autocomplete.current] as const;
}
