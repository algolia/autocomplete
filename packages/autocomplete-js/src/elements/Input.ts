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
  state: AutocompleteState<any>;
};

export const Input: AutocompleteElement<InputProps, HTMLInputElement> = ({
  autocompleteScopeApi,
  environment,
  classNames,
  getInputProps,
  getInputPropsCore,
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

  setProperties(element, inputProps);

  return element;
};
