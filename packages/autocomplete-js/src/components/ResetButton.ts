import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';
import { ResetIcon } from './ResetIcon';

type ResetButtonProps = WithClassNames<{}>;

export const ResetButton: Component<ResetButtonProps, HTMLButtonElement> = ({
  classNames,
  children = [],
  ...props
}) => {
  return Element<'button'>('button', {
    ...props,
    type: 'reset',
    class: concatClassNames('aa-ResetButton', classNames.resetButton),
    children: [ResetIcon({}), ...children],
  });
};
