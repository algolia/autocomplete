import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

type PanelProps = WithClassNames<
  ReturnType<AutocompleteCoreApi<any>['getPanelProps']>
>;

export const Panel: Component<PanelProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  const element = document.createElement('div');
  setProperties(element, {
    ...props,
    class: concatClassNames(['aa-Panel', classNames.panel]),
  });

  if (__TEST__) {
    setProperties(element, {
      'data-testid': 'panel',
    });
  }

  return element;
};
