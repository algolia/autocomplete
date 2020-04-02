import React, { MutableRefObject } from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { InternalDocSearchHit } from '../types';
import { SearchIcon } from './SearchIcon';
import { ResetIcon } from './ResetIcon';
import { LoadingIcon } from './LoadingIcon';

interface SearchBoxProps
  extends AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<InternalDocSearchHit>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onClose(): void;
}

export function SearchBox(props: SearchBoxProps) {
  const { onSubmit, onReset } = props.getFormProps({
    inputElement: props.inputRef.current,
  });

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
