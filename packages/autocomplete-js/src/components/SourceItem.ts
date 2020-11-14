import { AutocompleteApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type SourceItemProps = WithClassNames<
  ReturnType<AutocompleteApi<any>['getItemProps']>
>;

export const SourceItem: Component<SourceItemProps, HTMLLIElement> = ({
  classNames,
  ...props
}) => {
  const element = document.createElement('li');
  setProperties(element, {
    ...props,
    class: concatClassNames(['aa-Item', classNames.item]),
  });

  return element;
};
