import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteEnvironment,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';

import { getCreateDomElement } from '../getCreateDomElement';
import { AutocompletePropGetters, AutocompleteState } from '../types';
import { AutocompleteElement } from '../types/AutocompleteElement';
import { setProperties } from '../utils';

type InputProps = {
  autocompleteScopeApi: AutocompleteScopeApi<any>;
  environment: AutocompleteEnvironment;
  getInputProps: AutocompletePropGetters<any>['getInputProps'];
  getInputPropsCore: AutocompleteCoreApi<any>['getInputProps'];
  onDetachedEscape?(): void;
  state: AutocompleteState<any>;
  useTrapFocus?: boolean;
};

export const Input: AutocompleteElement<InputProps, HTMLInputElement> = ({
  autocompleteScopeApi,
  environment,
  classNames,
  getInputProps,
  getInputPropsCore,
  onDetachedEscape,
  useTrapFocus,
  state,
  ...props
}) => {
  const createDomElement = getCreateDomElement(environment);
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
        event.preventDefault();
        onDetachedEscape();
        return;
      }

      if (useTrapFocus && event.key === 'Tab') {
        event.preventDefault();
        return;
      }

      inputProps.onKeyDown(event);
    },
  });

  return element;
};
