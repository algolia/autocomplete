/** @jsx h */

import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';

import { createAutocomplete } from '../autocomplete-core';
import { getDefaultProps } from '../autocomplete-core/defaultProps';
import { SearchBox } from './SearchBox';
import { Dropdown } from './Dropdown';

import {
  PublicAutocompleteOptions,
  AutocompleteState,
} from '../autocomplete-core/types/index';

export function Autocomplete<TItem extends {}>(
  providedProps: PublicAutocompleteOptions<TItem>
) {
  const props = getDefaultProps(providedProps);
  const [state, setState] = useState<AutocompleteState<TItem>>(
    props.initialState
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLFormElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const autocomplete = useRef(
    createAutocomplete<TItem>({
      ...props,
      onStateChange({ state }) {
        setState(state as any);

        props.onStateChange({ state });
      },
    })
  );


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
        inputRef={inputRef}
        placeholder={props.placeholder}
        query={state.query}
        isOpen={state.isOpen}
        status={state.status}
        getLabelProps={autocomplete.current.getLabelProps}
        getInputProps={autocomplete.current.getInputProps}
        completion={autocomplete.current.getCompletion()}
        {...autocomplete.current.getFormProps({
          inputElement: inputRef.current,
        })}
      />

      {state.isOpen && (
        <Dropdown
          suggestions={state.suggestions}
          isOpen={state.isOpen}
          status={state.status}
          getItemProps={autocomplete.current.getItemProps}
          getMenuProps={autocomplete.current.getMenuProps}
        />
      )}
    </div>
  );
}
