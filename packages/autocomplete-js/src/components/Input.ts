import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';

import { AutocompletePropGetters, AutocompleteState } from '../types';
import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type InputProps = WithClassNames<{
  onTouchEscape?(): void;
  state: AutocompleteState<any>;
  getInputProps: AutocompletePropGetters<any>['getInputProps'];
  getInputPropsCore: AutocompleteCoreApi<any>['getInputProps'];
  autocompleteScopeApi: AutocompleteScopeApi<any>;
}>;

export const Input: Component<InputProps, HTMLInputElement> = ({
  classNames,
  getInputProps,
  getInputPropsCore,
  state,
  autocompleteScopeApi,
  onTouchEscape,
}) => {
  const element = document.createElement('input');
  const inputProps = getInputProps({
    state,
    props: getInputPropsCore({ inputElement: element }),
    inputElement: element,
    ...autocompleteScopeApi,
  });

  return Element<'input'>(element, {
    ...inputProps,
    onKeyDown(event: KeyboardEvent) {
      if (onTouchEscape && event.key === 'Escape') {
        onTouchEscape();
        return;
      }

      inputProps.onKeyDown(event);
    },
    class: concatClassNames('aa-Input', classNames.input),
  });
};
