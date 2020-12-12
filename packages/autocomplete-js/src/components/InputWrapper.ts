import { Component, WithClassNames } from '../types/Component';
import { concatClassNames } from '../utils';

import { Element } from './Element';

type InputWrapperProps = WithClassNames<{}>;

export const InputWrapper: Component<InputWrapperProps, HTMLDivElement> = ({
  classNames,
  ...props
}) => {
  return Element<'div'>('div', {
    ...props,
    class: concatClassNames('aa-InputWrapper', classNames.inputWrapper),
  });
};
