import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type InputProps = WithClassNames<{
  getInputProps: AutocompleteCoreApi<any>['getInputProps'];
  onTouchEscape?(): void;
}>;

export const Input: Component<InputProps, HTMLInputElement> = ({
  classNames,
  getInputProps,
  onTouchEscape,
}) => {
  const element = document.createElement('input');
  const inputProps = getInputProps({ inputElement: element });

  return Element<'input'>(element, {
    ...inputProps,
    onKeyDown(event: KeyboardEvent) {
      if (onTouchEscape && event.key === 'Escape') {
        onTouchEscape();
        return;
      }

      inputProps.onKeyDown(event);
    },
    class: concatClassNames(['aa-Input', classNames.input]),
  });
};
