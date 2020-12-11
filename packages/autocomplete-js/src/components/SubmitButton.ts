import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';
import { SearchIcon } from './SearchIcon';

type SubmitButtonProps = WithClassNames<{}>;

export const SubmitButton: Component<SubmitButtonProps, HTMLButtonElement> = ({
  classNames,
  children = [],
  ...props
}) => {
  return Element<'button'>('button', {
    ...props,
    type: 'submit',
    class: concatClassNames('aa-SubmitButton', classNames.submitButton),
    children: [SearchIcon({}), ...children],
  });
};
