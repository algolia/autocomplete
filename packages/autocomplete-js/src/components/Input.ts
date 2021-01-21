import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';

import { createDomElement } from '../createDomElement';
import { AutocompletePropGetters, AutocompleteState } from '../types';
import { Component } from '../types/Component';
import { setProperties } from '../utils';

type InputProps = {
  autocompleteScopeApi: AutocompleteScopeApi<any>;
  getInputProps: AutocompletePropGetters<any>['getInputProps'];
  getInputPropsCore: AutocompleteCoreApi<any>['getInputProps'];
  onTouchEscape?(): void;
  state: AutocompleteState<any>;
};

export const Input: Component<InputProps, HTMLInputElement> = ({
  autocompleteScopeApi,
  classNames,
  getInputProps,
  getInputPropsCore,
  onTouchEscape,
  state,
  ...props
}) => {
  const element = createDomElement('input', props);
  const inputProps = getInputProps({
    state,
    props: getInputPropsCore({ inputElement: element }),
    inputElement: element,
    ...autocompleteScopeApi,
  });

  setProperties(element, {
    ...inputProps,
    onKeyDown(event: KeyboardEvent) {
      if (onTouchEscape && event.key === 'Escape') {
        onTouchEscape();
        return;
      }

      inputProps.onKeyDown(event);
    },
  });

  return element;
};
