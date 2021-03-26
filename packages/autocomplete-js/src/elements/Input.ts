import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';

import { createDomElement } from '../createDomElement';
import { AutocompletePropGetters, AutocompleteState } from '../types';
import { AutocompleteElement } from '../types/AutocompleteElement';
import { setProperties } from '../utils';

type InputProps = {
  autocompleteScopeApi: AutocompleteScopeApi<any>;
  getInputProps: AutocompletePropGetters<any>['getInputProps'];
  getInputPropsCore: AutocompleteCoreApi<any>['getInputProps'];
  onDetachedEscape?(): void;
  state: AutocompleteState<any>;
};

export const Input: AutocompleteElement<InputProps, HTMLInputElement> = ({
  autocompleteScopeApi,
  classNames,
  getInputProps,
  getInputPropsCore,
  onDetachedEscape,
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
      if (onDetachedEscape && event.key === 'Escape') {
        onDetachedEscape();
        return;
      }

      inputProps.onKeyDown(event);
    },
  });

  return element;
};
