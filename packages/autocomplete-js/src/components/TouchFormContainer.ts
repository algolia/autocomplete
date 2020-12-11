import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type TouchFormContainerProps = WithClassNames<{}>;

export const TouchFormContainer: Component<
  TouchFormContainerProps,
  HTMLDivElement
> = ({ classNames, ...props }) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames(
      'aa-TouchFormContainer',
      classNames.touchFormContainer
    ),
  });
};
