import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';

import { AutocompletePropGetters, AutocompleteState } from '../types';
import { Component } from '../types/Component';
import { setProperties } from '../utils';

import { Element } from './Element';

type InputProps = {
  onTouchEscape?(): void;
  state: AutocompleteState<any>;
  getInputProps: AutocompletePropGetters<any>['getInputProps'];
  getInputPropsCore: AutocompleteCoreApi<any>['getInputProps'];
  autocompleteScopeApi: AutocompleteScopeApi<any>;
};

export const Input: Component<InputProps, HTMLInputElement> = ({
  classNames,
  getInputProps,
  getInputPropsCore,
  state,
  autocompleteScopeApi,
  onTouchEscape,
  ...props
}) => {
  const element = Element('input', props);
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
