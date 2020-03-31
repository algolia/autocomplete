import React, { MutableRefObject } from 'react';
import {
  GetFormProps,
  GetLabelProps,
  GetInputProps,
} from '@francoischalifour/autocomplete-core';

import { SearchIcon } from './SearchIcon';
import { ResetIcon } from './ResetIcon';
import { LoadingIcon } from './LoadingIcon';

interface SearchBoxProps {
  inputRef: MutableRefObject<HTMLInputElement | null>;
  query: string;
  getFormProps: GetFormProps<React.FormEvent>;
  getLabelProps: GetLabelProps;
  getInputProps: GetInputProps<
    React.ChangeEvent,
    React.MouseEvent,
    React.KeyboardEvent
  >;
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
          hidden={!props.query}
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
