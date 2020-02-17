/** @jsx h */

import { h, Ref } from 'preact';

import {
  GetInputProps,
  GetLabelProps,
} from '@francoischalifour/autocomplete-core';

export interface SearchBoxProps {
  placeholder: string;
  completion: string | null;
  isOpen: boolean;
  status: string;
  query: string;
  onReset: (event: Event) => void;
  onSubmit: (event: Event) => void;
  getInputProps: GetInputProps;
  getLabelProps: GetLabelProps;
  inputRef: Ref<HTMLInputElement>;
  searchBoxRef: Ref<HTMLFormElement>;
}

export function SearchBox(props: SearchBoxProps) {
  return (
    <form
      action=""
      role="search"
      noValidate
      className="algolia-autocomplete-form"
      onSubmit={props.onSubmit}
      onReset={props.onReset}
      ref={props.searchBoxRef}
    >
      <label
        className="algolia-autocomplete-magnifierLabel"
        {...props.getLabelProps()}
      >
        <svg viewBox="0 0 18 18">
          <path
            d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
            stroke="currentColor"
            strokeWidth="1.78"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </label>

      <div className="algolia-autocomplete-loadingIndicator">
        <svg viewBox="0 0 38 38" stroke="currentColor" strokeOpacity=".5">
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                {/*
                    // @ts-ignore */}
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </svg>
      </div>

      <div className="algolia-autocomplete-searchbox">
        {props.completion && (
          <span
            className="algolia-autocomplete-completion"
            aria-live={'assertive'}
            aria-suggest={`Press tab to select "${props.completion}"`}
          >
            {props.completion}
          </span>
        )}

        <input
          className="algolia-autocomplete-input"
          {...props.getInputProps({
            ref: props.inputRef,
            inputElement: (props.inputRef as any).current,
            type: 'search',
            maxLength: '512',
          })}
        />
      </div>

      <button
        type="reset"
        title="Clear the query"
        className="algolia-autocomplete-reset"
        hidden={!props.query}
        onClick={props.onReset}
      >
        <svg viewBox="0 0 10 10">
          <path
            d="M5 4.12L8.93.18a.62.62 0 1 1 .89.89L5.88 5l3.94 3.93a.62.62 0 1 1-.89.89L5 5.88 1.07 9.82a.62.62 0 1 1-.89-.89L4.12 5 .18 1.07a.62.62 0 1 1 .89-.89L5 4.12z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
}
