import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type RootProps = WithClassNames<
  ReturnType<AutocompleteCoreApi<any>['getRootProps']>
>;

export const Root: Component<RootProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames(['aa-Autocomplete', classNames.root]),
  });
};
