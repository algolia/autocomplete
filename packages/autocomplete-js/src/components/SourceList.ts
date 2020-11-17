import { AutocompleteApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type SourceListProps = WithClassNames<
  ReturnType<AutocompleteApi<any>['getListProps']>
>;

export const SourceList: Component<SourceListProps, HTMLUListElement> = ({
  classNames,
  ...props
}) => {
  const element = document.createElement('ul');
  setProperties(element, {
    ...props,
    class: concatClassNames(['aa-List', classNames.list]),
  });

  return element;
};
