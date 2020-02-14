/** @jsx h */

import { h } from 'preact';
import { useRef, useState, useLayoutEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { createPopper } from '@popperjs/core/lib/popper-lite';

import { createAutocomplete } from '../autocomplete-core';
import { getDefaultProps } from '../autocomplete-core/defaultProps';
import { getHTMLElement } from './getHTMLElement';
import { SearchBox } from './SearchBox';
import { Dropdown } from './Dropdown';

import {
  AutocompleteState,
  AutocompleteOptions,
} from '../autocomplete-core/types/index';

interface PublicRendererProps {
  dropdownContainer?: string | HTMLElement;
  dropdownPlacement?: 'start' | 'end';
}

interface RendererProps extends Required<PublicRendererProps> {
  dropdownContainer: HTMLElement;
}

interface PublicProps<TItem>
  extends AutocompleteOptions<TItem>,
    RendererProps {}

export function getDefaultRendererProps(
  rendererProps: PublicRendererProps,
  autocompleteProps: AutocompleteOptions<any>
): RendererProps {
  return {
    dropdownContainer: rendererProps.dropdownContainer
      ? getHTMLElement(
          rendererProps.dropdownContainer,
          autocompleteProps.environment
        )
      : autocompleteProps.environment.document.body,
    dropdownPlacement: rendererProps.dropdownPlacement ?? 'start',
  };
}

export function Autocomplete<TItem extends {}>(
  providedProps: PublicProps<TItem>
) {
  const {
    dropdownContainer,
    dropdownPlacement,
    ...autocompleteProps
  } = providedProps;
  const props = getDefaultProps(autocompleteProps);
  const rendererProps = getDefaultRendererProps(
    { dropdownContainer, dropdownPlacement },
    props
  );

  const [state, setState] = useState<AutocompleteState<TItem>>(
    props.initialState
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLFormElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const popper = useRef<ReturnType<typeof createPopper> | null>(null);
  const autocomplete = useRef(
    createAutocomplete<TItem>({
      ...props,
      onStateChange({ state }) {
        setState(state as any);

        props.onStateChange({ state });
      },
    })
  );

  useLayoutEffect(() => {
    if (searchBoxRef.current && dropdownRef.current) {
      popper.current = createPopper(searchBoxRef.current, dropdownRef.current, {
        placement:
          rendererProps.dropdownPlacement === 'end'
            ? 'bottom-end'
            : 'bottom-start',
        modifiers: [
          // By default, Popper overrides the `margin` style to `0` because it
          // is known to cause issues when computing the position.
          // We consider this as a problem in Autocomplete because it prevents
          // users from setting different desktop/mobile styles in CSS.
          // If we leave Popper override `margin`, users would have to use the
          // `!important` CSS keyword or we would have to expose a JavaScript
          // API.
          // See https://github.com/francoischalifour/autocomplete.js/pull/25
          {
            name: 'unsetMargins',
            enabled: true,
            fn: ({ state }) => {
              state.styles.popper.margin = '';
            },
            requires: ['computeStyles'],
            phase: 'beforeWrite',
          },
        ],
      });
    }

    return () => {
      popper.current?.destroy();
    };
  }, [searchBoxRef, dropdownRef, rendererProps.dropdownPlacement]);

  useLayoutEffect(() => {
    if (state.isOpen) {
      popper.current?.update();
    }
  }, [state.isOpen]);

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
        searchBoxRef={searchBoxRef}
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

      {createPortal(
        <Dropdown
          dropdownRef={dropdownRef}
          suggestions={state.suggestions}
          isOpen={state.isOpen}
          status={state.status}
          getItemProps={autocomplete.current.getItemProps}
          getMenuProps={autocomplete.current.getMenuProps}
        />,
        rendererProps.dropdownContainer
      )}
    </div>
  );
}
