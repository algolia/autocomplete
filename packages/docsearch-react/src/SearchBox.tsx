import React, { MutableRefObject } from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { InternalDocSearchHit } from './types';
import { SearchIcon } from './icons/SearchIcon';
import { ResetIcon } from './icons/ResetIcon';
import { LoadingIcon } from './icons/LoadingIcon';

interface SearchBoxProps
  extends AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<InternalDocSearchHit>;
  initialQuery: string;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onClose(): void;
}

export function SearchBox(props: SearchBoxProps) {
  const { onSubmit, onReset } = props.getFormProps({
    inputElement: props.inputRef.current,
  });
  const { initialQuery, refresh } = props;

  // We don't focus the input when there's an initial query because users
  // rather want to see the results directly. We therefore need to refresh
  // the autocomplete instance to load all the results, which is usually
  // triggered on focus.
  React.useEffect(() => {
    if (initialQuery.length > 0) {
      refresh();
    }
  }, [initialQuery, refresh]);

  return (
    <>
      <form
        action=""
        role="search"
        noValidate
        className="DocSearch-Form"
        onSubmit={onSubmit}
        onReset={onReset}
      >
        <label className="DocSearch-MagnifierLabel" {...props.getLabelProps()}>
          <SearchIcon />
        </label>

        <div className="DocSearch-LoadingIndicator">
          <LoadingIcon />
        </div>

        <input
          className="DocSearch-Input"
          ref={props.inputRef}
          {...props.getInputProps({
            autoFocus: props.initialQuery.length === 0,
            inputElement: props.inputRef.current!,
            type: 'search',
            maxLength: '512',
          })}
        />

        <button
          type="reset"
          title="Clear the query"
          className="DocSearch-Reset"
          hidden={!props.state.query}
          onClick={onReset}
        >
          <ResetIcon />
        </button>
      </form>

      <button className="DocSearch-Cancel" onClick={props.onClose}>
        Cancel
      </button>
    </>
  );
}
