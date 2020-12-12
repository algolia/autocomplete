import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type TouchSearchButtonProps = WithClassNames<{
  onClick(event: MouseEvent): void;
  children: Node[];
}>;

export const TouchSearchButton: Component<
  TouchSearchButtonProps,
  HTMLButtonElement
> = ({ classNames, ...props }) => {
  return Element<'button'>('button', {
    ...props,
    class: concatClassNames(
      'aa-TouchSearchButton',
      classNames.touchSearchButton
    ),
  });
};
