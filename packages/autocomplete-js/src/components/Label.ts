import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

import { SearchIcon } from './SearchIcon';

type LabelProps = WithClassNames<
  ReturnType<AutocompleteCoreApi<any>['getLabelProps']>
>;

export const Label: Component<LabelProps, HTMLLabelElement> = ({
  classNames,
  ...props
}) => {
  const element = document.createElement('label');
  setProperties(element, {
    ...props,
    class: concatClassNames(['aa-Label', classNames.label]),
  });

  element.appendChild(SearchIcon({}));

  return element;
};
