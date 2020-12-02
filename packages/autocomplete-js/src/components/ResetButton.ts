import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';
import { ResetIcon } from './ResetIcon';

type ResetButtonProps = WithClassNames<{}>;

export const ResetButton: Component<ResetButtonProps, HTMLButtonElement> = ({
  classNames,
}) => {
  const element = Element<'button'>('button', {
    type: 'reset',
    class: concatClassNames(['aa-ResetButton', classNames.resetButton]),
  });

  element.appendChild(ResetIcon({}));

  return element;
};
