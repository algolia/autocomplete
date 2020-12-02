import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type TouchSearchProps = WithClassNames<{
  onClick(event: MouseEvent): void;
}>;

export const TouchSearchButton: Component<
  TouchSearchProps,
  HTMLButtonElement
> = ({ classNames, ...props }) => {
  return Element<'button'>('button', {
    ...props,
    class: concatClassNames([
      'aa-TouchSearchButton',
      classNames.touchSearchButton,
    ]),
  });
};
