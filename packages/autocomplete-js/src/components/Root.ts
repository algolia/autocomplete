import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type RootProps = WithClassNames<
  ReturnType<AutocompleteCoreApi<any>['getRootProps']>
>;

export const Root: Component<RootProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  const element = document.createElement('div');
  setProperties(element, {
    ...props,
    class: concatClassNames(['aa-Autocomplete', classNames.root]),
  });

  return element;
};
