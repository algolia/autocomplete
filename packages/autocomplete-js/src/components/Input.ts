import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type InputProps = WithClassNames<{
  getInputProps: AutocompleteCoreApi<any>['getInputProps'];
}>;

export const Input: Component<InputProps, HTMLInputElement> = ({
  classNames,
  getInputProps,
}) => {
  const element = document.createElement('input');
  setProperties(element, {
    ...getInputProps({ inputElement: element }),
    class: concatClassNames(['aa-Input', classNames.input]),
  });

  return element;
};
