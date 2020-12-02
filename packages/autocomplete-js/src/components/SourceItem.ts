import { AutocompleteApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type SourceItemProps = WithClassNames<
  ReturnType<AutocompleteApi<any>['getItemProps']>
>;

export const SourceItem: Component<SourceItemProps, HTMLLIElement> = ({
  classNames,
  ...props
}) => {
  return Element<'li'>('li', {
    ...props,
    class: concatClassNames(['aa-Item', classNames.item]),
  });
};
