import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type TouchCancelButtonProps = WithClassNames<{}>;

export const TouchCancelButton: Component<
  TouchCancelButtonProps,
  HTMLButtonElement
> = ({ classNames, ...props }) => {
  return Element<'button'>('button', {
    ...props,
    textContent: 'Cancel',
    class: concatClassNames(
      'aa-TouchCancelButton',
      classNames.touchCancelButton
    ),
  });
};
