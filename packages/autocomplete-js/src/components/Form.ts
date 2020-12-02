import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type FormProps = WithClassNames<
  ReturnType<AutocompleteCoreApi<any>['getFormProps']>
>;

export const Form: Component<FormProps, HTMLFormElement> = ({
  classNames,
  ...props
}) => {
  return Element<'form'>('form', {
    ...props,
    class: concatClassNames(['aa-Form', classNames.form]),
  });
};
