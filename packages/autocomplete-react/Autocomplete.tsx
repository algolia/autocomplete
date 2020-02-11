/** @jsx h */

import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';

import { createAutocomplete } from '../autocomplete-core';
import { getDefaultProps } from '../autocomplete-core/defaultProps';
import {
  AutocompleteState,
  AutocompleteOptions,
} from '../autocomplete-core/types';
import { SearchBox } from './SearchBox';
import { Dropdown } from './Dropdown';

export function Autocomplete<TItem extends {}>(
  providedProps: AutocompleteOptions<TItem>
) {
  const props = getDefaultProps(providedProps);
  const [state, setState] = useState<AutocompleteState<TItem>>(
    props.initialState
  );

  const autocomplete = useRef(
    createAutocomplete<TItem>({
      ...props,
      onStateChange({ state }) {
        setState(state as any);

        if (props.onStateChange) {
          props.onStateChange({ state });
        }
      },
    })
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={[
        'algolia-autocomplete',
        state.status === 'stalled' && 'algolia-autocomplete--stalled',
        state.status === 'error' && 'algolia-autocomplete--errored',
      ]
        .filter(Boolean)
        .join(' ')}
      {...autocomplete.current.getRootProps()}
    >
      <SearchBox
        placeholder={props.placeholder}
        onInputRef={inputRef}
        query={state.query}
        isOpen={state.isOpen}
        status={state.status}
        getInputProps={autocomplete.current.getInputProps}
        completion={autocomplete.current.getCompletion()}
        {...autocomplete.current.getFormProps({
          inputElement: inputRef.current,
        })}
      />

      <Dropdown
        suggestions={state.suggestions}
        isOpen={state.isOpen}
        status={state.status}
        getItemProps={autocomplete.current.getItemProps}
        getMenuProps={autocomplete.current.getMenuProps}
      />
    </div>
  );
}
