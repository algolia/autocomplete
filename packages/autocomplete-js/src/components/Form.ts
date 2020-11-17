import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type FormProps = WithClassNames<
  ReturnType<AutocompleteCoreApi<unknown>['getFormProps']>
>;

export const Form: Component<FormProps, HTMLFormElement> = ({
  classNames,
  ...props
}) => {
  const element = document.createElement('form');
  setProperties(element, {
    ...props,
    class: concatClassNames(['aa-Form', classNames.form]),
  });

  return element;
};
