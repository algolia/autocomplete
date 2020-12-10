import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';
import { ResetIcon } from './ResetIcon';

type ResetButtonProps = WithClassNames<{
  hidden: boolean;
}>;

export const ResetButton: Component<ResetButtonProps, HTMLButtonElement> = ({
  classNames,
  ...props
}) => {
  const element = Element<'button'>('button', {
    type: 'reset',
    class: concatClassNames(['aa-ResetButton', classNames.resetButton]),
    ...props,
  });

  element.appendChild(ResetIcon({}));

  return element;
};
