import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';
import { SearchIcon } from './SearchIcon';

type LabelProps = WithClassNames<
  ReturnType<AutocompleteCoreApi<any>['getLabelProps']>
>;

export const Label: Component<LabelProps, HTMLLabelElement> = ({
  classNames,
  ...props
}) => {
  const element = Element<'label'>('label', {
    ...props,
    class: concatClassNames(['aa-Label', classNames.label]),
  });

  element.appendChild(SearchIcon({}));

  return element;
};
