import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type TouchSearchButtonPlaceholderProps = WithClassNames<{}>;

export const TouchSearchButtonPlaceholder: Component<
  TouchSearchButtonPlaceholderProps,
  HTMLDivElement
> = ({ classNames, ...props }) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames(
      'aa-TouchSearchButtonPlaceholder',
      classNames.touchSearchButtonPlaceholder
    ),
  });
};
