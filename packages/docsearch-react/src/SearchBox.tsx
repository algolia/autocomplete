import React, { MutableRefObject } from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { MAX_QUERY_SIZE } from './constants';
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
  autoFocus: boolean;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onClose(): void;
}

export function SearchBox(props: SearchBoxProps) {
  const { onSubmit, onReset } = props.getFormProps({
    inputElement: props.inputRef.current,
  });

  React.useEffect(() => {
    if (props.autoFocus && props.inputRef.current) {
      props.inputRef.current.focus();
    }
  }, [props.autoFocus, props.inputRef]);

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
            maxLength: MAX_QUERY_SIZE,
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
