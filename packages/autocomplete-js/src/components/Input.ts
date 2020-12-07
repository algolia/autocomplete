import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';

import { AutocompletePropGetters, AutocompleteState } from '../types';
import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type InputProps = WithClassNames<{
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
}) => {
  const element = document.createElement('input');
  const inputProps = getInputProps({
    state,
    props: getInputPropsCore({ inputElement: element }),
    inputElement: element,
    ...autocompleteScopeApi,
  });
  setProperties(element, {
    ...inputProps,
    class: concatClassNames(['aa-Input', classNames.input]),
  });

  return element;
};
