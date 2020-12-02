import { AutocompleteApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type SourceListProps = WithClassNames<
  ReturnType<AutocompleteApi<any>['getListProps']>
>;

export const SourceList: Component<SourceListProps, HTMLUListElement> = ({
  classNames,
  ...props
}) => {
  return Element<'ul'>('ul', {
    ...props,
    class: concatClassNames(['aa-List', classNames.list]),
  });
};
