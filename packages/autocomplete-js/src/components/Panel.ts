import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';

import { Component, WithClassNames } from '../types/Component';
import { concatClassNames, setProperties } from '../utils';

import { Element } from './Element';

type PanelProps = WithClassNames<
  ReturnType<AutocompleteCoreApi<any>['getPanelProps']>
>;

export const Panel: Component<PanelProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  const element = Element<'div'>('div', {
    ...props,
    class: concatClassNames('aa-Panel', classNames.panel),
  });

  if (__TEST__) {
    setProperties(element, {
      'data-testid': 'panel',
    });
  }

  return element;
};
