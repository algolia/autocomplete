import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { AutocompletePropGetters, AutocompleteState } from '../types';
import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type InputProps = WithClassNames<{
  state: AutocompleteState<any>;
  getInputProps: AutocompletePropGetters<any>['getInputProps'];
  getInputPropsCore: AutocompleteCoreApi<any>['getInputProps'];
}>;

export const Input: Component<InputProps, HTMLInputElement> = ({
  classNames,
  getInputProps,
  getInputPropsCore,
  state,
}) => {
  const element = document.createElement('input');
  setProperties(element, {
    ...getInputProps({
      state,
      props: getInputPropsCore({ inputElement: element }),
      inputElement: element,
    }),
    class: concatClassNames(['aa-Input', classNames.input]),
  });

  return element;
};
